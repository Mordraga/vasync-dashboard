"use client";

import { Status } from "@/types/availability";

const LABELS: Record<Status, string> = {
  [Status.NO]: "NO",
  [Status.MAYBE]: "MAYBE",
  [Status.YES]: "YES",
};

interface StatusSelectProps {
  value: Status;
  onChange: (status: Status) => void;
}

export function StatusSelect({ value, onChange }: StatusSelectProps) {
  return (
    <select value={value} onChange={(event) => onChange(Number(event.target.value) as Status)}>
      {Object.values(Status).map((status) => (
        <option key={status} value={status}>
          {LABELS[status]}
        </option>
      ))}
    </select>
  );
}
