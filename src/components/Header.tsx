import { AvatarMenu } from "@/components/AvatarMenu";
import type { SessionPayload } from "@/lib/session";

export function Header({ session }: { session: SessionPayload }) {
  return (
    <header className="app-header">
      <div className="brand">
        <span className="wordmark">VASYNC</span>
        <span className="tagline">ENTITY / RESEARCHER SCHEDULING</span>
      </div>
      <AvatarMenu
        displayName={session.displayName}
        avatarUrl={session.avatarUrl}
        isStaff={session.role === "staff"}
      />
    </header>
  );
}
