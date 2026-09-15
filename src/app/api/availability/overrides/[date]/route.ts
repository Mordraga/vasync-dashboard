import { NextRequest, NextResponse } from "next/server";

import { getSession } from "@/lib/current-session";
import { deleteOverride, upsertOverride } from "@/lib/vasync-api";
import type { Override } from "@/types/availability";

interface RouteParams {
  params: Promise<{ date: string }>;
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  const { date } = await params;
  const override = (await request.json()) as Override;
  const saved = await upsertOverride(session, { ...override, override_date: date });
  return NextResponse.json(saved);
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  const { date } = await params;
  await deleteOverride(session, date);
  return new NextResponse(null, { status: 204 });
}
