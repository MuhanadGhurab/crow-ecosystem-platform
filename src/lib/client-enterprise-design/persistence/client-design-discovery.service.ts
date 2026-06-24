import "@/lib/server-only-guard";

import { randomUUID } from "node:crypto";

import type { Prisma } from "@prisma/client";

import { FTGP_CLIENT_ENTERPRISE_DESIGN_SECTION } from "@/lib/ftgp/ftgp-discovery-invariant.constants";
import { FTGP_DISCOVERY_QUESTION_CATALOG_VERSION } from "@/lib/ftgp/ftgp-discovery-question-catalog";
import {
  planDiscoveryAnswerWrite,
  writeDiscoveryAnswerAudited,
} from "@/lib/ftgp/ftgp-discovery-answer-write.service";
import { prisma } from "@/lib/db";
import { clientCanAccessRequestAuthoritative } from "@/lib/auth/customer-access.service";
import type { ClientEnterpriseDesignDraft } from "../types";
import {
  CLIENT_DESIGN_ANSWER_KEYS,
  draftToInput,
  emptyClientEnterpriseDesignDraft,
  sanitizeDraftForPersistence,
} from "./constants";
import { hashDraftSnapshot } from "./snapshot-hash.server";
import { composeClientEnterpriseDesign } from "../recommendations/compose-client-enterprise-design";
import { hasStructuralContradictions, validateClientEnterpriseDesignDraft } from "../validation/validate-draft";

export async function loadClientEnterpriseDesignDraft(
  requestId: string,
): Promise<{ draft: ClientEnterpriseDesignDraft; profileUpdatedAt: string | null }> {
  const profile = await prisma.discoveryProfile.findUnique({
    where: { requestId },
    include: { answers: true },
  });
  if (!profile) {
    return { draft: emptyClientEnterpriseDesignDraft(requestId), profileUpdatedAt: null };
  }
  const snapshotAnswer = profile.answers.find(
    (a) =>
      a.sectionKey === FTGP_CLIENT_ENTERPRISE_DESIGN_SECTION &&
      a.questionKey === CLIENT_DESIGN_ANSWER_KEYS.draftSnapshot,
  );
  if (!snapshotAnswer?.valueJson || typeof snapshotAnswer.valueJson !== "object") {
    return { draft: emptyClientEnterpriseDesignDraft(requestId), profileUpdatedAt: profile.updatedAt.toISOString() };
  }
  const payload = snapshotAnswer.valueJson as { draft?: ClientEnterpriseDesignDraft };
  const validated = validateClientEnterpriseDesignDraft(payload.draft ?? payload);
  if (!validated.ok) {
    return { draft: emptyClientEnterpriseDesignDraft(requestId), profileUpdatedAt: profile.updatedAt.toISOString() };
  }
  return { draft: validated.draft, profileUpdatedAt: profile.updatedAt.toISOString() };
}

export async function assertClientEnterpriseDesignWrite(args: {
  supabaseUserId: string;
  platformAccountId: string;
  requestId: string;
  ownerBrowserProofVerified?: boolean;
}): Promise<{ profileId: string; profileUpdatedAt: string }> {
  const allowed = await clientCanAccessRequestAuthoritative(args.supabaseUserId, args.requestId);
  if (!allowed) throw new Error("Request ownership required.");

  const request = await prisma.implementationRequest.findUnique({
    where: { id: args.requestId },
    select: { submittedByUserId: true, status: true, discoveryProfile: true },
  });
  if (!request?.discoveryProfile) throw new Error("Discovery profile missing.");
  if (request.submittedByUserId !== args.supabaseUserId) {
    throw new Error("Only the authoritative request owner may write client design answers.");
  }
  return {
    profileId: request.discoveryProfile.id,
    profileUpdatedAt: request.discoveryProfile.updatedAt.toISOString(),
  };
}

async function writeDesignAnswer(args: {
  requestId: string;
  profileId: string;
  platformAccountId: string;
  questionKey: string;
  valueJson: Prisma.InputJsonValue;
  expectedProfileUpdatedAt?: string | null;
  ownerBrowserProofVerified?: boolean;
}) {
  const correlationId = randomUUID().replace(/-/g, "");
  const plan = await planDiscoveryAnswerWrite({
    requestId: args.requestId,
    discoveryProfileId: args.profileId,
    actorPlatformAccountId: args.platformAccountId,
    sectionKey: FTGP_CLIENT_ENTERPRISE_DESIGN_SECTION,
    questionKey: args.questionKey,
    questionVersion: FTGP_DISCOVERY_QUESTION_CATALOG_VERSION,
    correlationId,
    provenance: "client_owner",
    ownerBrowserProofVerified: args.ownerBrowserProofVerified,
    expectedProfileUpdatedAt: args.expectedProfileUpdatedAt,
  });
  if (!plan.allowed) {
    throw new Error(plan.refusal ?? "write_refused");
  }
  await writeDiscoveryAnswerAudited({
    requestId: args.requestId,
    discoveryProfileId: args.profileId,
    actorPlatformAccountId: args.platformAccountId,
    sectionKey: FTGP_CLIENT_ENTERPRISE_DESIGN_SECTION,
    questionKey: args.questionKey,
    questionVersion: FTGP_DISCOVERY_QUESTION_CATALOG_VERSION,
    correlationId,
    provenance: "client_owner",
    ownerBrowserProofVerified: args.ownerBrowserProofVerified,
    expectedProfileUpdatedAt: args.expectedProfileUpdatedAt,
    valueJson: args.valueJson,
  });
}

export async function saveClientEnterpriseDesignDraftHosted(args: {
  supabaseUserId: string;
  platformAccountId: string;
  draft: ClientEnterpriseDesignDraft;
  expectedProfileUpdatedAt?: string | null;
  ownerBrowserProofVerified?: boolean;
}): Promise<{ snapshotHash: string; profileUpdatedAt: string }> {
  const validated = validateClientEnterpriseDesignDraft(args.draft);
  if (!validated.ok) throw new Error(validated.errors.join("; "));

  const { profileId, profileUpdatedAt } = await assertClientEnterpriseDesignWrite({
    supabaseUserId: args.supabaseUserId,
    platformAccountId: args.platformAccountId,
    requestId: args.draft.requestId,
    ownerBrowserProofVerified: args.ownerBrowserProofVerified,
  });

  const input = draftToInput(validated.draft);
  const snapshot = composeClientEnterpriseDesign(input);
  const draft: ClientEnterpriseDesignDraft = {
    ...sanitizeDraftForPersistence(validated.draft),
    recommendationSnapshot: snapshot,
    unresolvedDecisions: snapshot.unresolvedDecisions,
    updatedAt: new Date().toISOString(),
    status: validated.draft.status === "SUBMITTED" ? "SUBMITTED" : "DRAFT",
  };
  const snapshotHash = hashDraftSnapshot(draft);

  await writeDesignAnswer({
    requestId: args.draft.requestId,
    profileId,
    platformAccountId: args.platformAccountId,
    questionKey: CLIENT_DESIGN_ANSWER_KEYS.draftSnapshot,
    valueJson: { draft },
    expectedProfileUpdatedAt: args.expectedProfileUpdatedAt ?? profileUpdatedAt,
    ownerBrowserProofVerified: args.ownerBrowserProofVerified,
  });
  await writeDesignAnswer({
    requestId: args.draft.requestId,
    profileId,
    platformAccountId: args.platformAccountId,
    questionKey: CLIENT_DESIGN_ANSWER_KEYS.designStatus,
    valueJson: { status: draft.status },
    expectedProfileUpdatedAt: undefined,
    ownerBrowserProofVerified: args.ownerBrowserProofVerified,
  });
  await writeDesignAnswer({
    requestId: args.draft.requestId,
    profileId,
    platformAccountId: args.platformAccountId,
    questionKey: CLIENT_DESIGN_ANSWER_KEYS.snapshotHash,
    valueJson: { hash: snapshotHash },
    expectedProfileUpdatedAt: undefined,
    ownerBrowserProofVerified: args.ownerBrowserProofVerified,
  });

  const updated = await prisma.discoveryProfile.findUniqueOrThrow({
    where: { id: profileId },
    select: { updatedAt: true },
  });
  return { snapshotHash, profileUpdatedAt: updated.updatedAt.toISOString() };
}

export async function submitClientEnterpriseDesignHosted(args: {
  supabaseUserId: string;
  platformAccountId: string;
  draft: ClientEnterpriseDesignDraft;
  expectedProfileUpdatedAt?: string | null;
  ownerBrowserProofVerified?: boolean;
}): Promise<{ snapshotHash: string }> {
  const contradictions = hasStructuralContradictions({ ...args.draft, status: "SUBMITTED" });
  if (contradictions.length) throw new Error(contradictions.join("; "));

  const submitted: ClientEnterpriseDesignDraft = {
    ...args.draft,
    status: "SUBMITTED",
    submittedAt: new Date().toISOString(),
  };
  const result = await saveClientEnterpriseDesignDraftHosted({
    ...args,
    draft: submitted,
  });

  const { profileId } = await assertClientEnterpriseDesignWrite({
    supabaseUserId: args.supabaseUserId,
    platformAccountId: args.platformAccountId,
    requestId: args.draft.requestId,
    ownerBrowserProofVerified: args.ownerBrowserProofVerified,
  });

  await writeDesignAnswer({
    requestId: args.draft.requestId,
    profileId,
    platformAccountId: args.platformAccountId,
    questionKey: CLIENT_DESIGN_ANSWER_KEYS.submittedAt,
    valueJson: { submittedAt: submitted.submittedAt },
    ownerBrowserProofVerified: args.ownerBrowserProofVerified,
  });

  return { snapshotHash: result.snapshotHash };
}
