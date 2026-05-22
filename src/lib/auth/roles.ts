import type { User } from "@supabase/supabase-js";

/** Platform and tenant roles — stored in Supabase `app_metadata` only (not user_metadata). */
export type CrowRole =
  | "platform_admin"
  | "implementer"
  | "sales"
  | "auditor_readonly"
  | "tenant_admin"
  | "tenant_user"
  | "client";

export interface CrowAppMetadata {
  crow_role?: CrowRole;
  /** Tenant workspace slugs this user may access (tenant roles only). */
  tenant_slugs?: string[];
  /** Optional cache of request IDs linked to this client (also resolved by contact email). */
  linked_request_ids?: string[];
}

export interface CrowAuth {
  role: CrowRole | null;
  tenantSlugs: string[];
}

export function getCrowAuth(user: User | null): CrowAuth {
  if (!user) {
    return { role: null, tenantSlugs: [] };
  }
  const meta = user.app_metadata as CrowAppMetadata;
  const tenantSlugs = Array.isArray(meta.tenant_slugs)
    ? meta.tenant_slugs.filter((s): s is string => typeof s === "string")
    : [];
  const role =
    typeof meta.crow_role === "string" ? (meta.crow_role as CrowRole) : null;
  return { role, tenantSlugs };
}

export function isPlatformStaff(role: CrowRole | null): boolean {
  return role === "platform_admin" || role === "implementer";
}

/** Platform console access (may be read-only or sales-scoped). */
export function isPlatformConsoleRole(role: CrowRole | null): boolean {
  return (
    isPlatformStaff(role) ||
    role === "sales" ||
    role === "auditor_readonly"
  );
}

export function isClient(role: CrowRole | null): boolean {
  return role === "client";
}

export function canAccessPortal(role: CrowRole | null): boolean {
  return isPlatformStaff(role) || role === "sales" || isClient(role);
}

export function canAccessTenant(
  role: CrowRole | null,
  tenantSlugs: string[],
  slug: string
): boolean {
  if (isPlatformStaff(role)) return true;
  if (role === "sales") return false;
  if (
    role === "tenant_admin" ||
    role === "tenant_user" ||
    role === "auditor_readonly"
  ) {
    return tenantSlugs.includes(slug);
  }
  return false;
}

export function roleLabel(role: CrowRole | null): string {
  switch (role) {
    case "platform_admin":
      return "Platform Admin";
    case "implementer":
      return "Implementation";
    case "sales":
      return "Sales";
    case "auditor_readonly":
      return "Auditor (read-only)";
    case "tenant_admin":
      return "Tenant Admin";
    case "tenant_user":
      return "Tenant User";
    case "client":
      return "Client";
    default:
      return "Signed in";
  }
}
