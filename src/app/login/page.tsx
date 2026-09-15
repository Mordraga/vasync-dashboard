import { DiscordIcon } from "@/components/DiscordIcon";

export default function LoginPage() {
  return (
    <main className="login-shell">
      <div>
        <p className="wordmark">VASYNC</p>
        <p>Sign in with your VAsync Discord account to register availability.</p>
        <a href="/api/auth/discord" className="discord-btn">
          <DiscordIcon />
          Sign in with Discord
        </a>
      </div>
    </main>
  );
}
