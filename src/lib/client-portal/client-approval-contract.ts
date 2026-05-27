/**
 * Client scope approval contract (I6).
 * Authenticated, ownership-verified approval — not legal e-signature or payment.
 */

import type { ProposalStatus } from "@prisma/client";
import type { ImplementationRequestStatus } from "@/lib/types/platform";
import type { ClientReviewAccessState } from "@/lib/client-portal/client-review-contract";
import { routes } from "@/lib/routes";

export type ClientApprovalAction = "approve_scope" | "request_changes";

export type ClientApprovalBlockedReason =
  | "login_required"
  | "not_linked"
  | "ownership_unverified"
  | "proposal_not_ready"
  | "already_approved"
  | "expired"
  | "missing_audit_path"
  | "platform_staff_preview"
  | "unsupported_state"
  | "declined";

export type ClientApprovalOwnershipState =
  | "strong_submitter"
  | "email_only_review"
  | "unlinked"
  | "staff_preview";

export type ClientApprovalProposalState = "draft" | "sent" | "approved" | "declined" | "unsupported";

export type ClientApprovalEligibility = {
  requestId: string | null;
  canApprove: boolean;
  canRequestChanges: false;
  requestChangesDeferredReason: string;
  blockedReason: ClientApprovalBlockedReason | null;
  blockedMessage: string | null;
  ownershipState: ClientApprovalOwnershipState;
  proposalState: ClientApprovalProposalState;
  auditReady: boolean;
  requiresProCrowReview: boolean;
  accessState: ClientReviewAccessState;
  proposalStatus: ProposalStatus | null;
  approvedAt: string | null;
  approverEmail: string | null;
};

export type ClientApprovalResult =
  | {
      ok: true;
      status: "approved";
      message: string;
      proposalStatus: ProposalStatus;
      requestStatus: ImplementationRequestStatus | null;
      approvedAt: string;
      nextActions: string[];
      procrowCounterpartRoute: string;
    }
  | {
      ok: false;
      status: "blocked" | "error";
      message: string;
      blockedReason?: ClientApprovalBlockedReason;
      proposalStatus?: ProposalStatus | null;
      requestStatus?: ImplementationRequestStatus | null;
      nextActions: string[];
      procrowCounterpartRoute: string;
    };

/** UI-only mock demo: strong ownership without DB submitter link (documented in I6). */
export const MOCK_DEMO_STRONG_OWNERSHIP_EMAIL = "client.demo@alnoor.test";

export const CLIENT_APPROVAL_DISCLAIMER =
  "This records your scope approval for ProCrow review. It is not a legal contract signature, payment authorization, or production go-live.";

export const CLIENT_APPROVAL_REQUEST_CHANGES_DEFERRED =
  "Request changes will be enabled after client review notes are connected to ProCrow.";

export const CLIENT_APPROVAL_BLOCKED_LABELS: Record<ClientApprovalBlockedReason, string> = {
  login_required: "Sign in to approve scope.",
  not_linked: "This proposal is not linked to your account.",
  ownership_unverified:
    "Approval requires verified client ownership. Your account can review materials only.",
  proposal_not_ready: "This proposal is not ready for client approval yet.",
  already_approved: "Scope was already approved for ProCrow review.",
  expired: "This proposal is no longer available for approval.",
  missing_audit_path: "Approval audit path is unavailable.",
  platform_staff_preview: "Platform staff cannot approve on behalf of a client.",
  unsupported_state: "This proposal state does not support client approval.",
  declined: "This proposal was declined.",
};

export const CLIENT_APPROVAL_PROCROW_COUNTERPART = {
  label: "ProCrow request detail",
  route: (requestId: string) => routes.admin.request(requestId),
  description:
    "ProCrow operators see client scope approval here and continue onboarding / provisioning readiness.",
};
