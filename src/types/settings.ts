/** Mirrors vasync-database's app/schemas/settings.py. live_announce_channel_id
 * is a string (not number) - it's a Discord channel snowflake, which
 * exceeds Number.MAX_SAFE_INTEGER. */
export interface BotSettings {
  reminder_lead_minutes: number;
  match_window_days: number;
  live_poll_interval_minutes: number;
  live_announce_channel_id: string | null;
}
