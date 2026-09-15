"use client";

import { useEffect, useState } from "react";

import { DayRow } from "@/components/DayRow";
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
      <table>
        <thead>
          <tr>
            <th>Day</th>
            <th>Status</th>
            <th>Window start</th>
            <th>Window end</th>
          </tr>
        </thead>
        <tbody>
          {rules.map((rule) => (
            <DayRow key={rule.weekday} rule={rule} onChange={updateRule} />
          ))}
        </tbody>
      </table>
      <button onClick={save} disabled={saveState === "saving"}>
        {saveState === "saving" ? "Saving..." : "Save"}
      </button>
      {saveState === "saved" && <span> Saved.</span>}
      {saveState === "error" && <span> Something went wrong.</span>}
    </div>
  );
}
