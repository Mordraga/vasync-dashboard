/** Mirrors vasync-database's app/schemas/settings.py. */
export interface BotSettings {
  reminder_lead_minutes: number;
  match_window_days: number;
  live_poll_interval_minutes: number;
}
