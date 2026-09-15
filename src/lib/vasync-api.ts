import "server-only";

import { config } from "@/lib/config";
import type { SessionPayload } from "@/lib/session";
import type { Override, RecurringRule } from "@/types/availability";
import type { BotSettings } from "@/types/settings";

/** Server-only client for vasync-database. Every call attaches the
 * caller's already-verified Discord identity as headers, matching that
 * service's app/api/deps.py::get_caller contract. Never imported from a
 * client component - the service token must not reach the browser. */

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
    throw new Error(`vasync-database ${init.method ?? "GET"} ${path} failed: ${response.status}`);
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

export function upsertUser(session: SessionPayload): Promise<void> {
  return request(`/users/${session.discordId}`, session, {
    method: "PUT",
    body: JSON.stringify({
      discord_id: Number(session.discordId),
      display_name: session.displayName,
      timezone: session.timezone,
      role: session.role,
    }),
  });
}
