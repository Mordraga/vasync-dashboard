"use client";

import { useState } from "react";

import { Override, Status } from "@/types/availability";

interface OverrideModalProps {
  initial: Override | null;
  onClose: () => void;
  onSaved: (override: Override) => void;
  onDeleted: (overrideDate: string) => void;
}

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export function OverrideModal({ initial, onClose, onSaved, onDeleted }: OverrideModalProps) {
  const [overrideDate, setOverrideDate] = useState(initial?.override_date ?? todayIsoDate());
  const [status, setStatus] = useState<Status>(initial?.status ?? Status.NO);
  const [windowStart, setWindowStart] = useState((initial?.window_start ?? "18:00:00").slice(0, 5));
  const [windowEnd, setWindowEnd] = useState((initial?.window_end ?? "22:00:00").slice(0, 5));
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSave() {
    setBusy(true);
    setError(null);
    try {
      const response = await fetch(`/api/availability/overrides/${overrideDate}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          override_date: overrideDate,
          status,
          window_start: `${windowStart}:00`,
          window_end: `${windowEnd}:00`,
        }),
      });
      if (!response.ok) throw new Error();
      onSaved(await response.json());
    } catch {
      setError("Could not save that override.");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (!initial) return;
    setBusy(true);
    setError(null);
    try {
      const response = await fetch(`/api/availability/overrides/${initial.override_date}`, { method: "DELETE" });
      if (!response.ok) throw new Error();
      onDeleted(initial.override_date);
    } catch {
      setError("Could not delete that override.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(event) => event.stopPropagation()}>
        <h2>{initial ? "Edit override" : "Add override"}</h2>

        <div className="field">
          <label htmlFor="override-date">Date</label>
          <input
            id="override-date"
            type="date"
            value={overrideDate}
            disabled={Boolean(initial)}
            onChange={(event) => setOverrideDate(event.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="override-status">Status</label>
          <select
            id="override-status"
            value={status}
            onChange={(event) => setStatus(Number(event.target.value) as Status)}
          >
            <option value={Status.NO}>NO</option>
            <option value={Status.MAYBE}>MAYBE</option>
            <option value={Status.YES}>YES</option>
          </select>
        </div>

        {status !== Status.NO && (
          <div className="field">
            <label>Window</label>
            <div className="time-range">
              <input type="time" value={windowStart} onChange={(event) => setWindowStart(event.target.value)} />
              <span className="dash">──</span>
              <input type="time" value={windowEnd} onChange={(event) => setWindowEnd(event.target.value)} />
            </div>
          </div>
        )}

        {error && <p className="form-status error">{error}</p>}

        <div className="modal-actions">
          {initial && (
            <button className="btn btn-danger" onClick={handleDelete} disabled={busy}>
              Delete
            </button>
          )}
          <span className="spacer" />
          <button className="btn" onClick={onClose} disabled={busy}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSave} disabled={busy}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
