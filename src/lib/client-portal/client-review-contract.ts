/**
 * Client proposal / blueprint authenticated review models (I5).
 * Authenticated review surfaces; scope approval via client-approval (I6).
 */

import type { BlueprintStatus, ProposalStatus } from "@prisma/client";
import { CLIENT_PORTAL_APPROVAL_BLOCKED_REASON } from "@/lib/client-portal/client-portal-contract";
import type { ClientPortalProcrowCounterpart } from "@/lib/client-portal/client-portal-contract";
import type { ClientApprovalEligibility } from "@/lib/client-portal/client-approval-contract";

export type ClientReviewAccessState =
  | "allowed"
  | "login_required"
  | "not_linked"
  | "ownership_unverified"
  | "platform_staff_preview"
  | "not_found";

/** Shown when approval is blocked — prefer eligibility.blockedMessage when available (I6). */
export const CLIENT_REVIEW_APPROVAL_BLOCKED_REASON =
  "Scope approval requires verified client ownership (request submitter account). Email-only linkage allows review only.";

export const CLIENT_REVIEW_READ_ONLY_NOTICE =
  "This is a read-only review. ProCrow prepares materials and tracks status; your team cannot approve scope here until verified ownership is complete.";

export type ClientReviewSecurityNote = {
  id: string;
  label: string;
  description: string;
  severity: "info" | "warning";
};

export type ClientProposalReviewSummary = {
  proposalId: string;
  requestId: string;
  referenceCode: string;
  organizationName: string;
  status: ProposalStatus;
  title: string;
  summary: string;
  planLabel: string | null;
  estimatedRange: string | null;
  moduleCount: number;
  blueprintId: string;
  sentAt: string | null;
  approvalState: "blocked" | "eligible" | "approved";
  approvalBlockedReason: string;
  procrowStatus: string;
  reviewRoute: string;
  blueprintRoute: string | null;
};

export type ClientProposalReviewModel = {
  proposalId: string;
  requestId: string;
  referenceCode: string;
  organizationName: string;
  status: ProposalStatus;
  title: string;
  summary: string;
  planLabel: string;
  estimatedRange: string | null;
  estimatedMonthlySar: number | null;
  modules: { key: string; label: string }[];
  securityLayer: { key: string; label: string }[];
  blueprintId: string;
  blueprintStatus: BlueprintStatus | null;
  sentAt: string | null;
  approvalState: "blocked" | "eligible" | "approved";
  approvalBlockedReason: string;
  procrowStatus: string;
  procrowNote: string;
  securityNotes: ClientReviewSecurityNote[];
  nextActions: string[];
  procrowCounterpart: ClientPortalProcrowCounterpart;
  approvalEligibility: ClientApprovalEligibility;
};

export type ClientBlueprintReviewModel = {
  blueprintId: string;
  requestId: string;
  referenceCode: string;
  organizationName: string;
  status: BlueprintStatus;
  operatingModel: string;
  sector: string | null;
  recommendedModules: string[];
  departments: string[];
  roles: string[];
  workflows: string[];
  readinessLabel: string;
  missingInputs: string[];
  procrowNotes: string;
  proposalId: string | null;
  proposalStatus: ProposalStatus | null;
  approvalBlockedReason: string;
  securityNotes: ClientReviewSecurityNote[];
  nextActions: string[];
  procrowCounterpart: ClientPortalProcrowCounterpart;
};

export type ClientProposalsListModel = {
  accessState: ClientReviewAccessState;
  proposals: ClientProposalReviewSummary[];
  securityNotes: ClientReviewSecurityNote[];
  nextActions: string[];
  approvalBlockedReason: string;
};

export type ClientRequestReviewLinks = {
  proposalHref: string | null;
  blueprintHref: string | null;
  proposalStatus: ProposalStatus | null;
  blueprintStatus: BlueprintStatus | null;
  proposalLabel: string | null;
  blueprintLabel: string | null;
};

export const CLIENT_REVIEW_SECURITY_NOTES: ClientReviewSecurityNote[] = [
  {
    id: "read-only",
    label: "Review only",
    description: CLIENT_REVIEW_READ_ONLY_NOTICE,
    severity: "info",
  },
  {
    id: "token-not-auth",
    label: "Email links",
    description:
      "Proposal email links help you find materials. They do not authorize approval without Client Portal sign-in and request linkage.",
    severity: "warning",
  },
  {
    id: "ownership",
    label: "Verified ownership",
    description: CLIENT_REVIEW_APPROVAL_BLOCKED_REASON,
    severity: "warning",
  },
];

export const CLIENT_REVIEW_PROCROW_COUNTERPARTS = {
  proposal: {
    area: "Commercial proposal review",
    procrowOwns:
      "ProCrow prepares pricing, sends the proposal, tracks status, and runs internal review.",
    clientPortalShows:
      "Read-only commercial summary, modules, and advisory estimate when linked to your request.",
    adminRoute: "/admin/requests",
  } satisfies ClientPortalProcrowCounterpart,
  blueprint: {
    area: "Enterprise blueprint review",
    procrowOwns:
      "ProCrow builds blueprint scope, readiness, security baseline, and go-live checklist.",
    clientPortalShows:
      "Operating model, modules, and discovery summary when your request is linked.",
    adminRoute: "/admin/blueprints",
  } satisfies ClientPortalProcrowCounterpart,
};
