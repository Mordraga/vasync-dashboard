export default function LoginPage() {
  return (
    <main style={{ display: "grid", placeItems: "center", height: "100vh", textAlign: "center" }}>
      <div>
        <h1>VAsync Scheduling</h1>
        <p>Sign in with your VAsync Discord account to register availability.</p>
        <a
          href="/api/auth/discord"
          style={{
            display: "inline-block",
            marginTop: "1rem",
            padding: "0.75rem 1.5rem",
            borderRadius: "8px",
            background: "#5865F2",
            color: "#fff",
            textDecoration: "none",
          }}
        >
          Sign in with Discord
        </a>
      </div>
    </main>
  );
}
