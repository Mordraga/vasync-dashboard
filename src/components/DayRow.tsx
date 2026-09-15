"use client";

import { StatusSelect } from "@/components/StatusSelect";
import { RecurringRule, Status, WEEKDAY_LABELS } from "@/types/availability";

interface DayRowProps {
  rule: RecurringRule;
  onChange: (rule: RecurringRule) => void;
}

export function DayRow({ rule, onChange }: DayRowProps) {
  return (
    <tr>
      <td>{WEEKDAY_LABELS[rule.weekday]}</td>
      <td>
        <StatusSelect value={rule.status} onChange={(status) => onChange({ ...rule, status })} />
      </td>
      <td>
        <input
          type="time"
          value={rule.window_start.slice(0, 5)}
          disabled={rule.status === Status.NO}
          onChange={(event) => onChange({ ...rule, window_start: `${event.target.value}:00` })}
        />
      </td>
      <td>
        <input
          type="time"
          value={rule.window_end.slice(0, 5)}
          disabled={rule.status === Status.NO}
          onChange={(event) => onChange({ ...rule, window_end: `${event.target.value}:00` })}
        />
      </td>
    </tr>
  );
}
