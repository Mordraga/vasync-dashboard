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

const ROLE_TAGLINES: Record<Role, string> = {
  entity: "ENTITY SCHEDULING",
  researcher: "RESEARCHER SCHEDULING",
  staff: "M.E.G. SCHEDULING",
};

/** The header tagline swaps to whichever role the signed-in user actually
 * holds, purely for flavor - it has no bearing on what they can access. */
export function roleTagline(role: Role): string {
  return ROLE_TAGLINES[role];
}
