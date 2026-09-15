/** Wire-format types mirroring vasync-database's app/schemas/availability.py.
 * Field names stay snake_case to match the API response exactly, so no
 * mapping layer is needed between fetch() and the UI. */

export const Status = { NO: 0, MAYBE: 1, YES: 2 } as const;
export type Status = (typeof Status)[keyof typeof Status];

export const Recurrence = { WEEKLY: "weekly", BIWEEKLY: "biweekly" } as const;
export type Recurrence = (typeof Recurrence)[keyof typeof Recurrence];

export interface RecurringRule {
  id?: number;
  weekday: number; // 0 = Monday .. 6 = Sunday
  recurrence: Recurrence;
  anchor_date: string | null;
  status: Status;
  window_start: string; // "HH:MM:SS"
  window_end: string;
}

export interface Override {
  id?: number;
  override_date: string; // "YYYY-MM-DD"
  status: Status;
  window_start: string;
  window_end: string;
}

export const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
