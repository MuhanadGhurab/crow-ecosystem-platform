/**
 * Client / Proposal Portal — read-model contract (I3).
 * No DB schema; maps existing platform fields to client-safe summaries.
 *
 * Security: token links are identity locators, not authorization.
 * Approval actions require authenticated, linked client identity (future phase).
 */

import type { ImplementationRequestStatus } from "@/lib/types/platform";
import type { BlueprintStatus, ProposalStatus } from "@prisma/client";

/** Client-facing role labels (not Supabase crow_role). */
export type ClientPortalUserRole =
  | "request_submitter"
  | "account_owner"
  | "reviewer"
  | "operations_contact";

export type ClientPortalAccessLevel =
  | "none"
  | "viewer"
  | "reviewer"
  | "approver"
  | "owner";

export type ClientPortalAuthState =
  | "unauthenticated"
  | "authenticated_unlinked"
  | "authenticated_linked"
  | "platform_staff";

export type ClientPortalAccountSummary = {
  userId: string;
  email: string | null;
  displayName: string | null;
  role: ClientPortalUserRole | null;
  accessLevel: ClientPortalAccessLevel;
};

export type ClientPortalCompanyProfile = {
  id: string;
  companyName: string;
  industry: string | null;
  employeeBand: string | null;
  region: string | null;
  primaryContactName: string | null;
  primaryContactEmail: string | null;
  profileCompleteness: number;
  missingFields: string[];
};

export type ClientPortalRequestSummary = {
  requestId: string;
  referenceCode: string;
  organizationName: string;
  industry: string | null;
  status: ImplementationRequestStatus;
  submittedAt: string;
  proposalStatus: ProposalStatus | null;
  blueprintStatus: BlueprintStatus | null;
  nextAction: string;
};

export type ClientPortalProposalSummary = {
  proposalId: string;
  requestId: string;
  status: ProposalStatus;
  title: string;
  sentAt: string | null;
  expiresAt: string | null;
  canView: boolean;
  canApprove: false;
  approvalBlockedReason: string;
};

export type ClientPortalBlueprintSummary = {
  blueprintId: string;
  requestId: string;
  status: BlueprintStatus;
  operatingModel: string;
  modules: string[];
  readinessLabel: string;
  reviewNotes: string | null;
};

export type ClientPortalOnboardingStepStatus = "pending" | "in_progress" | "complete" | "blocked";

export type ClientPortalOnboardingStep = {
  key: string;
  label: string;
  status: ClientPortalOnboardingStepStatus;
  owner: "client" | "procrow" | "shared";
  description: string;
  relatedRoute: string | null;
};

export type ClientPortalProcrowCounterpart = {
  area: string;
  procrowOwns: string;
  clientPortalShows: string;
  adminRoute: string | null;
};

export type ClientPortalSecurityNote = {
  id: string;
  message: string;
};

/** Shown when approval is not yet safe — I3 does not enable mutations. */
export const CLIENT_PORTAL_APPROVAL_BLOCKED_REASON =
  "Scope approval will be enabled after verified client ownership and approval audit are implemented.";

export const CLIENT_PORTAL_TOKEN_LINK_NOTICE =
  "This link helps you locate your proposal. Official review or approval requires signing in to the Client Portal.";

export const PROCROW_COUNTERPARTS: ClientPortalProcrowCounterpart[] = [
  {
    area: "Request intake & review",
    procrowOwns: "ProCrow reviews submissions, discovery readiness, and pipeline status.",
    clientPortalShows: "Request status and next steps; no internal review notes.",
    adminRoute: "/admin/requests",
  },
  {
    area: "Commercial proposal",
    procrowOwns: "ProCrow prepares pricing, sends proposal, tracks proposal status.",
    clientPortalShows: "Proposal summary and read-only review; approval gated on verified ownership.",
    adminRoute: "/admin/requests",
  },
  {
    area: "Enterprise blueprint",
    procrowOwns: "ProCrow builds blueprint, readiness, and go-live checklist.",
    clientPortalShows: "Blueprint status and module scope summary when linked.",
    adminRoute: "/admin/blueprints",
  },
  {
    area: "Tenant provisioning",
    procrowOwns: "ProCrow controls tenant provisioning and onboarding readiness.",
    clientPortalShows: "Onboarding step tracker (placeholder until provisioning is linked).",
    adminRoute: "/admin/tenants",
  },
];

export type ClientPortalDashboardSnapshot = {
  authState: ClientPortalAuthState;
  account: ClientPortalAccountSummary | null;
  companyProfile: ClientPortalCompanyProfile | null;
  requests: ClientPortalRequestSummary[];
  proposals: ClientPortalProposalSummary[];
  blueprints: ClientPortalBlueprintSummary[];
  onboardingSteps: ClientPortalOnboardingStep[];
  securityNotes: ClientPortalSecurityNote[];
  procrowCounterparts: ClientPortalProcrowCounterpart[];
  nextActions: string[];
};
