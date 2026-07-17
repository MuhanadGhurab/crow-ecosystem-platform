/**
 * Auth metadata crow_role values that must not authorize without DB evidence.
 * `client` is legacy/metadata-only — authoritative client access requires ownership or org membership.
 */
export function isPrivilegedMetadataCrowRole(crowRole: string | null | undefined): boolean {
  if (!crowRole || crowRole === "none") return false;
  if (crowRole === "client") return false;
  return (
    crowRole === "admin" ||
    crowRole === "platform_admin" ||
    crowRole === "implementer" ||
    crowRole === "staff"
  );
}

export function isMetadataNeutralCrowRole(crowRole: string | null | undefined): boolean {
  return !crowRole || crowRole === "none" || crowRole === "client";
}

export function isMetadataOnlyClientCrowRole(crowRole: string | null | undefined): boolean {
  return crowRole === "client";
}
