import "@/lib/server-only-guard";

import type { PlatformInternalRole } from "@prisma/client";
import { Prisma } from "@prisma/client";

import { findPlatformAccountById } from "@/lib/account/platform-account.service";
import { pickHighestInternalCrowRole } from "@/lib/auth/authority-boundaries";
import { listActiveInternalPlatformRoles } from "@/lib/auth/platform-internal-role.service";
import { Permission, hasPermission } from "@/lib/auth/permissions";
import { prisma, prismaTransaction } from "@/lib/db";
import {
  FTGP_CLIENT_DISCOVERY_ANSWER_SECTIONS,
  FTGP_DISCOVERY_CLIENT_ANSWER_SECTION,
  FTGP_CLIENT_ENTERPRISE_DESIGN_SECTION,
  FTGP_DISCOVERY_SYSTEM_ANSWER_SECTIONS,
} from "@/lib/ftgp/ftgp-discovery-invariant.constants";
import {
  CLIENT_OWNER_PROOF_REQUIRED_FOR_ANSWER_CAPTURE,
  FTGP_DISCOVERY_PROVENANCE,
} from "@/lib/ftgp/ftgp-discovery-provenance.constants";
import { assertCatalogQuestionVersion, findCatalogQuestion } from "@/lib/ftgp/ftgp-discovery-question-catalog";
import { isReservedSystemMarkerSection } from "@/lib/ftgp/ftgp-discovery-system-marker.constants";
import { FTGP_PROCROW_REVIEW_TO_STATUS } from "@/lib/ftgp/ftgp-procrow-review-transition.constants";

export type PlanDiscoveryAnswerWriteInput = {
  requestId: string;
  discoveryProfileId: string;
  actorPlatformAccountId: string;
  sectionKey: string;
  questionKey: string;
  questionVersion: string;
  correlationId: string;
  provenance: "client_owner" | "implementer_internal" | "system_derived";
  /** Required for client_owner when CLIENT_OWNER_PROOF_REQUIRED_FOR_ANSWER_CAPTURE. */
  ownerBrowserProofVerified?: boolean;
  /** Optimistic concurrency — expected profile updatedAt ISO string when supplied. */
  expectedProfileUpdatedAt?: string | null;
};

export type PlanDiscoveryAnswerWriteResult = {
  allowed: boolean;
  refusal: string | null;
  idempotent: boolean;
};

function isSystemSection(sectionKey: string): boolean {
  return (FTGP_DISCOVERY_SYSTEM_ANSWER_SECTIONS as readonly string[]).includes(sectionKey);
}

function actorMayWriteDiscovery(roles: readonly PlatformInternalRole[]): boolean {
  const crowRole = pickHighestInternalCrowRole([...roles]);
  return Boolean(crowRole && hasPermission(crowRole, Permission["platform.discovery.write"]));
}

export async function planDiscoveryAnswerWrite(
  input: PlanDiscoveryAnswerWriteInput
): Promise<PlanDiscoveryAnswerWriteResult> {
  const correlationId = input.correlationId.trim();
  if (correlationId.length < 8) {
    return { allowed: false, refusal: "invalid_correlation", idempotent: false };
  }

  if (input.provenance === "system_derived" && !isSystemSection(input.sectionKey)) {
    return { allowed: false, refusal: "system_provenance_section_mismatch", idempotent: false };
  }

  if (
    input.provenance === "client_owner" &&
    !(FTGP_CLIENT_DISCOVERY_ANSWER_SECTIONS as readonly string[]).includes(input.sectionKey)
  ) {
    return { allowed: false, refusal: "client_provenance_section_mismatch", idempotent: false };
  }

  if (isSystemSection(input.sectionKey) && input.provenance === "client_owner") {
    return { allowed: false, refusal: "client_cannot_write_system_section", idempotent: false };
  }

  if (
    input.provenance === "client_owner" &&
    isReservedSystemMarkerSection(input.sectionKey)
  ) {
    return { allowed: false, refusal: "client_cannot_write_system_section", idempotent: false };
  }

  const catalogQuestion = findCatalogQuestion(input.sectionKey, input.questionKey);
  if (!catalogQuestion && input.provenance !== "system_derived") {
    return { allowed: false, refusal: "unknown_question_key", idempotent: false };
  }
  if (
    catalogQuestion &&
    !assertCatalogQuestionVersion(
      input.sectionKey,
      input.questionKey,
      input.questionVersion
    )
  ) {
    return { allowed: false, refusal: "question_version_mismatch", idempotent: false };
  }
  if (catalogQuestion) {
    if (
      input.provenance === "client_owner" &&
      catalogQuestion.answerProvenance !== FTGP_DISCOVERY_PROVENANCE.CLIENT_PROVIDED
    ) {
      return { allowed: false, refusal: "provenance_actor_mismatch", idempotent: false };
    }
    if (
      input.provenance === "implementer_internal" &&
      catalogQuestion.answerProvenance !== FTGP_DISCOVERY_PROVENANCE.IMPLEMENTER_OBSERVATION
    ) {
      return { allowed: false, refusal: "provenance_actor_mismatch", idempotent: false };
    }
  }

  const [request, profile, actor, actorRoles] = await Promise.all([
    prisma.implementationRequest.findUnique({
      where: { id: input.requestId },
      select: { id: true, status: true, submittedByUserId: true },
    }),
    prisma.discoveryProfile.findUnique({
      where: { id: input.discoveryProfileId },
      include: { answers: true },
    }),
    findPlatformAccountById(input.actorPlatformAccountId),
    listActiveInternalPlatformRoles(input.actorPlatformAccountId),
  ]);

  if (!request) return { allowed: false, refusal: "request_not_found", idempotent: false };
  if (!profile || profile.requestId !== input.requestId) {
    return { allowed: false, refusal: "profile_mismatch", idempotent: false };
  }
  if (request.status !== FTGP_PROCROW_REVIEW_TO_STATUS) {
    return { allowed: false, refusal: "invalid_request_status", idempotent: false };
  }
  if (profile.status !== "IN_PROGRESS") {
    return { allowed: false, refusal: "profile_not_in_progress", idempotent: false };
  }
  if (!actor || actor.status !== "ACTIVE") {
    return { allowed: false, refusal: "actor_inactive", idempotent: false };
  }

  const existing = profile.answers.find(
    (a) =>
      a.sectionKey === input.sectionKey &&
      a.questionKey === input.questionKey &&
      (a.valueJson as { correlationId?: string })?.correlationId === correlationId
  );
  if (existing) {
    return { allowed: true, refusal: null, idempotent: true };
  }

  if (input.provenance === "client_owner") {
    if (actorRoles.length > 0) {
      return { allowed: false, refusal: "internal_actor_cannot_client_provide", idempotent: false };
    }
    if (actor.supabaseUserId !== request.submittedByUserId) {
      return { allowed: false, refusal: "actor_not_request_owner", idempotent: false };
    }
    if (
      CLIENT_OWNER_PROOF_REQUIRED_FOR_ANSWER_CAPTURE &&
      !input.ownerBrowserProofVerified
    ) {
      return { allowed: false, refusal: "owner_browser_proof_required", idempotent: false };
    }
  } else if (input.provenance === "implementer_internal") {
    if (!actorMayWriteDiscovery(actorRoles)) {
      return { allowed: false, refusal: "actor_forbidden", idempotent: false };
    }
  } else if (input.provenance !== "system_derived") {
    return { allowed: false, refusal: "invalid_provenance", idempotent: false };
  }

  if (
    input.expectedProfileUpdatedAt &&
    profile.updatedAt.toISOString() !== input.expectedProfileUpdatedAt
  ) {
    return { allowed: false, refusal: "profile_version_conflict", idempotent: false };
  }

  return { allowed: true, refusal: null, idempotent: false };
}

/** Audited write boundary — not invoked by FTGP.1E; callers must authorize separately. */
export async function writeDiscoveryAnswerAudited(
  input: PlanDiscoveryAnswerWriteInput & { valueJson: Prisma.InputJsonValue }
): Promise<{ idempotent: boolean }> {
  const plan = await planDiscoveryAnswerWrite(input);
  if (!plan.allowed) {
    throw new Error(`Discovery answer write refused: ${plan.refusal ?? "unknown"}`);
  }
  if (plan.idempotent) {
    return { idempotent: true };
  }

  await prismaTransaction(async (tx) => {
    const locked = await tx.discoveryProfile.findUniqueOrThrow({
      where: { id: input.discoveryProfileId },
      include: { request: { select: { status: true } } },
    });
    if (locked.request.status !== FTGP_PROCROW_REVIEW_TO_STATUS) {
      throw new Error("Concurrent request status change");
    }
    if (locked.status !== "IN_PROGRESS") {
      throw new Error("Concurrent profile status change");
    }
    if (locked.requestId !== input.requestId) {
      throw new Error("Profile request mismatch");
    }

    await tx.discoveryAnswer.upsert({
      where: {
        profileId_sectionKey_questionKey: {
          profileId: input.discoveryProfileId,
          sectionKey: input.sectionKey,
          questionKey: input.questionKey,
        },
      },
      create: {
        profileId: input.discoveryProfileId,
        sectionKey: input.sectionKey,
        questionKey: input.questionKey,
        valueJson: {
          ...((typeof input.valueJson === "object" && input.valueJson !== null
            ? input.valueJson
            : { value: input.valueJson }) as object),
          correlationId: input.correlationId,
          provenance: input.provenance,
          questionVersion: input.questionVersion,
          actorPlatformAccountId: input.actorPlatformAccountId,
          at: new Date().toISOString(),
        } as Prisma.InputJsonValue,
      },
      update: {
        valueJson: {
          ...((typeof input.valueJson === "object" && input.valueJson !== null
            ? input.valueJson
            : { value: input.valueJson }) as object),
          correlationId: input.correlationId,
          provenance: input.provenance,
          questionVersion: input.questionVersion,
          actorPlatformAccountId: input.actorPlatformAccountId,
          at: new Date().toISOString(),
        } as Prisma.InputJsonValue,
      },
    });
  });

  return { idempotent: false };
}
