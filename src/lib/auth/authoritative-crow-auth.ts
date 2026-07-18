import type { User } from "@supabase/supabase-js";

import { prisma } from "@/lib/db";
import {
  resolveAuthoritativeClientRole,
  resolveAuthoritativePlatformRole,
} from "@/lib/auth/authority-boundaries";
import { gatherCustomerAccessEvidence } from "@/lib/auth/customer-access.service";
import { listActiveInternalRolesForSupabaseUser } from "@/lib/auth/platform-internal-role.service";
import {
  getCrowAuth,
  isPlatformConsoleRole,
  type CrowAuth,
  type CrowRole,
} from "@/lib/auth/roles";
import { isPreviewDbDisabledMode } from "@/lib/runtime/preview-db-safety";

/**
 * Crow role for routing/authorization — Supabase metadata alone must not grant access.
 * Platform internal roles and customer relationships are resolved from the Crow database.
 *
 * CROW.GAP004.ALT2: On Preview DB-disabled mode, skip hosted DB authority resolution
 * (JWT metadata only for UI routing). Hosted writes remain blocked elsewhere.
 */
export async function resolveAuthoritativeCrowAuth(user: User): Promise<CrowAuth> {
  const meta = getCrowAuth(user);

  if (isPreviewDbDisabledMode()) {
    return meta.role
      ? { role: meta.role, tenantSlugs: meta.tenantSlugs }
      : { role: null, tenantSlugs: [] };
  }

  const [internalRoles, customerEvidence, tenantMemberships] = await Promise.all([
    listActiveInternalRolesForSupabaseUser(user.id),
    gatherCustomerAccessEvidence(user.id),
    prisma.tenantMembership.findMany({
      where: { supabaseUserId: user.id },
      select: { tenant: { select: { slug: true } } },
    }),
  ]);

  const platformRole = resolveAuthoritativePlatformRole(internalRoles, meta.role);
  if (platformRole) {
    return { role: platformRole, tenantSlugs: [] };
  }

  const clientRole = resolveAuthoritativeClientRole(customerEvidence, meta.role);
  if (clientRole) {
    return { role: clientRole, tenantSlugs: [] };
  }

  const dbSlugs = tenantMemberships.map((row) => row.tenant.slug);
  if (
    dbSlugs.length > 0 &&
    (meta.role === "tenant_admin" || meta.role === "tenant_user")
  ) {
    return { role: meta.role, tenantSlugs: dbSlugs };
  }

  if (meta.role && (meta.role === "client" || isPlatformConsoleRole(meta.role))) {
    return { role: null, tenantSlugs: [] };
  }

  if (meta.role === "tenant_admin" || meta.role === "tenant_user") {
    return { role: null, tenantSlugs: [] };
  }

  return meta.role ? { role: meta.role, tenantSlugs: meta.tenantSlugs } : meta;
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

export type AuthoritativeCrowAuthContext = {
  auth: CrowAuth;
  user: User;
};

export async function resolveAuthoritativeCrowAuthContext(
  user: User
): Promise<AuthoritativeCrowAuthContext> {
  const auth = await resolveAuthoritativeCrowAuth(user);
  return {
    auth,
    user: userWithAuthoritativeMetadata(user, auth),
  };
}

export function authoritativeRoleOrNull(role: CrowRole | null | undefined): CrowRole | null {
  return role ?? null;
}
