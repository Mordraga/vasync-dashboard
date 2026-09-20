"use client";

import { useEffect, useState } from "react";

type SaveState = "idle" | "saving" | "saved" | "error";

const TWITCH_USERNAME_PATTERN = /^[A-Za-z0-9_]{4,25}$/;

export function TwitchLinkPanel() {
  const [twitchUsername, setTwitchUsername] = useState("");
  const [saveState, setSaveState] = useState<SaveState>("idle");

  useEffect(() => {
    fetch("/api/twitch")
      .then((response) => response.json())
      .then((data) => setTwitchUsername(data.twitch_username ?? ""))
      .catch(() => setSaveState("error"));
  }, []);

  const trimmed = twitchUsername.trim();
  const isValid = trimmed === "" || TWITCH_USERNAME_PATTERN.test(trimmed);

  async function save() {
    if (!isValid) return;

    setSaveState("saving");
    try {
      const response = await fetch("/api/twitch", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ twitch_username: trimmed || null }),
      });
      setSaveState(response.ok ? "saved" : "error");
    } catch {
      setSaveState("error");
    }
  }

  return (
    <div className="card">
      <p className="section-heading">TWITCH LINK</p>
      <p className="subtitle">
        Register your Twitch username so /live can show when you&apos;re streaming.
      </p>

      <div className="field">
        <label htmlFor="twitch-username">Twitch username</label>
        <input
          id="twitch-username"
          type="text"
          placeholder="e.g. gremthereaper"
          value={twitchUsername}
          onChange={(event) => {
            setTwitchUsername(event.target.value);
            setSaveState("idle");
          }}
        />
        {!isValid && <span className="form-status error">4-25 letters, digits, or underscores.</span>}
      </div>

      <div className="btn-row align-start">
        <button className="btn btn-primary" onClick={save} disabled={saveState === "saving" || !isValid}>
          {saveState === "saving" ? "Saving..." : "Save"}
        </button>
        {saveState === "saved" && <span className="form-status">Saved.</span>}
        {saveState === "error" && <span className="form-status error">Something went wrong.</span>}
      </div>
    </div>
  );
}
