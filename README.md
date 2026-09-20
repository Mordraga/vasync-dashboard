# vasync-dashboard

Discord-authenticated internal UI for registering recurring VAsync collab
availability (spec section 1). See `VAsync_Scheduling_Daemon_MVP_Spec.docx`
for the product spec.

## Layout

- `src/lib/discord-oauth.ts` - atomic Discord OAuth2 calls (authorize URL,
  token exchange, user/member lookups).
- `src/lib/role.ts` - display tagline for a resolved role name. Role
  resolution itself (Discord role ID -> VAsync role) happens server-side
  in `vasync-database` (`server_roles` table) during login, not here.
- `src/lib/session.ts` - signs/verifies the session cookie (HMAC, no
  external session store needed for MVP).
- `src/lib/vasync-api.ts` - server-only client for `vasync-database`;
  never imported from a client component, since it carries the service
  token.
- `src/app/api/auth/*` - OAuth start/callback/logout routes.
- `src/app/api/availability/*` - thin proxy routes the browser calls;
  they attach the caller's identity headers server-side and forward to
  `vasync-database`.
- `src/app/api/twitch` - thin proxy for registering/reading the caller's
  Twitch username (`vasync-database`'s `/users/{id}/twitch`), same pattern
  as the availability routes.
- `src/app/api/admin/settings` - staff-only proxy for the bot-config panel
  (`vasync-database`'s `/settings`); the backend re-checks the staff role
  itself, this route just fails fast for non-staff.
- `src/app/dashboard` - the weekly availability grid, date overrides, and
  (entities only) the Twitch link form that feeds vasync-bot's `/live`
  tracker.
- `src/app/admin` - staff-only bot settings (reminder lead time, match
  window days, live-status poll interval); redirects non-staff back to
  `/dashboard`.
- `src/components` - `AvailabilityGrid`/`WeekdayRow`/`StatusBadge` for the
  weekly grid, `OverridesPanel`/`OverrideModal` for date overrides,
  `TwitchLinkPanel` for the Twitch username form, `Header`/`AvatarMenu`
  for the top bar.

## Running locally

```bash
cp .env.example .env.local   # Discord OAuth app creds, guild ID, SESSION_SECRET, VASYNC_*
npm install
npm run dev
```

Requires a running `vasync-database` instance and a Discord OAuth2
application with the redirect URI set to `DISCORD_REDIRECT_URI`.

## Tests

```bash
npm test
```

Covers the pure logic: role tagline text, session token sign/verify
(including tamper rejection), and default/merge behavior for the weekly
availability grid. No Discord app or running API is required. The OAuth
and proxy API routes aren't covered yet - that needs Next.js route
testing tooling, not just a unit-test runner.
