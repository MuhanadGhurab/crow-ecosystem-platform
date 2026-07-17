import type { PlatformInternalRole } from "@prisma/client";

import type { CrowRole } from "@/lib/auth/roles";
import { isPlatformConsoleRole } from "@/lib/auth/roles";

/** Priority when multiple active internal roles exist (highest wins for permission surface). */
export const PLATFORM_INTERNAL_ROLE_PRIORITY: Record<PlatformInternalRole, number> = {
  PLATFORM_ADMIN: 40,
  IMPLEMENTER: 30,
  SALES: 20,
  AUDITOR_READONLY: 10,
};

export function internalRoleToCrowRole(role: PlatformInternalRole): CrowRole {
  switch (role) {
    case "PLATFORM_ADMIN":
      return "platform_admin";
    case "IMPLEMENTER":
      return "implementer";
    case "SALES":
      return "sales";
    case "AUDITOR_READONLY":
      return "auditor_readonly";
    default: {
      const _exhaustive: never = role;
      return _exhaustive;
    }
  }
}

export function pickHighestInternalCrowRole(
  activeRoles: readonly PlatformInternalRole[]
): CrowRole | null {
  if (activeRoles.length === 0) return null;
  const sorted = [...activeRoles].sort(
    (a, b) => PLATFORM_INTERNAL_ROLE_PRIORITY[b] - PLATFORM_INTERNAL_ROLE_PRIORITY[a]
  );
  return internalRoleToCrowRole(sorted[0]!);
}

/** True when a specific internal role is independently active (not implied by another role). */
export function includesActiveInternalRole(
  activeRoles: readonly PlatformInternalRole[],
  role: PlatformInternalRole
): boolean {
  return activeRoles.includes(role);
}

export type CustomerAccessEvidence = {
  submittedRequestCount: number;
  activeOrganizationMembershipCount: number;
};

/** Authoritative client portal access — DB relationships only, never metadata or email alone. */
export function resolveAuthoritativeClientRole(
  evidence: CustomerAccessEvidence,
  metadataRole: CrowRole | null
): CrowRole | null {
  if (evidence.submittedRequestCount > 0 || evidence.activeOrganizationMembershipCount > 0) {
    return "client";
  }
  if (metadataRole === "client") {
    return null;
  }
  return null;
}

export function hasAuthoritativeCustomerPortalAccess(
  evidence: CustomerAccessEvidence
): boolean {
  return resolveAuthoritativeClientRole(evidence, null) === "client";
}

/** Uncorroborated Supabase platform metadata must not authorize ProCrow. */
export function resolveAuthoritativePlatformRole(
  activeInternalRoles: readonly PlatformInternalRole[],
  metadataRole: CrowRole | null
): CrowRole | null {
  const fromDb = pickHighestInternalCrowRole(activeInternalRoles);
  if (fromDb) return fromDb;
  if (metadataRole && isPlatformConsoleRole(metadataRole)) {
    return null;
  }
  return null;
}

export function metadataAloneWouldAuthorizePlatform(
  metadataRole: CrowRole | null,
  activeInternalRoles: readonly PlatformInternalRole[]
): boolean {
  return (
    activeInternalRoles.length === 0 &&
    metadataRole !== null &&
    isPlatformConsoleRole(metadataRole)
  );
}

export function metadataAloneWouldAuthorizeClient(
  metadataRole: CrowRole | null,
  evidence: CustomerAccessEvidence
): boolean {
  return metadataRole === "client" && !hasAuthoritativeCustomerPortalAccess(evidence);
}
