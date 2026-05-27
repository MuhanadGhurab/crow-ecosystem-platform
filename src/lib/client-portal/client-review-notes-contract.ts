/**
 * I10 — Client review notes & request-changes feedback (not legal e-signature or messaging).
 */

import type { ClientReviewAccessState } from "@/lib/client-portal/client-review-contract";
import type { ClientOrganizationAccessLevel } from "@/lib/client-portal/client-organization-contract";

export type ClientReviewNoteType =
  | "general_note"
  | "blueprint_question"
  | "scope_clarification"
  | "request_changes"
  | "onboarding_question";

export type ClientReviewNoteVisibility = "client_and_procrow" | "procrow_internal";

export type ClientReviewNoteStatus =
  | "submitted"
  | "received"
  | "under_review"
  | "resolved"
  | "dismissed";

export type ClientReviewNoteAuthorRole =
  | "client_owner"
  | "client_approver"
  | "client_reviewer"
  | "operations_contact"
  | "platform_staff_preview";

export type ClientReviewNoteBlockedReason =
  | "login_required"
  | "not_linked"
  | "ownership_unverified"
  | "proposal_not_ready"
  | "already_approved"
  | "no_persistence_path"
  | "platform_staff_preview"
  | "unsupported_state";

export type ClientReviewNoteDraft = {
  proposalId?: string | null;
  blueprintId?: string | null;
  requestId: string;
  type: ClientReviewNoteType;
  message: string;
  relatedSection?: string | null;
};

export type ClientReviewNoteSummary = {
  id: string;
  requestId: string;
  proposalId: string | null;
  blueprintId: string | null;
  type: ClientReviewNoteType;
  status: ClientReviewNoteStatus;
  messagePreview: string;
  submittedAt: string;
  authorEmail: string | null;
  authorRole: ClientReviewNoteAuthorRole;
  procrowNextAction: string;
};

export type ClientRequestChangesEligibility = {
  requestId: string | null;
  blueprintId: string | null;
  proposalId: string | null;
  canSubmitReviewNote: boolean;
  canRequestChanges: boolean;
  noteOnlyMode: boolean;
  blockedReason: ClientReviewNoteBlockedReason | null;
  blockedMessage: string | null;
  accessLevel: ClientOrganizationAccessLevel;
  accessState: ClientReviewAccessState;
  requiresVerifiedOwnership: boolean;
};

export type ClientReviewNoteSubmitResult =
  | {
      ok: true;
      status: "submitted";
      message: string;
      noteId: string;
      procrowCounterpartRoute: string;
      nextActions: string[];
    }
  | {
      ok: false;
      status: "blocked" | "error";
      message: string;
      blockedReason?: ClientReviewNoteBlockedReason;
      nextActions: string[];
      procrowCounterpartRoute: string;
    };

export const CLIENT_REVIEW_NOTE_TYPE_LABELS: Record<ClientReviewNoteType, string> = {
  general_note: "General review note",
  blueprint_question: "Blueprint question",
  scope_clarification: "Scope clarification",
  request_changes: "Request changes",
  onboarding_question: "Onboarding question",
};

export const CLIENT_REVIEW_NOTE_DISCLAIMER =
  "Your feedback is sent to ProCrow for review. It does not activate production, payment, or tenant provisioning.";

export const CLIENT_REVIEW_NOTE_REQUEST_CHANGES_DISCLAIMER =
  "Requesting changes asks ProCrow to review scope or blueprint details. It does not reject the whole project, cancel onboarding, or authorize payment.";

export const CLIENT_REVIEW_NOTE_EMAIL_ONLY_HINT =
  "Your account can send review notes. Official request-changes requires verified organization ownership (owner or approver).";

export const CLIENT_REVIEW_NOTE_PROCROW_NEXT_ACTION_DEFAULT =
  "ProCrow will review your feedback and update proposal, blueprint, or onboarding readiness.";

export const CLIENT_REVIEW_NOTES_PROCROW_COUNTERPART = {
  label: "ProCrow request detail",
  route: (requestId: string) => `/admin/requests/${requestId}`,
  description: "Operators see client review notes and change requests in the admin inbox.",
};

/** Platform notification event types (no schema migration). */
export const CLIENT_REVIEW_NOTE_EVENT_TYPES = {
  reviewNote: "client_review_note",
  requestChanges: "client_request_changes",
} as const;
