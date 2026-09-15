import { NextRequest, NextResponse } from "next/server";

import { getSession } from "@/lib/current-session";
import { getBotSettings, updateBotSettings } from "@/lib/vasync-api";
import type { BotSettings } from "@/types/settings";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  const settings = await getBotSettings(session);
  return NextResponse.json(settings);
}

export async function PUT(request: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "staff") {
    return NextResponse.json({ error: "staff role required" }, { status: 403 });
  }

  const settings = (await request.json()) as BotSettings;
  const saved = await updateBotSettings(session, settings);
  return NextResponse.json(saved);
}
