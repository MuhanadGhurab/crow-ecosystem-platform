import { prisma, prismaTransaction } from "@/lib/db";
import type { EnterpriseBlueprintDraft } from "@/lib/model-forge/blueprint/blueprint-types";
import { authorizeBlueprintAction } from "./authority-matrix";
import { BlueprintEngineError } from "./errors";
import {
  buildPersistentSnapshot,
  evaluateTransition,
  verifyServerContentHash,
  supersedeOnNewVersion,
} from "./lifecycle-service";
import type { BlueprintReviewActionType, BlueprintRootLifecycleState } from "./types";
import { prismaBlueprintRepository, setBlueprintCurrentVersion, setBlueprintPlatformFinalized } from "./persistence/prisma-blueprint.repository";
import {
  getVersionRowId,
  nextVersionNumber,
  prismaBlueprintVersionRepository,
} from "./persistence/prisma-version.repository";
import {
  nextReviewCycleNumber,
  prismaBlueprintReviewRepository,
  supersedeOpenCycles,
  listReviewCycles,
  listReviewActions,
} from "./persistence/prisma-review.repository";
import { prismaBlueprintAuditRepository } from "./persistence/prisma-audit.repository";
import { projectClientBlueprint } from "./client-projection";

export type BlueprintActorContext = {
  platformAccountId: string;
  actorClass: "PLATFORM_ADMIN" | "REQUEST_OWNER" | "IMPLEMENTER" | "UNRELATED_CLIENT";
  supabaseUserId?: string;
};

async function assertRequestOwner(requestId: string, supabaseUserId: string): Promise<void> {
  const request = await prisma.implementationRequest.findUnique({
    where: { id: requestId },
    select: { submittedByUserId: true },
  });
  if (!request?.submittedByUserId || request.submittedByUserId !== supabaseUserId) {
    throw new BlueprintEngineError("BLUEPRINT_ACCESS_DENIED", "Request ownership required");
  }
}

async function appendAudit(
  blueprintId: string,
  blueprintVersionId: string | null,
  eventType: string,
  actor: BlueprintActorContext,
  payload: {
    versionNumber?: number;
    contentHashPrefix?: string;
    fromState?: string;
    toState?: string;
    reviewCycleNumber?: number;
    reasonCode?: string;
  },
) {
  await prismaBlueprintAuditRepository.append({
    blueprintId,
    blueprintVersionId,
    eventType,
    actorClass: actor.actorClass,
    actorPlatformAccountId: actor.actorClass === "REQUEST_OWNER" ? actor.platformAccountId : actor.platformAccountId,
    payload,
  });
}

export async function saveInternalDraftFromPreview(input: {
  requestId: string;
  draft: EnterpriseBlueprintDraft;
  actor: BlueprintActorContext;
  expectedContentHash?: string;
}) {
  const auth = authorizeBlueprintAction("PLATFORM_ADMIN", "MARK_READY_TO_SHARE");
  if (!auth.allowed || input.actor.actorClass !== "PLATFORM_ADMIN") {
    throw new BlueprintEngineError("BLUEPRINT_ACCESS_DENIED", auth.reason ?? "PLATFORM_ADMIN required");
  }

  const snapshot = buildPersistentSnapshot(input.draft);
  const serverHash = verifyServerContentHash(snapshot);
  if (input.expectedContentHash && input.expectedContentHash !== serverHash) {
    throw new BlueprintEngineError("BLUEPRINT_CONTENT_HASH_MISMATCH", "Preview hash mismatch");
  }

  return prismaTransaction(async () => {
    let root = await prismaBlueprintRepository.findByRequestId(input.requestId);
    if (!root) {
      root = await prismaBlueprintRepository.createRoot({
        requestId: input.requestId,
        createdByPlatformAccountId: input.actor.platformAccountId,
      });
      await appendAudit(root.id, null, "BLUEPRINT_CREATED", input.actor, {});
    }

    const versionNumber = await nextVersionNumber(root.id);
    const version = await prismaBlueprintVersionRepository.createImmutableVersion({
      blueprintId: root.id,
      versionNumber,
      snapshot,
      createdByPlatformAccountId: input.actor.platformAccountId,
    });

    const versionRowId = await getVersionRowId(root.id, versionNumber);
    root = await setBlueprintCurrentVersion(root.id, versionRowId!, versionNumber, root.rowVersion);

    await appendAudit(root.id, versionRowId, "BLUEPRINT_VERSION_CREATED", input.actor, {
      versionNumber,
      contentHashPrefix: snapshot.contentHash.slice(0, 16),
      toState: "DRAFT_INTERNAL",
    });

    return { root, version, versionNumber, contentHash: snapshot.contentHash };
  });
}

export async function executeBlueprintLifecycleAction(input: {
  blueprintId: string;
  action: BlueprintReviewActionType;
  actor: BlueprintActorContext;
  versionNumber: number;
  contentHashAtAction: string;
  expectedRowVersion: number;
  reason?: string | null;
  supabaseUserId?: string;
}) {
  const root = await prismaBlueprintRepository.findById(input.blueprintId);
  if (!root) throw new BlueprintEngineError("BLUEPRINT_NOT_FOUND", "Blueprint not found");

  const auth = authorizeBlueprintAction(input.actor.actorClass, input.action);
  if (!auth.allowed) {
    throw new BlueprintEngineError("BLUEPRINT_ACCESS_DENIED", auth.reason ?? "Access denied");
  }

  if (input.actor.actorClass === "REQUEST_OWNER") {
    if (!input.supabaseUserId) throw new BlueprintEngineError("BLUEPRINT_ACCESS_DENIED", "Authentication required");
    await assertRequestOwner(root.requestId, input.supabaseUserId);
  }

  const version = await prismaBlueprintVersionRepository.getVersion(input.blueprintId, input.versionNumber);
  if (!version) throw new BlueprintEngineError("BLUEPRINT_NOT_FOUND", "Version not found");

  const openCycle = await prismaBlueprintReviewRepository.getOpenCycle(input.blueprintId, input.versionNumber);
  const reviewCycleState = openCycle?.state ?? "CLOSED";

  const transition = evaluateTransition({
    currentState: root.lifecycleState,
    action: input.action,
    exactVersionNumber: input.versionNumber,
    currentVersionNumber: root.currentVersionNumber ?? input.versionNumber,
    sharedVersionNumber: root.sharedWithClientVersionNumber,
    reviewCycleState,
    contentHash: version.snapshot.contentHash,
    actionContentHash: input.contentHashAtAction,
    requestOwnerPlatformAccountId: input.actor.platformAccountId,
    actorPlatformAccountId: input.actor.platformAccountId,
    expectedRowVersion: input.expectedRowVersion,
    actualRowVersion: root.rowVersion,
  });

  const versionRowId = await getVersionRowId(input.blueprintId, input.versionNumber);

  return prismaTransaction(async () => {
    let cycle = openCycle;
    if (input.action === "SHARE_WITH_CLIENT" && !cycle) {
      const cycleNumber = await nextReviewCycleNumber(input.blueprintId);
      cycle = await prismaBlueprintReviewRepository.openReviewCycle({
        blueprintId: input.blueprintId,
        blueprintVersionId: versionRowId!,
        versionNumber: input.versionNumber,
        cycleNumber,
        audience: "CLIENT",
      });
    }

    if (cycle) {
      await prismaBlueprintReviewRepository.recordAction({
        reviewCycleId: cycle.id,
        blueprintVersionId: versionRowId!,
        actorPlatformAccountId: input.actor.platformAccountId,
        actorClass: input.actor.actorClass,
        action: input.action,
        reason: input.reason ?? null,
        contentHashAtAction: input.contentHashAtAction,
      });
      if (transition.nextReviewCycleState && transition.nextReviewCycleState !== "OPEN") {
        await prismaBlueprintReviewRepository.closeCycle(cycle.id, transition.nextReviewCycleState);
      }
    }

    const patch: Parameters<typeof prismaBlueprintRepository.transitionLifecycle>[2] = {
      lifecycleState: transition.nextState,
    };
    if (input.action === "SHARE_WITH_CLIENT") {
      patch.clientVisibility = "SHARED_EXACT_VERSION";
      patch.sharedWithClientVersionNumber = input.versionNumber;
    }
    if (input.action === "PLATFORM_FINALIZE") {
      await setBlueprintPlatformFinalized(
        input.blueprintId,
        versionRowId!,
        input.versionNumber,
        input.expectedRowVersion,
      );
    } else {
      await prismaBlueprintRepository.transitionLifecycle(input.blueprintId, input.expectedRowVersion, patch);
    }

    await appendAudit(input.blueprintId, versionRowId, `BLUEPRINT_${input.action}`, input.actor, {
      versionNumber: input.versionNumber,
      contentHashPrefix: version.snapshot.contentHash.slice(0, 16),
      fromState: root.lifecycleState,
      toState: transition.nextState,
      reviewCycleNumber: cycle?.cycleNumber,
      reasonCode: input.reason ?? undefined,
    });

    return { nextState: transition.nextState as BlueprintRootLifecycleState };
  });
}

export async function createSupersedingVersionFromPreview(input: {
  blueprintId: string;
  draft: EnterpriseBlueprintDraft;
  actor: BlueprintActorContext;
  expectedRowVersion: number;
}) {
  if (input.actor.actorClass !== "PLATFORM_ADMIN") {
    throw new BlueprintEngineError("BLUEPRINT_ACCESS_DENIED", "PLATFORM_ADMIN required");
  }
  const root = await prismaBlueprintRepository.findById(input.blueprintId);
  if (!root) throw new BlueprintEngineError("BLUEPRINT_NOT_FOUND", "Blueprint not found");

  const snapshot = buildPersistentSnapshot(input.draft);
  verifyServerContentHash(snapshot);
  const supersede = supersedeOnNewVersion({
    previousSharedVersion: root.sharedWithClientVersionNumber,
    newVersionNumber: (root.currentVersionNumber ?? 0) + 1,
  });
  if (supersede.closesReviewCycles) await supersedeOpenCycles(input.blueprintId);

  const versionNumber = await nextVersionNumber(input.blueprintId);
  const version = await prismaBlueprintVersionRepository.createImmutableVersion({
    blueprintId: input.blueprintId,
    versionNumber,
    snapshot,
    createdByPlatformAccountId: input.actor.platformAccountId,
  });
  const versionRowId = await getVersionRowId(input.blueprintId, versionNumber);
  await setBlueprintCurrentVersion(input.blueprintId, versionRowId!, versionNumber, input.expectedRowVersion);
  await prismaBlueprintRepository.transitionLifecycle(input.blueprintId, input.expectedRowVersion + 1, {
    lifecycleState: "DRAFT_INTERNAL",
    clientVisibility: "NOT_SHARED",
    sharedWithClientVersionNumber: null,
    currentVersionNumber: versionNumber,
  });

  return { version, versionNumber, invalidatesAcceptance: supersede.invalidatesAcceptance };
}

export async function getClientBlueprintProjectionForRequest(requestId: string, supabaseUserId: string) {
  await assertRequestOwner(requestId, supabaseUserId);
  const root = await prismaBlueprintRepository.findByRequestId(requestId);
  if (!root || root.clientVisibility !== "SHARED_EXACT_VERSION" || root.sharedWithClientVersionNumber === null) {
    throw new BlueprintEngineError("BLUEPRINT_ACCESS_DENIED", "No Blueprint shared with client");
  }
  const version = await prismaBlueprintVersionRepository.getVersion(root.id, root.sharedWithClientVersionNumber);
  if (!version) throw new BlueprintEngineError("BLUEPRINT_NOT_FOUND", "Shared version not found");
  return {
    root,
    projection: projectClientBlueprint(version.snapshot, version.versionNumber),
    contentHash: version.snapshot.contentHash,
    versionNumber: version.versionNumber,
  };
}

export async function getBlueprintAdminDetail(blueprintId: string) {
  const root = await prismaBlueprintRepository.findById(blueprintId);
  if (!root) return null;
  const versions = await prismaBlueprintVersionRepository.listVersions(blueprintId);
  const cycles = await listReviewCycles(blueprintId);
  const actions = await listReviewActions(blueprintId);
  const traces = await prismaBlueprintAuditRepository.listByBlueprint(blueprintId);
  return { root, versions, cycles, actions, traces };
}

/** Side-effect containment — lifecycle must never provision tenants or grant authority. */
export { BLUEPRINT_LIFECYCLE_SIDE_EFFECTS } from "./side-effect-policy";
