import "server-only";

import { config } from "@/lib/config";
import type { SessionPayload } from "@/lib/session";
import type { Override, RecurringRule } from "@/types/availability";
import type { BotSettings } from "@/types/settings";
import type { UserProfile } from "@/types/user";

/** Server-only client for vasync-database. Every call attaches the
 * caller's already-verified Discord identity as headers, matching that
 * service's app/api/deps.py::get_caller contract. Never imported from a
 * client component - the service token must not reach the browser. */

export class VasyncApiError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
  }
}

function identityHeaders(session: SessionPayload): Record<string, string> {
  return {
    "Content-Type": "application/json",
    "X-Service-Token": config.vasyncServiceToken(),
    "X-Discord-User-Id": session.discordId,
    "X-Discord-Guild-Id": session.guildId,
    "X-Discord-Role-Ids": session.roleIds.join(","),
  };
}

async function request<T>(path: string, session: SessionPayload, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${config.vasyncApiBaseUrl()}${path}`, {
    ...init,
    headers: { ...identityHeaders(session), ...init.headers },
  });
  if (!response.ok) {
    throw new VasyncApiError(
      response.status,
      `vasync-database ${init.method ?? "GET"} ${path} failed: ${response.status}`
    );
  }
  return response.status === 204 ? (undefined as T) : response.json();
}

export function getRecurringRules(session: SessionPayload): Promise<RecurringRule[]> {
  return request(`/users/${session.discordId}/availability`, session);
}

export function replaceRecurringRules(
  session: SessionPayload,
  rules: RecurringRule[]
): Promise<RecurringRule[]> {
  return request(`/users/${session.discordId}/availability`, session, {
    method: "PUT",
    body: JSON.stringify({ rules }),
  });
}

export function upsertOverride(session: SessionPayload, override: Override): Promise<Override> {
  return request(`/users/${session.discordId}/availability/overrides/${override.override_date}`, session, {
    method: "PUT",
    body: JSON.stringify(override),
  });
}

export function deleteOverride(session: SessionPayload, overrideDate: string): Promise<void> {
  return request(`/users/${session.discordId}/availability/overrides/${overrideDate}`, session, {
    method: "DELETE",
  });
}

export function listOverrides(session: SessionPayload): Promise<Override[]> {
  return request(`/users/${session.discordId}/availability/overrides`, session);
}

export function getBotSettings(session: SessionPayload): Promise<BotSettings> {
  return request("/settings", session);
}

export function updateBotSettings(session: SessionPayload, settings: BotSettings): Promise<BotSettings> {
  return request("/settings", session, { method: "PUT", body: JSON.stringify(settings) });
}

export function getUserProfile(session: SessionPayload): Promise<UserProfile> {
  return request(`/users/${session.discordId}`, session);
}

export function updateTwitchLink(session: SessionPayload, twitchUsername: string | null): Promise<UserProfile> {
  return request(`/users/${session.discordId}/twitch`, session, {
    method: "PUT",
    body: JSON.stringify({ twitch_username: twitchUsername }),
  });
}

export interface ResolvedIdentity {
  role: string;
  isStaff: boolean;
}

/** Called during login, before a session exists - the caller's role isn't
 * known yet (that's what this resolves), so it can't reuse `request()`,
 * which signs its headers off an already-built SessionPayload. Throws on
 * a 404, meaning none of the caller's Discord roles are configured in
 * vasync-database's server_roles table. */
export async function upsertUser(params: {
  discordId: string;
  displayName: string;
  timezone: string;
  roleIds: string[];
}): Promise<ResolvedIdentity> {
  const response = await fetch(`${config.vasyncApiBaseUrl()}/users/${params.discordId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Service-Token": config.vasyncServiceToken(),
    },
    // discord_id/role_ids stay strings here: Discord snowflakes exceed
    // Number.MAX_SAFE_INTEGER, so Number(...) would silently round to the
    // wrong value. Pydantic coerces the numeric strings to its
    // arbitrary-precision int fields without any loss.
    body: JSON.stringify({
      discord_id: params.discordId,
      display_name: params.displayName,
      timezone: params.timezone,
      role_ids: params.roleIds,
    }),
  });
  if (!response.ok) {
    throw new VasyncApiError(
      response.status,
      `vasync-database PUT /users/${params.discordId} failed: ${response.status}`
    );
  }
  const data = await response.json();
  return { role: data.role, isStaff: data.is_staff };
}
