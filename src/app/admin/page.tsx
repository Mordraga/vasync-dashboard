import { redirect } from "next/navigation";

import { AdminSettingsPanel } from "@/components/AdminSettingsPanel";
import { Header } from "@/components/Header";
import { getSession } from "@/lib/current-session";

export default async function AdminPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  if (session.role !== "staff") {
    redirect("/dashboard");
  }

  return (
    <>
      <Header session={session} />
      <main className="page-shell">
        <div className="card">
          <h1>Facility Control</h1>
          <p className="subtitle">Server-wide settings for the VAsync bot. TVHead clearance required.</p>
        </div>
        <AdminSettingsPanel />
      </main>
    </>
  );
}
