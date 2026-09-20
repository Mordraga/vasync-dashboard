import { redirect } from "next/navigation";

import { AvailabilityGrid } from "@/components/AvailabilityGrid";
import { Header } from "@/components/Header";
import { OverridesPanel } from "@/components/OverridesPanel";
import { TwitchLinkPanel } from "@/components/TwitchLinkPanel";
import { getSession } from "@/lib/current-session";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  return (
    <>
      <Header session={session} />
      <main className="page-shell">
        <div className="card">
          <h1>Welcome back, {session.displayName}</h1>
          <p className="subtitle">Log your normal wander schedule - when you're findable, and when you're not.</p>
          <AvailabilityGrid />
        </div>
        <OverridesPanel />
        {session.role === "entity" && <TwitchLinkPanel />}
      </main>
    </>
  );
}
