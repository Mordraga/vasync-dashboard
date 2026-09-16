import { beforeAll, describe, expect, it } from "vitest";

import { resolveRole, roleTagline } from "@/lib/role";

beforeAll(() => {
  process.env.ENTITY_ROLE_ID = "10";
  process.env.RESEARCHER_ROLE_ID = "20";
  process.env.STAFF_ROLE_ID = "30";
});

describe("resolveRole", () => {
  it("prefers staff over researcher and entity", () => {
    expect(resolveRole(["10", "20", "30"])).toBe("staff");
  });

  it("prefers researcher over entity", () => {
    expect(resolveRole(["10", "20"])).toBe("researcher");
  });

  it("falls back to entity", () => {
    expect(resolveRole(["10"])).toBe("entity");
  });

  it("returns null when no recognized role is present", () => {
    expect(resolveRole(["999"])).toBeNull();
  });
});

describe("roleTagline", () => {
  it("gives each role its own header flavor text", () => {
    expect(roleTagline("entity")).toBe("ENTITY SCHEDULING");
    expect(roleTagline("researcher")).toBe("RESEARCHER SCHEDULING");
    expect(roleTagline("staff")).toBe("M.E.G. SCHEDULING");
  });
});
