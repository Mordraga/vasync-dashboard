# vasync-dashboard

Discord-authenticated internal UI for registering recurring VAsync collab
availability (spec section 1). See `VAsync_Scheduling_Daemon_MVP_Spec.docx`
for the product spec.

## Layout

- `src/lib/discord-oauth.ts` - atomic Discord OAuth2 calls (authorize URL,
  token exchange, user/member lookups).
- `src/lib/role.ts` - Discord role IDs -> VAsync `Role`, mirroring
  `vasync-database`'s `app/core/security.py`.
- `src/lib/session.ts` - signs/verifies the session cookie (HMAC, no
  external session store needed for MVP).
- `src/lib/vasync-api.ts` - server-only client for `vasync-database`;
  never imported from a client component, since it carries the service
  token.
- `src/app/api/auth/*` - OAuth start/callback/logout routes.
- `src/app/api/availability/*` - thin proxy routes the browser calls;
  they attach the caller's identity headers server-side and forward to
  `vasync-database`.
- `src/components` - `AvailabilityGrid` (state + save) composed from the
  atomic `DayRow` and `StatusSelect`.

## Running locally

```bash
cp .env.example .env.local   # Discord OAuth app creds, guild/role IDs, SESSION_SECRET, VASYNC_*
npm install
npm run dev
```

Requires a running `vasync-database` instance and a Discord OAuth2
application with the redirect URI set to `DISCORD_REDIRECT_URI`.

## Tests

```bash
npm test
```

Covers the pure logic: role resolution, session token sign/verify
(including tamper rejection), and default/merge behavior for the weekly
availability grid. No Discord app or running API is required. The OAuth
and proxy API routes aren't covered yet - that needs Next.js route
testing tooling, not just a unit-test runner.
