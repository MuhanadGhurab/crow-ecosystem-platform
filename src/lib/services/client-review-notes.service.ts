import "@/lib/server-only-guard";

import type { User } from "@supabase/supabase-js";
import { getCrowAuth, isPlatformStaff } from "@/lib/auth/roles";
import {
  CLIENT_REVIEW_NOTE_DISCLAIMER,
  CLIENT_REVIEW_NOTE_EMAIL_ONLY_HINT,
  CLIENT_REVIEW_NOTE_EVENT_TYPES,
  CLIENT_REVIEW_NOTE_PROCROW_NEXT_ACTION_DEFAULT,
  CLIENT_REVIEW_NOTE_REQUEST_CHANGES_DISCLAIMER,
  CLIENT_REVIEW_NOTES_PROCROW_COUNTERPART,
  type ClientRequestChangesEligibility,
  type ClientReviewNoteAuthorRole,
  type ClientReviewNoteBlockedReason,
  type ClientReviewNoteDraft,
  type ClientReviewNoteStatus,
  type ClientReviewNoteSubmitResult,
  type ClientReviewNoteSummary,
  type ClientReviewNoteType,
} from "@/lib/client-portal/client-review-notes-contract";
import { CLIENT_APPROVAL_BLOCKED_LABELS } from "@/lib/client-portal/client-approval-contract";
import type { ClientReviewAccessState } from "@/lib/client-portal/client-review-contract";
import { prisma } from "@/lib/db";
import { isUseMockData } from "@/lib/mock/env";
import {
  appendMockClientReviewNote,
  listMockClientReviewNotesForRequest,
  toMockClientReviewNoteSummary,
} from "@/lib/mock/client-review-notes";
import { MOCK_BLUEPRINT_ID } from "@/lib/mock/blueprint";
import { getMockProposalApprovalOverrides } from "@/lib/mock/blueprint";
import { routes } from "@/lib/routes";
import {
  legacyStatusFromSplit,
  parsePlatformNotificationMetadata,
  severityForNotification,
} from "@/lib/services/platform-notification-links";
import { getEnterpriseBlueprint } from "@/lib/services/blueprint.service";
import { clientCanAccessRequest } from "@/lib/services/client-request-link.service";
import { getClientOrganizationAccessDecisionForRequest } from "@/lib/services/client-organization-link.service";

const PLATFORM_ADVISORY_EMAIL = "platform-advisory@internal.crow";

const PERSISTENCE_AVAILABLE = true;

function mapAuthorRole(
  accessState: ClientReviewAccessState,
  canApproveScope: boolean
): ClientReviewNoteAuthorRole {
  if (accessState === "platform_staff_preview") return "platform_staff_preview";
  if (canApproveScope) return "client_approver";
  return "client_reviewer";
}

function authorRoleLabel(role: ClientReviewNoteAuthorRole): string {
  switch (role) {
    case "client_owner":
      return "Client owner";
    case "client_approver":
      return "Client approver";
    case "client_reviewer":
      return "Client reviewer";
    case "operations_contact":
      return "Operations contact";
    case "platform_staff_preview":
      return "Platform staff (preview)";
    default:
      return "Client";
  }
}

function noteStatusFromInbox(inboxStatus: string): ClientReviewNoteStatus {
  if (inboxStatus === "reviewed") return "under_review";
  if (inboxStatus === "dismissed") return "dismissed";
  return "received";
}

function procrowNextActionForType(type: ClientReviewNoteType): string {
  if (type === "request_changes") {
    return "Review requested scope or blueprint changes with the client before advancing onboarding.";
  }
  return CLIENT_REVIEW_NOTE_PROCROW_NEXT_ACTION_DEFAULT;
}

async function resolveRequestAccess(
  user: User,
  requestId: string
): Promise<ClientReviewAccessState> {
  const { role } = getCrowAuth(user);
  if (isPlatformStaff(role)) return "platform_staff_preview";
  if (!user.email) return "login_required";

  const allowed = await clientCanAccessRequest(user.id, user.email, requestId).catch(() => false);
  return allowed ? "allowed" : "not_linked";
}

async function resolveBlueprintContext(blueprintId: string) {
  if (isUseMockData() && blueprintId === MOCK_BLUEPRINT_ID) {
    const overrides = getMockProposalApprovalOverrides();
    return {
      requestId: "mock-req-003",
      proposalStatus: overrides.proposalStatus,
      blueprintId,
    };
  }

  const blueprint = await getEnterpriseBlueprint(blueprintId).catch(() => null);
  if (!blueprint) return null;
  return {
    requestId: blueprint.requestId,
    proposalStatus: blueprint.proposalStatus,
    blueprintId: blueprint.id,
  };
}

async function resolveProposalContext(proposalId: string) {
  return resolveBlueprintContext(proposalId);
}

export async function getClientRequestChangesEligibility(
  user: User,
  input: {
    requestId?: string | null;
    blueprintId?: string | null;
    proposalId?: string | null;
  }
): Promise<ClientRequestChangesEligibility> {
  const blueprintId = input.blueprintId ?? input.proposalId ?? null;
  let requestId = input.requestId ?? null;

  if (!requestId && blueprintId) {
    const ctx = await resolveBlueprintContext(blueprintId);
    requestId = ctx?.requestId ?? null;
  }

  const base: ClientRequestChangesEligibility = {
    requestId,
    blueprintId,
    proposalId: input.proposalId ?? blueprintId,
    canSubmitReviewNote: false,
    canRequestChanges: false,
    noteOnlyMode: true,
    blockedReason: null,
    blockedMessage: null,
    accessLevel: "none",
    accessState: "not_found",
    requiresVerifiedOwnership: true,
  };

  if (!requestId) {
    return {
      ...base,
      blockedReason: "unsupported_state",
      blockedMessage: "Request context is required for client feedback.",
    };
  }

  const accessState = await resolveRequestAccess(user, requestId);
  base.accessState = accessState;

  if (accessState === "platform_staff_preview") {
    return {
      ...base,
      blockedReason: "platform_staff_preview",
      blockedMessage: "Platform staff cannot submit client feedback on behalf of a customer.",
    };
  }
  if (accessState === "login_required") {
    return {
      ...base,
      blockedReason: "login_required",
      blockedMessage: "Sign in to send review feedback.",
    };
  }
  if (accessState !== "allowed") {
    return {
      ...base,
      blockedReason: "not_linked",
      blockedMessage: "This request is not linked to your account.",
    };
  }

  if (!PERSISTENCE_AVAILABLE) {
    return {
      ...base,
      blockedReason: "no_persistence_path",
      blockedMessage: "Review notes are temporarily unavailable.",
    };
  }

  const decision = await getClientOrganizationAccessDecisionForRequest(user, requestId).catch(
    () => null
  );
  base.accessLevel = decision?.accessLevel ?? "none";

  let proposalStatus: string | null = null;
  if (blueprintId) {
    const ctx = await resolveBlueprintContext(blueprintId);
    proposalStatus = ctx?.proposalStatus ?? null;
  }

  const canApproveScope = decision?.canApproveScope ?? false;
  const proposalReady = proposalStatus === "SENT" || proposalStatus === "CLIENT_APPROVED";
  const alreadyApproved = proposalStatus === "CLIENT_APPROVED";

  base.canSubmitReviewNote = true;
  base.noteOnlyMode = !canApproveScope;

  if (canApproveScope && proposalStatus === "SENT") {
    base.canRequestChanges = true;
    base.requiresVerifiedOwnership = false;
    return base;
  }

  if (canApproveScope && alreadyApproved) {
    base.canRequestChanges = false;
    base.blockedReason = "already_approved";
    base.blockedMessage =
      "Scope is already approved. Send a review note if you need ProCrow to revisit details.";
    return base;
  }

  if (canApproveScope && proposalStatus && proposalStatus !== "SENT") {
    base.canRequestChanges = false;
    base.blockedReason = "proposal_not_ready";
    base.blockedMessage = CLIENT_APPROVAL_BLOCKED_LABELS.proposal_not_ready;
    return base;
  }

  if (!canApproveScope) {
    base.canRequestChanges = false;
    base.blockedReason = "ownership_unverified";
    base.blockedMessage = CLIENT_REVIEW_NOTE_EMAIL_ONLY_HINT;
    return base;
  }

  if (!proposalReady) {
    base.canRequestChanges = false;
    base.blockedReason = "proposal_not_ready";
    base.blockedMessage = CLIENT_APPROVAL_BLOCKED_LABELS.proposal_not_ready;
  }

  return base;
}

function rowToSummary(row: {
  id: string;
  eventType: string;
  body: string;
  createdAt: Date;
  inboxStatus: string;
  metadata: unknown;
}): ClientReviewNoteSummary | null {
  const meta = parsePlatformNotificationMetadata(row.metadata);
  const requestId = meta.requestId;
  if (!requestId || typeof requestId !== "string") return null;

  const type =
    row.eventType === CLIENT_REVIEW_NOTE_EVENT_TYPES.requestChanges
      ? ("request_changes" as const)
      : ((meta.noteType as ClientReviewNoteType) ?? "general_note");

  const message = row.body.trim();
  const preview = message.length > 160 ? `${message.slice(0, 157).trimEnd()}…` : message;

  return {
    id: row.id,
    requestId,
    proposalId: typeof meta.proposalId === "string" ? meta.proposalId : null,
    blueprintId: typeof meta.blueprintId === "string" ? meta.blueprintId : null,
    type,
    status: noteStatusFromInbox(row.inboxStatus),
    messagePreview: preview,
    submittedAt: row.createdAt.toISOString(),
    authorEmail: typeof meta.authorEmail === "string" ? meta.authorEmail : null,
    authorRole: (meta.authorRole as ClientReviewNoteAuthorRole) ?? "client_reviewer",
    procrowNextAction: procrowNextActionForType(type),
  };
}

export async function listClientReviewNotesForRequest(
  user: User,
  requestId: string
): Promise<ClientReviewNoteSummary[]> {
  const access = await resolveRequestAccess(user, requestId);
  if (access !== "allowed" && access !== "platform_staff_preview") {
    return [];
  }
  if (access === "platform_staff_preview") {
    return [];
  }

  if (isUseMockData()) {
    return listMockClientReviewNotesForRequest(requestId).map(toMockClientReviewNoteSummary);
  }

  const rows = await prisma.platformNotification
    .findMany({
      where: {
        eventType: {
          in: [
            CLIENT_REVIEW_NOTE_EVENT_TYPES.reviewNote,
            CLIENT_REVIEW_NOTE_EVENT_TYPES.requestChanges,
          ],
        },
      },
      orderBy: { createdAt: "desc" },
      take: 200,
      select: {
        id: true,
        eventType: true,
        body: true,
        createdAt: true,
        inboxStatus: true,
        metadata: true,
      },
    })
    .catch(() => []);

  return rows
    .map(rowToSummary)
    .filter((n): n is ClientReviewNoteSummary => n !== null && n.requestId === requestId);
}

async function persistClientReviewFeedback(input: {
  eventType: string;
  requestId: string;
  blueprintId: string | null;
  proposalId: string | null;
  organizationName: string;
  referenceCode: string;
  noteType: ClientReviewNoteType;
  message: string;
  authorEmail: string | null;
  authorRole: ClientReviewNoteAuthorRole;
  relatedSection?: string | null;
}): Promise<string> {
  const deliveryStatus = "logged" as const;
  const inboxStatus = "open" as const;
  const metadata = {
    requestId: input.requestId,
    blueprintId: input.blueprintId ?? undefined,
    proposalId: input.proposalId ?? undefined,
    organizationName: input.organizationName,
    referenceCode: input.referenceCode,
    noteType: input.noteType,
    authorEmail: input.authorEmail ?? undefined,
    authorRole: input.authorRole,
    relatedSection: input.relatedSection ?? undefined,
    advisory: true,
    clientFeedback: true,
  };

  const subject =
    input.eventType === CLIENT_REVIEW_NOTE_EVENT_TYPES.requestChanges
      ? `Client requested changes — ${input.referenceCode}`
      : `Client review note — ${input.referenceCode}`;

  const bodyLines = [
    input.message,
    "",
    `Organization: ${input.organizationName}`,
    `Reference: ${input.referenceCode}`,
    `Type: ${input.noteType}`,
    `Author: ${input.authorEmail ?? "unknown"} (${authorRoleLabel(input.authorRole)})`,
  ];
  if (input.relatedSection) {
    bodyLines.push(`Section: ${input.relatedSection}`);
  }
  bodyLines.push(
    "",
    "ProCrow action: review feedback in the admin request detail. This does not auto-change proposal status, payment, or tenant provisioning."
  );

  if (isUseMockData()) {
    return appendMockClientReviewNote({
      requestId: input.requestId,
      blueprintId: input.blueprintId,
      proposalId: input.proposalId,
      type: input.noteType,
      status: "received",
      message: input.message,
      submittedAt: new Date().toISOString(),
      authorEmail: input.authorEmail,
      authorRole: input.authorRole,
    });
  }

  const row = await prisma.platformNotification.create({
    data: {
      eventType: input.eventType,
      recipientEmail: PLATFORM_ADVISORY_EMAIL,
      subject,
      body: bodyLines.join("\n"),
      status: legacyStatusFromSplit(deliveryStatus, inboxStatus),
      deliveryStatus,
      inboxStatus,
      severity: severityForNotification(input.eventType, deliveryStatus, metadata),
      metadata,
    },
  });

  return row.id;
}

async function loadRequestMeta(requestId: string) {
  if (isUseMockData() && requestId === "mock-req-003") {
    return {
      organizationName: "Gulf Health Network",
      referenceCode: "CROW-2026-DEMO3",
    };
  }

  const row = await prisma.implementationRequest
    .findUnique({
      where: { id: requestId },
      select: { organizationName: true, referenceCode: true },
    })
    .catch(() => null);

  if (!row) return null;
  return row;
}

export async function submitClientReviewNote(
  user: User,
  draft: ClientReviewNoteDraft
): Promise<ClientReviewNoteSubmitResult> {
  const procrowRoute = CLIENT_REVIEW_NOTES_PROCROW_COUNTERPART.route(draft.requestId);

  const eligibility = await getClientRequestChangesEligibility(user, {
    requestId: draft.requestId,
    blueprintId: draft.blueprintId,
    proposalId: draft.proposalId,
  });

  if (!eligibility.canSubmitReviewNote) {
    return {
      ok: false,
      status: "blocked",
      message: eligibility.blockedMessage ?? "Review notes are not available.",
      blockedReason: eligibility.blockedReason ?? "unsupported_state",
      nextActions: ["Review access on this page or contact ProCrow."],
      procrowCounterpartRoute: procrowRoute,
    };
  }

  const message = draft.message.trim();
  if (message.length < 8) {
    return {
      ok: false,
      status: "error",
      message: "Please enter at least 8 characters so ProCrow can act on your feedback.",
      nextActions: [],
      procrowCounterpartRoute: procrowRoute,
    };
  }

  if (draft.type === "request_changes" && !eligibility.canRequestChanges) {
    return {
      ok: false,
      status: "blocked",
      message:
        eligibility.blockedMessage ??
        "Official request-changes requires verified organization ownership.",
      blockedReason: eligibility.blockedReason ?? "ownership_unverified",
      nextActions: [CLIENT_REVIEW_NOTE_EMAIL_ONLY_HINT],
      procrowCounterpartRoute: procrowRoute,
    };
  }

  const meta = await loadRequestMeta(draft.requestId);
  if (!meta) {
    return {
      ok: false,
      status: "error",
      message: "Request not found.",
      nextActions: [],
      procrowCounterpartRoute: routes.admin.requests,
    };
  }

  const eventType =
    draft.type === "request_changes"
      ? CLIENT_REVIEW_NOTE_EVENT_TYPES.requestChanges
      : CLIENT_REVIEW_NOTE_EVENT_TYPES.reviewNote;

  const authorRole = mapAuthorRole(
    eligibility.accessState,
    eligibility.canRequestChanges || !eligibility.noteOnlyMode
  );

  try {
    const noteId = await persistClientReviewFeedback({
      eventType,
      requestId: draft.requestId,
      blueprintId: draft.blueprintId ?? draft.proposalId ?? null,
      proposalId: draft.proposalId ?? draft.blueprintId ?? null,
      organizationName: meta.organizationName,
      referenceCode: meta.referenceCode,
      noteType: draft.type,
      message,
      authorEmail: user.email ?? null,
      authorRole,
      relatedSection: draft.relatedSection,
    });

    const isChanges = draft.type === "request_changes";
    return {
      ok: true,
      status: "submitted",
      message: isChanges
        ? "Change request submitted for ProCrow review. Proposal status and onboarding remain under operator control."
        : "Review note submitted for ProCrow review.",
      noteId,
      procrowCounterpartRoute: procrowRoute,
      nextActions: [
        CLIENT_REVIEW_NOTE_DISCLAIMER,
        isChanges ? CLIENT_REVIEW_NOTE_REQUEST_CHANGES_DISCLAIMER : procrowNextActionForType(draft.type),
        "Track status on your request and onboarding pages.",
      ],
    };
  } catch {
    return {
      ok: false,
      status: "error",
      message: "Could not save your feedback. Try again or contact ProCrow.",
      nextActions: [],
      procrowCounterpartRoute: procrowRoute,
    };
  }
}

export type AdminClientReviewFeedbackRow = {
  id: string;
  eventType: string;
  noteType: ClientReviewNoteType;
  createdAt: string;
  inboxStatus: string;
  authorEmail: string | null;
  bodyPreview: string;
  procrowNextAction: string;
};

/** ProCrow/admin read path — all feedback for a request (notification store). */
export async function listAdminClientReviewFeedback(
  requestId: string
): Promise<AdminClientReviewFeedbackRow[]> {
  if (isUseMockData()) {
    return listMockClientReviewNotesForRequest(requestId).map((row) => ({
      id: row.id,
      eventType:
        row.type === "request_changes"
          ? CLIENT_REVIEW_NOTE_EVENT_TYPES.requestChanges
          : CLIENT_REVIEW_NOTE_EVENT_TYPES.reviewNote,
      noteType: row.type,
      createdAt: row.submittedAt,
      inboxStatus: "open",
      authorEmail: row.authorEmail,
      bodyPreview:
        row.message.length > 400 ? `${row.message.slice(0, 397).trimEnd()}…` : row.message,
      procrowNextAction: procrowNextActionForType(row.type),
    }));
  }

  const rows = await prisma.platformNotification
    .findMany({
      where: {
        eventType: {
          in: [
            CLIENT_REVIEW_NOTE_EVENT_TYPES.reviewNote,
            CLIENT_REVIEW_NOTE_EVENT_TYPES.requestChanges,
          ],
        },
      },
      orderBy: { createdAt: "desc" },
      take: 200,
      select: {
        id: true,
        eventType: true,
        body: true,
        createdAt: true,
        inboxStatus: true,
        metadata: true,
      },
    })
    .catch(() => []);

  const out: AdminClientReviewFeedbackRow[] = [];
  for (const row of rows) {
    const meta = parsePlatformNotificationMetadata(row.metadata);
    if (meta.requestId !== requestId) continue;

    const noteType =
      row.eventType === CLIENT_REVIEW_NOTE_EVENT_TYPES.requestChanges
        ? ("request_changes" as const)
        : ((meta.noteType as ClientReviewNoteType) ?? "general_note");

    const body = row.body.trim();
    out.push({
      id: row.id,
      eventType: row.eventType,
      noteType,
      createdAt: row.createdAt.toISOString(),
      inboxStatus: row.inboxStatus,
      authorEmail: typeof meta.authorEmail === "string" ? meta.authorEmail : null,
      bodyPreview: body.length > 400 ? `${body.slice(0, 397).trimEnd()}…` : body,
      procrowNextAction: procrowNextActionForType(noteType),
    });
  }
  return out;
}

export async function requestClientProposalChanges(
  user: User,
  input: {
    requestId: string;
    proposalId?: string | null;
    blueprintId?: string | null;
    message: string;
    relatedSection?: string | null;
  }
): Promise<ClientReviewNoteSubmitResult> {
  const eligibility = await getClientRequestChangesEligibility(user, {
    requestId: input.requestId,
    proposalId: input.proposalId,
    blueprintId: input.blueprintId,
  });

  if (!eligibility.canRequestChanges) {
    return {
      ok: false,
      status: "blocked",
      message:
        eligibility.blockedMessage ??
        "Request changes requires verified owner or approver access.",
      blockedReason: eligibility.blockedReason ?? "ownership_unverified",
      nextActions: eligibility.noteOnlyMode
        ? ["You can still send a general review note for ProCrow."]
        : [],
      procrowCounterpartRoute: CLIENT_REVIEW_NOTES_PROCROW_COUNTERPART.route(input.requestId),
    };
  }

  return submitClientReviewNote(user, {
    requestId: input.requestId,
    proposalId: input.proposalId,
    blueprintId: input.blueprintId,
    type: "request_changes",
    message: input.message,
    relatedSection: input.relatedSection,
  });
}
