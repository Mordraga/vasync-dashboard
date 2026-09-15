import { Recurrence, RecurringRule, Status } from "@/types/availability";

export function defaultRuleFor(weekday: number): RecurringRule {
  return {
    weekday,
    recurrence: Recurrence.WEEKLY,
    anchor_date: null,
    status: Status.NO,
    window_start: "18:00:00",
    window_end: "22:00:00",
  };
}

export function buildDefaultWeek(): RecurringRule[] {
  return Array.from({ length: 7 }, (_, weekday) => defaultRuleFor(weekday));
}

/** Overlay fetched rules onto a full 7-day default so every weekday
 * always has exactly one row to render, even before the user has saved
 * anything for that day. */
export function mergeWithFetched(fetched: RecurringRule[]): RecurringRule[] {
  const byWeekday = new Map(fetched.map((rule) => [rule.weekday, rule]));
  return buildDefaultWeek().map((fallback) => byWeekday.get(fallback.weekday) ?? fallback);
}
