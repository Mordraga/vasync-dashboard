/** Which Discord role IDs map to which VAsync role now lives in
 * vasync-database's server_roles table (see its README), resolved
 * server-side during login (see api/auth/callback/route.ts). The
 * dashboard only ever sees the resolved role name + staff bit, never the
 * raw ID mapping. */

const KNOWN_TAGLINES: Record<string, string> = {
  // "staff" is VAsync's internal/backend role name; the server calls that
  // role "TVHeads" (moderators), so it gets its own irregular tagline.
  staff: "TVHEAD SCHEDULING",
};

/** The header tagline swaps to whichever role the signed-in user actually
 * holds, purely for flavor - it has no bearing on what they can access.
 * Unrecognized/new role names still get a reasonable generic tagline. */
export function roleTagline(role: string): string {
  return KNOWN_TAGLINES[role] ?? `${role.toUpperCase()} SCHEDULING`;
}
