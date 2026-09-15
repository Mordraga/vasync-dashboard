import { redirect } from "next/navigation";

import { getSession } from "@/lib/current-session";

export default async function HomePage() {
  const session = await getSession();
  redirect(session ? "/dashboard" : "/login");
}
