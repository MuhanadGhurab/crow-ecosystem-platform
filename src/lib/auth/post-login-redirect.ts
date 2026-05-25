import type { User } from "@supabase/supabase-js";
import {
  getCrowAuth,
  isPlatformConsoleRole,
  isPlatformStaff,
} from "@/lib/auth/roles";

const DEFAULT_STAFF_NEXT = "/admin/overview";
const DEFAULT_CLIENT_NEXT = "/portal/requests";

function isSafeRelativePath(path: string): boolean {
  return path.startsWith("/") && !path.startsWith("//");
}

/** Client-only landing paths — must not override platform staff post-login. */
function isClientPortalNext(path: string): boolean {
  return (
    path === DEFAULT_CLIENT_NEXT ||
    path.startsWith("/portal") ||
    path === "/request"
  );
}

function resolveExplicitNext(
  explicitNext: string | null | undefined,
  role: ReturnType<typeof getCrowAuth>["role"]
): string | null {
  if (!explicitNext || !isSafeRelativePath(explicitNext)) return null;
  if (isPlatformConsoleRole(role) && isClientPortalNext(explicitNext)) {
    return null;
  }
  return explicitNext;
}

/** Resolve post-auth landing path from crow_role and optional explicit ?next= */
export function resolvePostLoginPath(user: User, explicitNext?: string | null): string {
  const { role, tenantSlugs } = getCrowAuth(user);
  const next = resolveExplicitNext(explicitNext, role);

  if (isPlatformStaff(role)) {
    return next ?? DEFAULT_STAFF_NEXT;
  }

  if (role === "sales" || role === "auditor_readonly") {
    return next ?? DEFAULT_STAFF_NEXT;
  }

  if (role === "tenant_admin" || role === "tenant_user") {
    if (next) return next;
    const slug = tenantSlugs[0];
    return slug ? `/${slug}/dashboard` : "/login?error=forbidden";
  }

  if (role === "client") {
    return next ?? DEFAULT_CLIENT_NEXT;
  }

  return "/login?error=no_role";
}

export { DEFAULT_CLIENT_NEXT, DEFAULT_STAFF_NEXT };
