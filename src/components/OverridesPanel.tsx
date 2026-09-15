"use client";

import { useEffect, useState } from "react";

import { OverrideModal } from "@/components/OverrideModal";
import { formatShortDate, STATUS_KEYS, STATUS_LABELS } from "@/lib/format";
import { Override } from "@/types/availability";

export function OverridesPanel() {
  const [overrides, setOverrides] = useState<Override[]>([]);
  const [editing, setEditing] = useState<Override | null | undefined>(undefined);

  useEffect(() => {
    fetch("/api/availability/overrides")
      .then((response) => response.json())
      .then(setOverrides)
      .catch(() => setOverrides([]));
  }, []);

  function handleSaved(saved: Override) {
    setOverrides((current) => {
      const rest = current.filter((override) => override.override_date !== saved.override_date);
      return [...rest, saved].sort((a, b) => a.override_date.localeCompare(b.override_date));
    });
    setEditing(undefined);
  }

  function handleDeleted(overrideDate: string) {
    setOverrides((current) => current.filter((override) => override.override_date !== overrideDate));
    setEditing(undefined);
  }

  return (
    <div className="card">
      <p className="section-heading">DATE OVERRIDES</p>

      {overrides.map((override) => (
        <div className="override-row" key={override.override_date}>
          <span className="override-date">{formatShortDate(override.override_date)}</span>
          <span className={`status-text ${STATUS_KEYS[override.status]}`}>{STATUS_LABELS[override.status]}</span>
          <button className="btn" onClick={() => setEditing(override)}>
            Edit
          </button>
        </div>
      ))}

      <div className="btn-row align-start">
        <button className="btn" onClick={() => setEditing(null)}>
          + Add Override
        </button>
      </div>

      {editing !== undefined && (
        <OverrideModal
          initial={editing}
          onClose={() => setEditing(undefined)}
          onSaved={handleSaved}
          onDeleted={handleDeleted}
        />
      )}
    </div>
  );
}
