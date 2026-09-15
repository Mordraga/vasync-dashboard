import { beforeAll, describe, expect, it } from "vitest";

import { createSessionToken, verifySessionToken, type SessionPayload } from "@/lib/session";

const payload: SessionPayload = {
  discordId: "42",
  displayName: "Mordraga",
  guildId: "1",
  roleIds: ["10"],
  role: "entity",
  timezone: "UTC",
};

beforeAll(() => {
  process.env.SESSION_SECRET = "test-secret";
});

describe("session token", () => {
  it("round-trips a valid payload", () => {
    const token = createSessionToken(payload);
    expect(verifySessionToken(token)).toEqual(payload);
  });

  it("rejects a tampered payload", () => {
    const token = createSessionToken(payload);
    const [body] = token.split(".");
    const tampered = `${body}extra.${token.split(".")[1]}`;
    expect(verifySessionToken(tampered)).toBeNull();
  });

  it("rejects a missing token", () => {
    expect(verifySessionToken(undefined)).toBeNull();
  });

  it("rejects a malformed token", () => {
    expect(verifySessionToken("not-a-real-token")).toBeNull();
  });
});
