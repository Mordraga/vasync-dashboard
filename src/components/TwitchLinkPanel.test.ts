import { describe, expect, it } from "vitest";

import { extractTwitchUsername } from "@/components/TwitchLinkPanel";

describe("extractTwitchUsername", () => {
  it("passes through a bare username unchanged", () => {
    expect(extractTwitchUsername("gremthereaper")).toBe("gremthereaper");
  });

  it("strips a full channel URL down to the username", () => {
    expect(extractTwitchUsername("https://www.twitch.tv/gremthereaper")).toBe("gremthereaper");
  });

  it("strips a bare twitch.tv/ prefix", () => {
    expect(extractTwitchUsername("twitch.tv/gremthereaper")).toBe("gremthereaper");
  });

  it("drops a trailing slash or query string", () => {
    expect(extractTwitchUsername("twitch.tv/gremthereaper/")).toBe("gremthereaper");
    expect(extractTwitchUsername("twitch.tv/gremthereaper?ref=share")).toBe("gremthereaper");
  });

  it("trims surrounding whitespace", () => {
    expect(extractTwitchUsername("  gremthereaper  ")).toBe("gremthereaper");
  });
});
