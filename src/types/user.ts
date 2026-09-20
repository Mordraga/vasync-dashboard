/** Mirrors vasync-database's app/schemas/user.py::UserOut, minus
 * discord_id - the dashboard always already has that from its own session
 * (session.discordId), and vasync-database serializes it as a raw JSON
 * number, which would lose precision past Number.MAX_SAFE_INTEGER. */
export interface UserProfile {
  display_name: string;
  timezone: string;
  role: string;
  is_staff: boolean;
  twitch_username: string | null;
  is_live: boolean;
}
