import { NextRequest, NextResponse } from "next/server";

import { getSession } from "@/lib/current-session";
import { getUserProfile, updateTwitchLink } from "@/lib/vasync-api";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  const profile = await getUserProfile(session);
  return NextResponse.json({ twitch_username: profile.twitch_username });
}

export async function PUT(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  const { twitch_username: twitchUsername } = (await request.json()) as { twitch_username: string | null };
  const profile = await updateTwitchLink(session, twitchUsername);
  return NextResponse.json({ twitch_username: profile.twitch_username });
}
