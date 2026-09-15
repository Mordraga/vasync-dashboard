"use client";

import { STATUS_KEYS, STATUS_LABELS } from "@/lib/format";
import { Status } from "@/types/availability";

interface StatusBadgeProps {
  value: Status;
  onChange: (status: Status) => void;
}

export function StatusBadge({ value, onChange }: StatusBadgeProps) {
  return (
    <select
      className="status-badge"
      data-status={STATUS_KEYS[value]}
      value={value}
      onChange={(event) => onChange(Number(event.target.value) as Status)}
    >
      {(Object.values(Status) as Status[]).map((status) => (
        <option key={status} value={status}>
          {STATUS_LABELS[status]}
        </option>
      ))}
    </select>
  );
}
