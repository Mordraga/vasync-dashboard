"use client";

import { useEffect, useState } from "react";

import { BotSettings } from "@/types/settings";

type SaveState = "idle" | "saving" | "saved" | "error";

const DEFAULT_SETTINGS: BotSettings = {
  reminder_lead_minutes: 15,
  match_window_days: 14,
  live_poll_interval_minutes: 5,
};

export function AdminSettingsPanel() {
  const [settings, setSettings] = useState<BotSettings>(DEFAULT_SETTINGS);
  const [saveState, setSaveState] = useState<SaveState>("idle");

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((response) => response.json())
      .then(setSettings)
      .catch(() => setSaveState("error"));
  }, []);

  async function save() {
    setSaveState("saving");
    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      setSaveState(response.ok ? "saved" : "error");
    } catch {
      setSaveState("error");
    }
  }

  return (
    <div className="card">
      <p className="section-heading">BOT SETTINGS</p>

      <div className="field">
        <label htmlFor="reminder-lead">Reminder lead time (minutes before a collab)</label>
        <input
          id="reminder-lead"
          type="number"
          min={1}
          max={1440}
          value={settings.reminder_lead_minutes}
          onChange={(event) =>
            setSettings({ ...settings, reminder_lead_minutes: Number(event.target.value) })
          }
        />
      </div>

      <div className="field">
        <label htmlFor="match-window">Match window (days ahead /collab searches)</label>
        <input
          id="match-window"
          type="number"
          min={1}
          max={90}
          value={settings.match_window_days}
          onChange={(event) => setSettings({ ...settings, match_window_days: Number(event.target.value) })}
        />
      </div>

      <div className="field">
        <label htmlFor="live-poll-interval">Live-status poll interval (minutes)</label>
        <input
          id="live-poll-interval"
          type="number"
          min={1}
          max={60}
          value={settings.live_poll_interval_minutes}
          onChange={(event) =>
            setSettings({ ...settings, live_poll_interval_minutes: Number(event.target.value) })
          }
        />
      </div>

      <div className="btn-row align-start">
        <button className="btn btn-primary" onClick={save} disabled={saveState === "saving"}>
          {saveState === "saving" ? "Saving..." : "Save Settings"}
        </button>
        {saveState === "saved" && <span className="form-status">Saved.</span>}
        {saveState === "error" && <span className="form-status error">Something went wrong.</span>}
      </div>
    </div>
  );
}
