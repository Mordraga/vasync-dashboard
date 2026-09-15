import { config } from "@/lib/config";

/** Mirrors vasync-database's app/core/security.py::resolve_role. Keeping
 * this in one place within the TS side avoids re-deriving the highest
 * VAsync role from a Discord role-id list in every caller. */

export type Role = "entity" | "researcher" | "staff";

export function resolveRole(roleIds: string[]): Role | null {
  const ids = new Set(roleIds);
  if (ids.has(config.staffRoleId())) return "staff";
  if (ids.has(config.researcherRoleId())) return "researcher";
  if (ids.has(config.entityRoleId())) return "entity";
  return null;
}
