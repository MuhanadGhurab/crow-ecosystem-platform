import "@/lib/server-only-guard";

import type { ImplementationRequestStatus, PlatformInternalRole } from "@prisma/client";
import { Prisma } from "@prisma/client";

import { findPlatformAccountById } from "@/lib/account/platform-account.service";
import {
  pickHighestInternalCrowRole,
} from "@/lib/auth/authority-boundaries";
import { listActiveInternalPlatformRoles } from "@/lib/auth/platform-internal-role.service";
import { Permission, hasPermission } from "@/lib/auth/permissions";
import { prisma, prismaTransaction } from "@/lib/db";
import {
  FTGP_PROCROW_REVIEW_AUDIT_KEY,
  FTGP_PROCROW_REVIEW_AUDIT_SECTION,
  FTGP_PROCROW_REVIEW_AUDIT_SOURCE,
  FTGP_PROCROW_REVIEW_FROM_STATUS,
  FTGP_PROCROW_REVIEW_TO_STATUS,
  FTGP_PROCROW_REVIEW_TRANSITION_EXECUTE_REASON,
} from "@/lib/ftgp/ftgp-procrow-review-transition.constants";
import { notifyPipelineEvent } from "@/lib/services/notification.service";
import { resolveSectorTemplateKey } from "@/lib/org-intelligence/resolve-sector";

export const FTGP_PROCROW_REVIEW_TRANSITION_REASON =
  FTGP_PROCROW_REVIEW_TRANSITION_EXECUTE_REASON;

export type TransitionProCrowReviewInput = {
  requestId: string;
  actorPlatformAccountId: string;
  correlationId: string;
  reason?: string;
};

export type TransitionProCrowReviewResult = {
  idempotent: boolean;
  requestId: string;
  fromStatus: ImplementationRequestStatus;
  toStatus: ImplementationRequestStatus;
};

export class ProCrowReviewTransitionError extends Error {
  constructor(
    message: string,
    readonly code:
      | "NOT_FOUND"
      | "FORBIDDEN"
      | "INVALID_STATUS"
      | "INVALID_CORRELATION"
      | "ACTOR_INACTIVE"
  ) {
    super(message);
    this.name = "ProCrowReviewTransitionError";
  }
}

function actorMayTransition(roles: readonly PlatformInternalRole[]): boolean {
  const crowRole = pickHighestInternalCrowRole([...roles]);
  return Boolean(crowRole && hasPermission(crowRole, Permission["platform.requests.manage"]));
}

export async function planProCrowReviewTransition(input: {
  requestId: string;
  actorPlatformAccountId: string;
  correlationId: string;
}): Promise<{
  allowed: boolean;
  refusal: string | null;
  fromStatus: ImplementationRequestStatus | null;
  toStatus: typeof FTGP_PROCROW_REVIEW_TO_STATUS;
  idempotent: boolean;
}> {
  const correlationId = input.correlationId.trim();
  if (correlationId.length < 8) {
    return {
      allowed: false,
      refusal: "invalid_correlation",
      fromStatus: null,
      toStatus: FTGP_PROCROW_REVIEW_TO_STATUS,
      idempotent: false,
    };
  }

  const [request, actor, actorRoles] = await Promise.all([
    prisma.implementationRequest.findUnique({
      where: { id: input.requestId },
      include: {
        discoveryProfile: { include: { answers: true } },
        enterpriseBlueprint: { select: { id: true, proposalStatus: true, tenantId: true } },
      },
    }),
    findPlatformAccountById(input.actorPlatformAccountId),
    listActiveInternalPlatformRoles(input.actorPlatformAccountId),
  ]);

  if (!request) {
    return {
      allowed: false,
      refusal: "request_not_found",
      fromStatus: null,
      toStatus: FTGP_PROCROW_REVIEW_TO_STATUS,
      idempotent: false,
    };
  }
  if (!actor || actor.status !== "ACTIVE") {
    return {
      allowed: false,
      refusal: "actor_inactive",
      fromStatus: request.status,
      toStatus: FTGP_PROCROW_REVIEW_TO_STATUS,
      idempotent: false,
    };
  }
  if (!actorMayTransition(actorRoles)) {
    return {
      allowed: false,
      refusal: "actor_forbidden",
      fromStatus: request.status,
      toStatus: FTGP_PROCROW_REVIEW_TO_STATUS,
      idempotent: false,
    };
  }

  const existingAudit = request.discoveryProfile?.answers.find(
    (a) =>
      a.sectionKey === FTGP_PROCROW_REVIEW_AUDIT_SECTION &&
      a.questionKey === FTGP_PROCROW_REVIEW_AUDIT_KEY &&
      (a.valueJson as { correlationId?: string })?.correlationId === correlationId
  );
  if (existingAudit && request.status === FTGP_PROCROW_REVIEW_TO_STATUS) {
    return {
      allowed: true,
      refusal: null,
      fromStatus: request.status,
      toStatus: FTGP_PROCROW_REVIEW_TO_STATUS,
      idempotent: true,
    };
  }

  if (request.status !== FTGP_PROCROW_REVIEW_FROM_STATUS) {
    return {
      allowed: false,
      refusal: "invalid_status",
      fromStatus: request.status,
      toStatus: FTGP_PROCROW_REVIEW_TO_STATUS,
      idempotent: false,
    };
  }
  if (request.enterpriseBlueprint?.tenantId) {
    return {
      allowed: false,
      refusal: "tenant_exists",
      fromStatus: request.status,
      toStatus: FTGP_PROCROW_REVIEW_TO_STATUS,
      idempotent: false,
    };
  }
  if (request.discoveryProfile?.status === "COMPLETED") {
    return {
      allowed: false,
      refusal: "discovery_completed",
      fromStatus: request.status,
      toStatus: FTGP_PROCROW_REVIEW_TO_STATUS,
      idempotent: false,
    };
  }
  if (
    request.enterpriseBlueprint &&
    request.enterpriseBlueprint.proposalStatus !== "DRAFT"
  ) {
    return {
      allowed: false,
      refusal: "proposal_not_draft",
      fromStatus: request.status,
      toStatus: FTGP_PROCROW_REVIEW_TO_STATUS,
      idempotent: false,
    };
  }

  return {
    allowed: true,
    refusal: null,
    fromStatus: request.status,
    toStatus: FTGP_PROCROW_REVIEW_TO_STATUS,
    idempotent: false,
  };
}

export async function transitionImplementationRequestToProCrowReview(
  input: TransitionProCrowReviewInput
): Promise<TransitionProCrowReviewResult> {
  const plan = await planProCrowReviewTransition(input);
  if (!plan.allowed) {
    throw new ProCrowReviewTransitionError(
      `ProCrow review transition refused: ${plan.refusal ?? "unknown"}`,
      plan.refusal === "actor_forbidden"
        ? "FORBIDDEN"
        : plan.refusal === "invalid_status"
          ? "INVALID_STATUS"
          : plan.refusal === "request_not_found"
            ? "NOT_FOUND"
            : "ACTOR_INACTIVE"
    );
  }
  if (plan.idempotent) {
    return {
      idempotent: true,
      requestId: input.requestId,
      fromStatus: FTGP_PROCROW_REVIEW_FROM_STATUS,
      toStatus: FTGP_PROCROW_REVIEW_TO_STATUS,
    };
  }

  await prismaTransaction(async (tx: Prisma.TransactionClient) => {
    const locked = await tx.implementationRequest.findUniqueOrThrow({
      where: { id: input.requestId },
      include: { requestedModules: true, discoveryProfile: true },
    });

    if (locked.status !== FTGP_PROCROW_REVIEW_FROM_STATUS) {
      throw new ProCrowReviewTransitionError(
        `Concurrent status change detected (${locked.status})`,
        "INVALID_STATUS"
      );
    }

    await tx.implementationRequest.update({
      where: { id: input.requestId },
      data: { status: FTGP_PROCROW_REVIEW_TO_STATUS },
    });

    const profile = await tx.discoveryProfile.upsert({
      where: { requestId: input.requestId },
      create: { requestId: input.requestId, status: "IN_PROGRESS" },
      update: { status: "IN_PROGRESS" },
    });

    await tx.discoveryAnswer.upsert({
      where: {
        profileId_sectionKey_questionKey: {
          profileId: profile.id,
          sectionKey: FTGP_PROCROW_REVIEW_AUDIT_SECTION,
          questionKey: FTGP_PROCROW_REVIEW_AUDIT_KEY,
        },
      },
      create: {
        profileId: profile.id,
        sectionKey: FTGP_PROCROW_REVIEW_AUDIT_SECTION,
        questionKey: FTGP_PROCROW_REVIEW_AUDIT_KEY,
        valueJson: {
          correlationId: input.correlationId,
          actorPlatformAccountId: input.actorPlatformAccountId,
          fromStatus: FTGP_PROCROW_REVIEW_FROM_STATUS,
          toStatus: FTGP_PROCROW_REVIEW_TO_STATUS,
          source: FTGP_PROCROW_REVIEW_AUDIT_SOURCE,
          reason: input.reason?.trim() || FTGP_PROCROW_REVIEW_TRANSITION_REASON,
          at: new Date().toISOString(),
        } as Prisma.InputJsonValue,
      },
      update: {
        valueJson: {
          correlationId: input.correlationId,
          actorPlatformAccountId: input.actorPlatformAccountId,
          fromStatus: FTGP_PROCROW_REVIEW_FROM_STATUS,
          toStatus: FTGP_PROCROW_REVIEW_TO_STATUS,
          source: FTGP_PROCROW_REVIEW_AUDIT_SOURCE,
          reason: input.reason?.trim() || FTGP_PROCROW_REVIEW_TRANSITION_REASON,
          at: new Date().toISOString(),
        } as Prisma.InputJsonValue,
      },
    });

    const sectorKey = resolveSectorTemplateKey({
      industry: locked.industry,
      moduleKeys: locked.requestedModules.map((m) => m.moduleKey),
    });
    await tx.discoveryAnswer.upsert({
      where: {
        profileId_sectionKey_questionKey: {
          profileId: profile.id,
          sectionKey: "org_intelligence",
          questionKey: "sectorTemplateKey",
        },
      },
      create: {
        profileId: profile.id,
        sectionKey: "org_intelligence",
        questionKey: "sectorTemplateKey",
        valueJson: sectorKey,
      },
      update: { valueJson: sectorKey },
    });

    const contact = await tx.requestContact.findFirst({
      where: { requestId: input.requestId, isPrimary: true },
    });
    if (contact?.email) {
      void notifyPipelineEvent("discovery_started", contact.email, {
        requestId: locked.id,
        referenceCode: locked.referenceCode,
        organizationName: locked.organizationName,
        contactName: contact.fullName,
      });
    }
  });

  return {
    idempotent: false,
    requestId: input.requestId,
    fromStatus: FTGP_PROCROW_REVIEW_FROM_STATUS,
    toStatus: FTGP_PROCROW_REVIEW_TO_STATUS,
  };
}
