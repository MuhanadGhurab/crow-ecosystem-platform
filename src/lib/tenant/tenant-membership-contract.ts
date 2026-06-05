/**
 * M4 — Tenant membership & Business Portal access contract.
 * Client Portal access does not imply Business Portal access.
 */

export type TenantMembershipRole =
  | "owner"
  | "admin"
  | "manager"
  | "employee"
  | "viewer"
  | "operator_preview";

export type TenantMembershipStatus =
  | "active"
  | "invited"
  | "pending_verification"
  | "suspended"
  | "removed"
  | "preview_only";

export type TenantBusinessPortalAccessLevel =
  | "none"
  | "read_only"
  | "operator_preview"
  | "employee"
  | "manager"
  | "admin"
  | "owner";

export type TenantMembershipSource =
  | "database_membership"
  | "auth_metadata"
  | "procrow_verified"
  | "operator_preview"
  | "future_entra_mapping"
  | "unavailable";

export type TenantBusinessPortalAccessDecision = {
  tenantSlug: string;
  tenantName?: string;
  userId: string;
  userEmail: string | null;
  isAuthenticated: boolean;
  isPlatformStaff: boolean;
  membershipStatus: TenantMembershipStatus;
  membershipRole: TenantMembershipRole | null;
  accessLevel: TenantBusinessPortalAccessLevel;
  canViewBusinessPortal: boolean;
  canUseWorkflowActions: boolean;
  canManageTenantUsers: boolean;
  canPreviewAsOperator: boolean;
  source: TenantMembershipSource;
  blockedReason: string | null;
  warnings: string[];
  disclaimers: readonly string[];
};

export const TENANT_MEMBERSHIP_DISCLAIMERS = [
  "Client Portal access does not equal Business Portal access.",
  "Business Portal (CEM) requires verified tenant membership assigned by ProCrow or a tenant administrator.",
  "Entra ID / directory mapping is future readiness unless explicitly configured.",
  "Platform operator preview does not grant tenant employee status.",
] as const;

export type TenantMembershipAccessSummary = {
  tenantSlug: string;
  tenantName: string;
  membershipModel: "database_backed" | "metadata_only" | "hybrid";
  activeMembershipCount: number;
  metadataOnlyWarning: boolean;
  accessSourceNotes: string[];
  recommendedNextAction: string;
  disclaimers: readonly string[];
};
