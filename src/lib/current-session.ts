import "server-only";

import { cookies } from "next/headers";

import { SESSION_COOKIE_NAME, SessionPayload, verifySessionToken } from "@/lib/session";

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  return verifySessionToken(cookieStore.get(SESSION_COOKIE_NAME)?.value);
}
