import { describe, expect, it } from "vitest";

import { roleTagline } from "@/lib/role";

describe("roleTagline", () => {
  it("gives staff its irregular TVHead flavor text", () => {
    expect(roleTagline("staff")).toBe("TVHEAD SCHEDULING");
  });

  it("falls back to a generic tagline for any other role name", () => {
    expect(roleTagline("entity")).toBe("ENTITY SCHEDULING");
    expect(roleTagline("researcher")).toBe("RESEARCHER SCHEDULING");
    expect(roleTagline("explorer")).toBe("EXPLORER SCHEDULING");
  });
});
