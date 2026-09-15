"use client";

import { StatusBadge } from "@/components/StatusBadge";
import { RecurringRule, Status, WEEKDAY_LABELS } from "@/types/availability";

interface WeekdayRowProps {
  rule: RecurringRule;
  onChange: (rule: RecurringRule) => void;
}

export function WeekdayRow({ rule, onChange }: WeekdayRowProps) {
  const isOff = rule.status === Status.NO;

  return (
    <div className="weekday-row">
      <span className="weekday-label">{WEEKDAY_LABELS[rule.weekday]}</span>
      <StatusBadge value={rule.status} onChange={(status) => onChange({ ...rule, status })} />
      {isOff ? (
        <span className="time-range-empty">───────────────────</span>
      ) : (
        <div className="time-range">
          <input
            type="time"
            value={rule.window_start.slice(0, 5)}
            onChange={(event) => onChange({ ...rule, window_start: `${event.target.value}:00` })}
          />
          <span className="dash">──</span>
          <input
            type="time"
            value={rule.window_end.slice(0, 5)}
            onChange={(event) => onChange({ ...rule, window_end: `${event.target.value}:00` })}
          />
        </div>
      )}
    </div>
  );
}
