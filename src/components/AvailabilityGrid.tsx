"use client";

import { useEffect, useState } from "react";

import { WeekdayRow } from "@/components/WeekdayRow";
import { buildDefaultWeek, mergeWithFetched } from "@/lib/availability-defaults";
import { RecurringRule } from "@/types/availability";

type SaveState = "idle" | "saving" | "saved" | "error";

export function AvailabilityGrid() {
  const [rules, setRules] = useState<RecurringRule[]>(buildDefaultWeek());
  const [saveState, setSaveState] = useState<SaveState>("idle");

  useEffect(() => {
    fetch("/api/availability")
      .then((response) => response.json())
      .then((fetched: RecurringRule[]) => setRules(mergeWithFetched(fetched)))
      .catch(() => setSaveState("error"));
  }, []);

  function updateRule(updated: RecurringRule) {
    setRules((current) => current.map((rule) => (rule.weekday === updated.weekday ? updated : rule)));
  }

  async function save() {
    setSaveState("saving");
    try {
      const response = await fetch("/api/availability", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rules),
      });
      setSaveState(response.ok ? "saved" : "error");
    } catch {
      setSaveState("error");
    }
  }

  return (
    <div>
      <div className="week-grid">
        {rules.map((rule) => (
          <WeekdayRow key={rule.weekday} rule={rule} onChange={updateRule} />
        ))}
      </div>
      <div className="btn-row">
        <button className="btn btn-primary" onClick={save} disabled={saveState === "saving"}>
          {saveState === "saving" ? "Saving..." : "Save Availability"}
        </button>
        {saveState === "saved" && <span className="form-status">Saved.</span>}
        {saveState === "error" && <span className="form-status error">Something went wrong.</span>}
      </div>
    </div>
  );
}
