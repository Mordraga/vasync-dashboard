import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { config } from "@/lib/config";
import {
  buildAvatarUrl,
  exchangeCodeForToken,
  fetchDiscordUser,
  fetchGuildMember,
  fetchUserConnections,
} from "@/lib/discord-oauth";
import { OAUTH_STATE_COOKIE } from "@/lib/oauth-state";
import { createSessionToken, SESSION_COOKIE_NAME } from "@/lib/session";
import { updateTwitchLink, upsertUser, VasyncApiError } from "@/lib/vasync-api";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");

  const cookieStore = await cookies();
  const expectedState = cookieStore.get(OAUTH_STATE_COOKIE)?.value;
  cookieStore.delete(OAUTH_STATE_COOKIE);

  if (!code || !state || state !== expectedState) {
    return NextResponse.redirect(new URL("/login?error=state", request.url));
  }

  let user, member, twitchUsername: string | null;
  try {
    const { access_token } = await exchangeCodeForToken(code);
    const [fetchedUser, fetchedMember, connections] = await Promise.all([
      fetchDiscordUser(access_token),
      fetchGuildMember(access_token, config.vasyncGuildId()),
      // Best-effort: a user can hide/revoke connections, or Discord can
      // hiccup here, and neither should ever block login over it.
      fetchUserConnections(access_token).catch((error) => {
        console.error("discord connections lookup failed", error);
        return [];
      }),
    ]);
    user = fetchedUser;
    member = fetchedMember;
    twitchUsername = connections.find((connection) => connection.type === "twitch")?.name ?? null;
  } catch (error) {
    console.error("discord auth failed", error);
    return NextResponse.redirect(new URL("/login?error=discord", request.url));
  }

  // Which Discord role IDs count as which VAsync role - and who's staff -
  // is resolved server-side by vasync-database (server_roles table), not
  // computed here, so a new role only needs a POST /roles there.
  let identity;
  try {
    identity = await upsertUser({
      discordId: user.id,
      displayName: member.nick ?? user.username,
      timezone: "UTC",
      roleIds: member.roles,
    });
  } catch (error) {
    if (error instanceof VasyncApiError && error.status === 404) {
      return NextResponse.redirect(new URL("/login?error=no_role", request.url));
    }
    console.error("vasync-api upsertUser failed", error);
    return NextResponse.redirect(new URL("/login?error=upstream", request.url));
  }

  const session = {
    discordId: user.id,
    displayName: member.nick ?? user.username,
    guildId: config.vasyncGuildId(),
    roleIds: member.roles,
    role: identity.role,
    isStaff: identity.isStaff,
    timezone: "UTC",
    avatarUrl: buildAvatarUrl(user),
  };

  // Discord's connected Twitch account is the source of truth when
  // present - re-synced on every login. Someone with no Twitch connected
  // there still has the dashboard's manual field as a fallback, and this
  // never overwrites that with nothing just because they didn't connect.
  if (twitchUsername) {
    try {
      await updateTwitchLink(session, twitchUsername);
    } catch (error) {
      console.error("failed to sync twitch connection", error);
    }
  }

  cookieStore.set(SESSION_COOKIE_NAME, createSessionToken(session), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });

  return NextResponse.redirect(new URL("/dashboard", request.url));
}
