import { randomBytes } from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { buildAuthorizeUrl } from "@/lib/discord-oauth";
import { OAUTH_STATE_COOKIE } from "@/lib/oauth-state";

export async function GET() {
  const state = randomBytes(16).toString("hex");

  const cookieStore = await cookies();
  cookieStore.set(OAUTH_STATE_COOKIE, state, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 300,
    path: "/",
  });

  return NextResponse.redirect(buildAuthorizeUrl(state));
}
