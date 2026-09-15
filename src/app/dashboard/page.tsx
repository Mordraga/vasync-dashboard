import { redirect } from "next/navigation";

import { AvailabilityGrid } from "@/components/AvailabilityGrid";
import { getSession } from "@/lib/current-session";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  return (
    <main style={{ maxWidth: 720, margin: "2rem auto", padding: "0 1rem" }}>
      <h1>Welcome, {session.displayName}</h1>
      <p>Set your recurring collab availability. Manual date overrides come from Discord.</p>
      <AvailabilityGrid />
      <form action="/api/auth/logout" method="post" style={{ marginTop: "2rem" }}>
        <button type="submit">Sign out</button>
      </form>
    </main>
  );
}
