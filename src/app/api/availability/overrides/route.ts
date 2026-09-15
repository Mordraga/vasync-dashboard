import { NextResponse } from "next/server";

import { getSession } from "@/lib/current-session";
import { listOverrides } from "@/lib/vasync-api";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  const overrides = await listOverrides(session);
  return NextResponse.json(overrides);
}
