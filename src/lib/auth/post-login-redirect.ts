import type { User } from "@supabase/supabase-js";
import { getCrowAuth, isPlatformStaff } from "@/lib/auth/roles";

const DEFAULT_STAFF_NEXT = "/admin/overview";
const DEFAULT_CLIENT_NEXT = "/portal/requests";

/** Resolve post-auth landing path from crow_role and optional explicit ?next= */
export function resolvePostLoginPath(user: User, explicitNext?: string | null): string {
  const { role, tenantSlugs } = getCrowAuth(user);

  if (
    explicitNext &&
    explicitNext.startsWith("/") &&
    !explicitNext.startsWith("//") &&
    explicitNext !== DEFAULT_STAFF_NEXT
  ) {
    return explicitNext;
  }

  if (isPlatformStaff(role)) {
    return DEFAULT_STAFF_NEXT;
  }

  if (role === "tenant_admin" || role === "tenant_user") {
    const slug = tenantSlugs[0];
    return slug ? `/${slug}/dashboard` : "/login?error=forbidden";
  }

  if (role === "client") {
    return DEFAULT_CLIENT_NEXT;
  }

  return "/login?error=no_role";
}
