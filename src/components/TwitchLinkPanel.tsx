"use client";

import { useEffect, useState } from "react";

type SaveState = "idle" | "saving" | "saved" | "error";

const TWITCH_USERNAME_PATTERN = /^[A-Za-z0-9_]{4,25}$/;

/** People paste the full channel URL as often as they type a bare
 * username - accept both instead of silently rejecting the former. */
export function extractTwitchUsername(raw: string): string {
  return raw
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/^www\./i, "")
    .replace(/^twitch\.tv\//i, "")
    .split(/[/?#]/)[0] ?? "";
}

export function TwitchLinkPanel() {
  const [twitchUsername, setTwitchUsername] = useState("");
  const [saveState, setSaveState] = useState<SaveState>("idle");

  useEffect(() => {
    fetch("/api/twitch")
      .then((response) => response.json())
      .then((data) => setTwitchUsername(data.twitch_username ?? ""))
      .catch(() => setSaveState("error"));
  }, []);

  const normalized = extractTwitchUsername(twitchUsername);
  const isValid = normalized === "" || TWITCH_USERNAME_PATTERN.test(normalized);

  async function save() {
    if (!isValid) return;

    setSaveState("saving");
    try {
      const response = await fetch("/api/twitch", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ twitch_username: normalized || null }),
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
        If you&apos;ve connected Twitch under Discord Settings &rarr; Connections, this fills in
        automatically each time you sign in. Otherwise, register your Twitch username (or paste
        your channel URL) here so /live can show when you&apos;re streaming.
      </p>

      <div className="field">
        <label htmlFor="twitch-username">Twitch username</label>
        <input
          id="twitch-username"
          type="text"
          placeholder="e.g. gremthereaper or twitch.tv/gremthereaper"
          value={twitchUsername}
          onChange={(event) => {
            setTwitchUsername(event.target.value);
            setSaveState("idle");
          }}
        />
        {!isValid && (
          <span className="form-status error">
            Couldn&apos;t read a valid Twitch username out of that (4-25 letters, digits, or
            underscores).
          </span>
        )}
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
