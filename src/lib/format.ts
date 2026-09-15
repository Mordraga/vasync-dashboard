import { Status } from "@/types/availability";

export const STATUS_LABELS: Record<Status, string> = {
  [Status.NO]: "NO",
  [Status.MAYBE]: "MAYBE",
  [Status.YES]: "YES",
};

export const STATUS_KEYS: Record<Status, "no" | "maybe" | "yes"> = {
  [Status.NO]: "no",
  [Status.MAYBE]: "maybe",
  [Status.YES]: "yes",
};

/** "2026-07-27" -> "Jul 27" */
export function formatShortDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}
