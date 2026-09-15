import { NextRequest, NextResponse } from "next/server";

import { getSession } from "@/lib/current-session";
import { getRecurringRules, replaceRecurringRules } from "@/lib/vasync-api";
import type { RecurringRule } from "@/types/availability";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  const rules = await getRecurringRules(session);
  return NextResponse.json(rules);
}

export async function PUT(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  const rules = (await request.json()) as RecurringRule[];
  const saved = await replaceRecurringRules(session, rules);
  return NextResponse.json(saved);
}
