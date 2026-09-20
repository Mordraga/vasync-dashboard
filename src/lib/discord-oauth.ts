import { config } from "@/lib/config";

const DISCORD_API = "https://discord.com/api/v10";
const OAUTH_SCOPES = "identify guilds.members.read connections";

export interface DiscordTokenResponse {
  access_token: string;
  token_type: string;
}

export interface DiscordUser {
  id: string;
  username: string;
  avatar: string | null;
}

export interface DiscordGuildMember {
  roles: string[];
  nick: string | null;
  user: DiscordUser;
}

export interface DiscordConnection {
  type: string;
  name: string;
}

export function buildAuthorizeUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: config.discordClientId(),
    redirect_uri: config.discordRedirectUri(),
    response_type: "code",
    scope: OAUTH_SCOPES,
    state,
  });
  return `${DISCORD_API}/oauth2/authorize?${params.toString()}`;
}

export async function exchangeCodeForToken(code: string): Promise<DiscordTokenResponse> {
  const response = await fetch(`${DISCORD_API}/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: config.discordClientId(),
      client_secret: config.discordClientSecret(),
      grant_type: "authorization_code",
      code,
      redirect_uri: config.discordRedirectUri(),
    }),
  });

  if (!response.ok) {
    throw new Error(`discord token exchange failed: ${response.status}`);
  }
  return response.json();
}

export async function fetchDiscordUser(accessToken: string): Promise<DiscordUser> {
  const response = await fetch(`${DISCORD_API}/users/@me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) {
    throw new Error(`discord user lookup failed: ${response.status}`);
  }
  return response.json();
}

export async function fetchGuildMember(accessToken: string, guildId: string): Promise<DiscordGuildMember> {
  const response = await fetch(`${DISCORD_API}/users/@me/guilds/${guildId}/member`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) {
    throw new Error(`discord guild member lookup failed: ${response.status}`);
  }
  return response.json();
}

/** Requires the `connections` scope. Best-effort by design at the call
 * site (callback route) - a user can revoke/hide connections, and this
 * should never block login over it. */
export async function fetchUserConnections(accessToken: string): Promise<DiscordConnection[]> {
  const response = await fetch(`${DISCORD_API}/users/@me/connections`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) {
    throw new Error(`discord connections lookup failed: ${response.status}`);
  }
  return response.json();
}

/** Discord's CDN avatar URL, or null if the user has no custom avatar
 * (the caller falls back to initials in that case). */
export function buildAvatarUrl(user: DiscordUser): string | null {
  if (!user.avatar) return null;
  return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=64`;
}
