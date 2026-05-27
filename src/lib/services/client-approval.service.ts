import "@/lib/server-only-guard";

import type { User } from "@supabase/supabase-js";
import type { ProposalStatus } from "@prisma/client";
import { getCrowAuth, isPlatformStaff } from "@/lib/auth/roles";
import {
  CLIENT_APPROVAL_BLOCKED_LABELS,
  CLIENT_APPROVAL_DISCLAIMER,
  CLIENT_APPROVAL_PROCROW_COUNTERPART,
  MOCK_DEMO_STRONG_OWNERSHIP_EMAIL,
  type ClientApprovalBlockedReason,
  type ClientApprovalEligibility,
  type ClientApprovalOwnershipState,
  type ClientApprovalProposalState,
  type ClientApprovalResult,
} from "@/lib/client-portal/client-approval-contract";
import type { ClientReviewAccessState } from "@/lib/client-portal/client-review-contract";
import { isUseMockData } from "@/lib/mock/env";
import {
  applyMockClientScopeApproval,
  getMockEnterpriseBlueprint,
  getMockProposalApprovalOverrides,
  MOCK_BLUEPRINT_ID,
} from "@/lib/mock/blueprint";
import { prisma } from "@/lib/db";
import { clientCanAccessRequest } from "@/lib/services/client-request-link.service";
import { getEnterpriseBlueprint } from "@/lib/services/blueprint.service";
import {
  legacyStatusFromSplit,
  severityForNotification,
} from "@/lib/services/platform-notification-links";
import { routes } from "@/lib/routes";

const PLATFORM_ADVISORY_EMAIL = "platform-advisory@internal.crow";

function mapProposalState(status: ProposalStatus | null | undefined): ClientApprovalProposalState {
  switch (status) {
    case "DRAFT":
      return "draft";
    case "SENT":
      return "sent";
    case "CLIENT_APPROVED":
      return "approved";
    case "DECLINED":
      return "declined";
    default:
      return "unsupported";
  }
}

function blocked(
  reason: ClientApprovalBlockedReason,
  partial: Omit<ClientApprovalEligibility, "canApprove" | "canRequestChanges" | "blockedReason" | "blockedMessage">
): ClientApprovalEligibility {
  return {
    ...partial,
    canApprove: false,
    canRequestChanges: false,
    blockedReason: reason,
    blockedMessage: CLIENT_APPROVAL_BLOCKED_LABELS[reason],
  };
}

/** Strong ownership: submitter user id on the request (not email-only contact match). */
export async function clientHasStrongRequestOwnership(
  userId: string,
  requestId: string
): Promise<boolean> {
  if (isUseMockData() && requestId === "mock-req-003") {
    return false;
  }

  const row = await prisma.implementationRequest.findFirst({
    where: { id: requestId, submittedByUserId: userId },
    select: { id: true },
  });
  return Boolean(row);
}

/** Documented UI-only mock demo when DB submitter link is absent. */
export function mockDemoStrongOwnership(email: string | undefined): boolean {
  return email?.trim().toLowerCase() === MOCK_DEMO_STRONG_OWNERSHIP_EMAIL;
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

async function notifyProcrowClientScopeApproved(input: {
  organizationName: string;
  referenceCode: string;
  requestId: string;
  blueprintId: string;
  approverEmail: string | null;
  approverUserId: string;
}) {
  const deliveryStatus = "logged" as const;
  const inboxStatus = "open" as const;
  const metadata = {
    requestId: input.requestId,
    blueprintId: input.blueprintId,
    organizationName: input.organizationName,
    referenceCode: input.referenceCode,
    approverEmail: input.approverEmail,
    approverUserId: input.approverUserId,
    advisory: true,
  };

  await prisma.platformNotification.create({
    data: {
      eventType: "client_scope_approved",
      recipientEmail: PLATFORM_ADVISORY_EMAIL,
      subject: `Client approved proposal scope — ${input.referenceCode}`,
      body: [
        `Client approved commercial scope for ${input.organizationName} (${input.referenceCode}).`,
        "",
        "Review onboarding and provisioning readiness in ProCrow.",
        "",
        `Approver: ${input.approverEmail ?? input.approverUserId}`,
        `Request: ${input.requestId}`,
        `Blueprint: ${input.blueprintId}`,
      ].join("\n"),
      status: legacyStatusFromSplit(deliveryStatus, inboxStatus),
      deliveryStatus,
      inboxStatus,
      severity: severityForNotification("client_scope_approved", deliveryStatus, metadata),
      metadata,
    },
  });
}

export async function getClientApprovalEligibility(
  user: User,
  proposalId: string
): Promise<ClientApprovalEligibility> {
  const baseDeferred = {
    requestId: null as string | null,
    canRequestChanges: false as const,
    requestChangesDeferredReason:
      "Request changes will be enabled after client review notes are connected to ProCrow.",
    auditReady: true,
    requiresProCrowReview: true,
    approverEmail: user.email ?? null,
  };

  if (isUseMockData() && proposalId === MOCK_BLUEPRINT_ID) {
    const accessState = await resolveRequestAccess(user, "mock-req-003");
    const overrides = getMockProposalApprovalOverrides();
    const proposalStatus = overrides.proposalStatus;
    const proposalState = mapProposalState(proposalStatus);

    if (accessState === "platform_staff_preview") {
      return blocked("platform_staff_preview", {
        ...baseDeferred,
        requestId: "mock-req-003",
        ownershipState: "staff_preview",
        proposalState,
        accessState,
        proposalStatus,
        approvedAt: overrides.clientApprovedAt?.toISOString() ?? null,
      });
    }
    if (accessState !== "allowed") {
      return blocked(accessState === "login_required" ? "login_required" : "not_linked", {
        ...baseDeferred,
        requestId: "mock-req-003",
        ownershipState: "unlinked",
        proposalState,
        accessState,
        proposalStatus,
        approvedAt: overrides.clientApprovedAt?.toISOString() ?? null,
      });
    }

    const strong =
      mockDemoStrongOwnership(user.email) ||
      (await clientHasStrongRequestOwnership(user.id, "mock-req-003"));

    if (!strong) {
      return blocked("ownership_unverified", {
        ...baseDeferred,
        requestId: "mock-req-003",
        ownershipState: "email_only_review",
        proposalState,
        accessState,
        proposalStatus,
        approvedAt: overrides.clientApprovedAt?.toISOString() ?? null,
      });
    }

    if (proposalState === "approved") {
      return {
        ...baseDeferred,
        requestId: "mock-req-003",
        canApprove: false,
        blockedReason: "already_approved",
        blockedMessage: CLIENT_APPROVAL_BLOCKED_LABELS.already_approved,
        ownershipState: "strong_submitter",
        proposalState,
        accessState,
        proposalStatus,
        approvedAt: overrides.clientApprovedAt?.toISOString() ?? null,
      };
    }
    if (proposalState === "declined") {
      return blocked("declined", {
        ...baseDeferred,
        requestId: "mock-req-003",
        ownershipState: "strong_submitter",
        proposalState,
        accessState,
        proposalStatus,
        approvedAt: null,
      });
    }
    if (proposalState !== "sent") {
      return blocked("proposal_not_ready", {
        ...baseDeferred,
        requestId: "mock-req-003",
        ownershipState: "strong_submitter",
        proposalState,
        accessState,
        proposalStatus,
        approvedAt: null,
      });
    }

    return {
      ...baseDeferred,
      requestId: "mock-req-003",
      canApprove: true,
      blockedReason: null,
      blockedMessage: null,
      ownershipState: "strong_submitter",
      proposalState,
      accessState,
      proposalStatus,
      approvedAt: null,
    };
  }

  const blueprint = await getEnterpriseBlueprint(proposalId).catch(() => null);
  if (!blueprint) {
    return blocked("unsupported_state", {
      ...baseDeferred,
      ownershipState: "unlinked",
      proposalState: "unsupported",
      accessState: "not_found",
      proposalStatus: null,
      approvedAt: null,
    });
  }

  const requestId = blueprint.requestId;
  const accessState = await resolveRequestAccess(user, requestId);
  baseDeferred.requestId = requestId;
  const proposalStatus = blueprint.proposalStatus;
  const proposalState = mapProposalState(proposalStatus);
  const approvedAt = blueprint.clientApprovedAt?.toISOString() ?? null;

  if (accessState === "platform_staff_preview") {
    return blocked("platform_staff_preview", {
      ...baseDeferred,
      ownershipState: "staff_preview",
      proposalState,
      accessState,
      proposalStatus,
      approvedAt,
    });
  }
  if (accessState !== "allowed") {
    const reason: ClientApprovalBlockedReason =
      accessState === "login_required" ? "login_required" : "not_linked";
    return blocked(reason, {
      ...baseDeferred,
      ownershipState: "unlinked",
      proposalState,
      accessState,
      proposalStatus,
      approvedAt,
    });
  }

  const strong = await clientHasStrongRequestOwnership(user.id, requestId);
  if (!strong) {
    const emailOnly = user.email
      ? await clientCanAccessRequest(user.id, user.email, requestId).catch(() => false)
      : false;
    return blocked("ownership_unverified", {
      ...baseDeferred,
      ownershipState: emailOnly ? "email_only_review" : "unlinked",
      proposalState,
      accessState,
      proposalStatus,
      approvedAt,
    });
  }

  if (proposalState === "approved") {
    return {
      ...baseDeferred,
      canApprove: false,
      blockedReason: "already_approved",
      blockedMessage: CLIENT_APPROVAL_BLOCKED_LABELS.already_approved,
      ownershipState: "strong_submitter",
      proposalState,
      accessState,
      proposalStatus,
      approvedAt,
    };
  }
  if (proposalState === "declined") {
    return blocked("declined", {
      ...baseDeferred,
      ownershipState: "strong_submitter",
      proposalState,
      accessState,
      proposalStatus,
      approvedAt,
    });
  }
  if (proposalState !== "sent") {
    return blocked("proposal_not_ready", {
      ...baseDeferred,
      ownershipState: "strong_submitter",
      proposalState,
      accessState,
      proposalStatus,
      approvedAt,
    });
  }

  return {
    ...baseDeferred,
    canApprove: true,
    blockedReason: null,
    blockedMessage: null,
    ownershipState: "strong_submitter",
    proposalState,
    accessState,
    proposalStatus,
    approvedAt,
  };
}

export async function approveClientProposalScope(
  user: User,
  proposalId: string
): Promise<ClientApprovalResult> {
  const eligibility = await getClientApprovalEligibility(user, proposalId);
  const procrowRoute = eligibility.requestId
    ? CLIENT_APPROVAL_PROCROW_COUNTERPART.route(eligibility.requestId)
    : routes.admin.requests;

  if (!eligibility.canApprove) {
    return {
      ok: false,
      status: "blocked",
      message: eligibility.blockedMessage ?? CLIENT_APPROVAL_DISCLAIMER,
      blockedReason: eligibility.blockedReason ?? "unsupported_state",
      proposalStatus: eligibility.proposalStatus,
      nextActions: ["Review eligibility on this page or contact ProCrow."],
      procrowCounterpartRoute: procrowRoute,
    };
  }

  if (isUseMockData() && proposalId === MOCK_BLUEPRINT_ID) {
    const approvedAt = applyMockClientScopeApproval();
    return {
      ok: true,
      status: "approved",
      message:
        "Scope approval recorded for ProCrow review (mock demo). This is not a contract signature or payment.",
      proposalStatus: "CLIENT_APPROVED",
      requestStatus: "BLUEPRINT_BUILD",
      approvedAt: approvedAt.toISOString(),
      nextActions: [
        "ProCrow will review onboarding and provisioning readiness.",
        "Tenant runtime is not created automatically.",
      ],
      procrowCounterpartRoute: CLIENT_APPROVAL_PROCROW_COUNTERPART.route("mock-req-003"),
    };
  }

  const blueprint = await prisma.enterpriseBlueprint.findUnique({
    where: { id: proposalId },
    include: {
      request: {
        select: {
          id: true,
          referenceCode: true,
          organizationName: true,
          status: true,
          submittedByUserId: true,
        },
      },
    },
  });

  if (!blueprint?.request) {
    return {
      ok: false,
      status: "error",
      message: "Proposal not found.",
      nextActions: [],
      procrowCounterpartRoute: routes.admin.requests,
    };
  }

  if (blueprint.request.submittedByUserId !== user.id) {
    return {
      ok: false,
      status: "blocked",
      message: CLIENT_APPROVAL_BLOCKED_LABELS.ownership_unverified,
      blockedReason: "ownership_unverified",
      proposalStatus: blueprint.proposalStatus,
      requestStatus: blueprint.request.status,
      nextActions: [],
      procrowCounterpartRoute: CLIENT_APPROVAL_PROCROW_COUNTERPART.route(blueprint.request.id),
    };
  }

  if (blueprint.proposalStatus === "CLIENT_APPROVED") {
    const at = blueprint.clientApprovedAt ?? new Date();
    return {
      ok: true,
      status: "approved",
      message: CLIENT_APPROVAL_BLOCKED_LABELS.already_approved,
      proposalStatus: "CLIENT_APPROVED",
      requestStatus: blueprint.request.status,
      approvedAt: at.toISOString(),
      nextActions: ["ProCrow is reviewing onboarding readiness."],
      procrowCounterpartRoute: CLIENT_APPROVAL_PROCROW_COUNTERPART.route(blueprint.request.id),
    };
  }

  if (blueprint.proposalStatus !== "SENT") {
    return {
      ok: false,
      status: "blocked",
      message: CLIENT_APPROVAL_BLOCKED_LABELS.proposal_not_ready,
      blockedReason: "proposal_not_ready",
      proposalStatus: blueprint.proposalStatus,
      requestStatus: blueprint.request.status,
      nextActions: [],
      procrowCounterpartRoute: CLIENT_APPROVAL_PROCROW_COUNTERPART.route(blueprint.request.id),
    };
  }

  const approvedAt = new Date();

  const updated = await prisma.enterpriseBlueprint.update({
    where: { id: proposalId },
    data: {
      proposalStatus: "CLIENT_APPROVED",
      clientApprovedAt: approvedAt,
    },
    select: { proposalStatus: true, clientApprovedAt: true, requestId: true },
  });

  try {
    await notifyProcrowClientScopeApproved({
      organizationName: blueprint.request.organizationName,
      referenceCode: blueprint.request.referenceCode,
      requestId: blueprint.request.id,
      blueprintId: proposalId,
      approverEmail: user.email ?? null,
      approverUserId: user.id,
    });
  } catch {
    /* notification failure must not roll back approval */
  }

  return {
    ok: true,
    status: "approved",
    message:
      "Scope approval recorded for ProCrow review. This is not a contract signature or payment authorization.",
    proposalStatus: updated.proposalStatus,
    requestStatus: blueprint.request.status,
    approvedAt: (updated.clientApprovedAt ?? approvedAt).toISOString(),
    nextActions: [
      "ProCrow will review onboarding and provisioning readiness.",
      "You can track status on your request and onboarding pages.",
      "Tenant runtime is not created automatically.",
    ],
    procrowCounterpartRoute: CLIENT_APPROVAL_PROCROW_COUNTERPART.route(blueprint.request.id),
  };
}

/** Read helper for mock blueprint detail after approval. */
export function getMockBlueprintWithApprovalOverrides(blueprintId: string) {
  const base = getMockEnterpriseBlueprint(blueprintId);
  if (!base) return null;
  const overrides = getMockProposalApprovalOverrides();
  return {
    ...base,
    proposalStatus: overrides.proposalStatus,
    clientApprovedAt: overrides.clientApprovedAt,
  };
}
