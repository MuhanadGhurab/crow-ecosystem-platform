/**
 * I9 — Client organization membership & linkage contract.
 *
 * This is a client-facing read model only. Persistence lives in dedicated
 * Prisma models and never reuses tenant runtime tables.
 */

export type ClientOrganizationRole =
  | "owner"
  | "approver"
  | "reviewer"
  | "operations_contact"
  | "billing_contact"
  | "viewer";

export type ClientOrganizationMembershipStatus =
  | "invited"
  | "active"
  | "pending_verification"
  | "suspended"
  | "removed";

export type ClientOrganizationLinkSource =
  | "submitted_by_user"
  | "contact_email_match"
  | "procrow_verified"
  | "invitation"
  | "manual_admin_link"
  | "tenant_member_link";

export type ClientOrganizationAccessLevel =
  | "none"
  | "viewer"
  | "reviewer"
  | "approver"
  | "owner";

export type ClientOrganizationSummary = {
  organizationId: string;
  organizationName: string;
  industry: string | null;
  employeeBand: string | null;
  region: string | null;
  linkedRequestIds: string[];
  linkedProposalIds: string[];
  linkedBlueprintIds: string[];
  tenantId?: string | null;
  membershipCount: number;
  verificationStatus: "unverified" | "procrow_verified" | "pending";
};

export type ClientOrganizationMembership = {
  userId: string;
  email: string | null;
  displayName: string | null;
  role: ClientOrganizationRole;
  status: ClientOrganizationMembershipStatus;
  linkSource: ClientOrganizationLinkSource;
  canApproveScope: boolean;
  canReviewBlueprint: boolean;
  canTrackOnboarding: boolean;
  canManageCompanyProfile: boolean;
  verifiedByProCrow: boolean;
  verifiedAt: string | null;
};

export type ClientOrganizationAccessDecision = {
  organization: ClientOrganizationSummary | null;
  membership: ClientOrganizationMembership | null;
  accessLevel: ClientOrganizationAccessLevel;
  canViewRequests: boolean;
  canViewProposals: boolean;
  canViewBlueprints: boolean;
  canApproveScope: boolean;
  blockedReason: string | null;
  /**
   * Dominant link source for this decision — used for copy and future audit.
   */
  linkSource: ClientOrganizationLinkSource | null;
  /**
   * When true, ProCrow must verify ownership before approval is enabled
   * even if read-level access is allowed.
   */
  requiresProCrowVerification: boolean;
};

