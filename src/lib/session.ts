import { createHmac, timingSafeEqual } from "crypto";

import { config } from "@/lib/config";
import type { Role } from "@/lib/role";

export const SESSION_COOKIE_NAME = "vasync_session";

export interface SessionPayload {
  discordId: string;
  displayName: string;
  guildId: string;
  roleIds: string[];
  role: Role;
  timezone: string;
  avatarUrl: string | null;
}

function sign(value: string): string {
  return createHmac("sha256", config.sessionSecret()).update(value).digest("base64url");
}

export function createSessionToken(payload: SessionPayload): string {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${body}.${sign(body)}`;
}

export function verifySessionToken(token: string | undefined): SessionPayload | null {
  if (!token) return null;

  const [body, signature] = token.split(".");
  if (!body || !signature) return null;

  const expected = sign(body);
  const actual = Buffer.from(signature);
  const expectedBuf = Buffer.from(expected);
  if (actual.length !== expectedBuf.length || !timingSafeEqual(actual, expectedBuf)) {
    return null;
  }

  try {
    return JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as SessionPayload;
  } catch {
    return null;
  }
}
