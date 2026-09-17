import { DiscordIcon } from "@/components/DiscordIcon";

const ERROR_MESSAGES: Record<string, string> = {
  state: "Sign-in expired before it could be confirmed. Please try again.",
  discord: "Discord couldn't complete sign-in. Please try again in a moment.",
  no_role: "Your Discord account doesn't have an authorized role on this server.",
  upstream: "The VAsync service is temporarily unavailable. Please try again shortly.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const message = error ? ERROR_MESSAGES[error] : undefined;

  return (
    <main className="login-shell">
      <div>
        <p className="wordmark">VASYNC</p>
        <p className="site-tag">Level VA-1 &mdash; Personnel Terminal</p>
        <p>Sign in with your VAsync Discord account to register availability.</p>
        {message && <p className="login-error">{message}</p>}
        <a href="/api/auth/discord" className="discord-btn">
          <DiscordIcon />
          Sign in with Discord
        </a>
        <p className="footnote">no-clip risk: minimal &middot; almond water not provided</p>
      </div>
    </main>
  );
}
