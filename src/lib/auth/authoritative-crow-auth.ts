import type { User } from "@supabase/supabase-js";

import { prisma } from "@/lib/db";
import {
  getCrowAuth,
  isPlatformConsoleRole,
  type CrowAuth,
} from "@/lib/auth/roles";
import { countRequestsForEmail } from "@/lib/services/client-request-link.service";

/**
 * Crow role for routing/authorization — metadata alone must not grant client or tenant access.
 * Platform console roles still rely on metadata until DB-backed platform RBAC is authoritative.
 */
export async function resolveAuthoritativeCrowAuth(user: User): Promise<CrowAuth> {
  const meta = getCrowAuth(user);
  if (!meta.role) {
    return meta;
  }

  if (meta.role === "client") {
    const linkedRequests =
      user.email != null ? (await countRequestsForEmail(user.email)) > 0 : false;
    const membershipCount = await prisma.tenantMembership.count({
      where: { supabaseUserId: user.id },
    });
    if (!linkedRequests && membershipCount === 0) {
      return { role: null, tenantSlugs: [] };
    }
    return meta;
  }

  if (meta.role === "tenant_admin" || meta.role === "tenant_user") {
    const memberships = await prisma.tenantMembership.findMany({
      where: { supabaseUserId: user.id },
      select: { tenant: { select: { slug: true } } },
    });
    const dbSlugs = memberships.map((row) => row.tenant.slug);
    if (dbSlugs.length === 0) {
      return { role: null, tenantSlugs: [] };
    }
    return { role: meta.role, tenantSlugs: dbSlugs };
  }

  if (isPlatformConsoleRole(meta.role)) {
    return meta;
  }

  return meta;
}

/** User view with authoritative role applied for landing resolution only. */
export function userWithAuthoritativeMetadata(
  user: User,
  auth: CrowAuth
): User {
  const appMetadata = { ...(user.app_metadata ?? {}) } as Record<string, unknown>;
  if (auth.role) {
    appMetadata.crow_role = auth.role;
    appMetadata.tenant_slugs = auth.tenantSlugs;
  } else {
    delete appMetadata.crow_role;
    delete appMetadata.tenant_slugs;
  }
  return { ...user, app_metadata: appMetadata };
}
