import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { config } from "@/lib/config";
import { exchangeCodeForToken, fetchDiscordUser, fetchGuildMember } from "@/lib/discord-oauth";
import { OAUTH_STATE_COOKIE } from "@/lib/oauth-state";
import { resolveRole } from "@/lib/role";
import { createSessionToken, SESSION_COOKIE_NAME } from "@/lib/session";
import { upsertUser } from "@/lib/vasync-api";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");

  const cookieStore = await cookies();
  const expectedState = cookieStore.get(OAUTH_STATE_COOKIE)?.value;
  cookieStore.delete(OAUTH_STATE_COOKIE);

  if (!code || !state || state !== expectedState) {
    return NextResponse.redirect(new URL("/login?error=state", request.url));
  }

  const { access_token } = await exchangeCodeForToken(code);
  const [user, member] = await Promise.all([
    fetchDiscordUser(access_token),
    fetchGuildMember(access_token, config.vasyncGuildId()),
  ]);

  const role = resolveRole(member.roles);
  if (!role) {
    return NextResponse.redirect(new URL("/login?error=no_role", request.url));
  }

  const session = {
    discordId: user.id,
    displayName: member.nick ?? user.username,
    guildId: config.vasyncGuildId(),
    roleIds: member.roles,
    role,
    timezone: "UTC",
  };

  await upsertUser(session);

  cookieStore.set(SESSION_COOKIE_NAME, createSessionToken(session), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });

  return NextResponse.redirect(new URL("/dashboard", request.url));
}
