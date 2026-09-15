import { describe, expect, it } from "vitest";

import { buildDefaultWeek, defaultRuleFor, mergeWithFetched } from "@/lib/availability-defaults";
import { Status } from "@/types/availability";

describe("buildDefaultWeek", () => {
  it("returns one NO rule per weekday, 0 through 6", () => {
    const week = buildDefaultWeek();
    expect(week).toHaveLength(7);
    expect(week.map((rule) => rule.weekday)).toEqual([0, 1, 2, 3, 4, 5, 6]);
    expect(week.every((rule) => rule.status === Status.NO)).toBe(true);
  });
});

describe("mergeWithFetched", () => {
  it("keeps the default for weekdays with no fetched rule", () => {
    const fetched = [{ ...defaultRuleFor(2), status: Status.YES }];
    const merged = mergeWithFetched(fetched);

    expect(merged[2]?.status).toBe(Status.YES);
    expect(merged[0]?.status).toBe(Status.NO);
    expect(merged).toHaveLength(7);
  });

  it("preserves fetched fields such as the id", () => {
    const fetched = [{ ...defaultRuleFor(4), id: 99, status: Status.MAYBE }];
    const merged = mergeWithFetched(fetched);

    expect(merged[4]).toEqual(fetched[0]);
  });
});
