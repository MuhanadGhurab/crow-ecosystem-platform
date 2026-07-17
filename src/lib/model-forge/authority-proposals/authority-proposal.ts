import type { AuthorityProposal } from "../types";
import { FORBIDDEN_PLATFORM_BUNDLE_KEYS } from "@/lib/tenant-composition/permission-bundle-catalog";

const FORBIDDEN_ROLES = ["platform_admin", "implementer", "PLATFORM_ADMIN", "IMPLEMENTER"] as const;

export function createAuthorityProposal(
  key: string,
  displayName: string,
  description: string,
  bundles: string[],
  roles: string[],
): AuthorityProposal {
  const safeBundles = bundles.filter((b) => !FORBIDDEN_PLATFORM_BUNDLE_KEYS.includes(b as (typeof FORBIDDEN_PLATFORM_BUNDLE_KEYS)[number]));
  const safeRoles = roles.filter((r) => !FORBIDDEN_ROLES.includes(r as (typeof FORBIDDEN_ROLES)[number]));
  return {
    key,
    displayName,
    description,
    recommendedRoleArchetypeKeys: safeRoles,
    recommendedPermissionBundleKeys: safeBundles,
    workflowPositionPermissions: [],
    approvalThresholds: [],
    delegationRules: [],
    segregationOfDuties: [],
    authoritative: false,
    requiresApproval: true,
  };
}

export function validateAuthorityProposal(proposal: AuthorityProposal): string[] {
  const errors: string[] = [];
  if (proposal.authoritative !== false) errors.push("AuthorityProposal must be non-authoritative");
  if (proposal.requiresApproval !== true) errors.push("AuthorityProposal must require approval");
  for (const role of proposal.recommendedRoleArchetypeKeys) {
    if (FORBIDDEN_ROLES.includes(role as (typeof FORBIDDEN_ROLES)[number])) errors.push(`Forbidden role: ${role}`);
  }
  for (const bundle of proposal.recommendedPermissionBundleKeys) {
    if (FORBIDDEN_PLATFORM_BUNDLE_KEYS.includes(bundle as (typeof FORBIDDEN_PLATFORM_BUNDLE_KEYS)[number])) {
      errors.push(`Forbidden bundle: ${bundle}`);
    }
  }
  return errors;
}
