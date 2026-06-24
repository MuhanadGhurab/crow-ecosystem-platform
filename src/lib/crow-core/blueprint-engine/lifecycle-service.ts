import type {
  BlueprintRootLifecycleState,
  BlueprintReviewActionType,
  BlueprintReviewCycleState,
  PersistentBlueprintVersionSnapshot,
} from "./types";
import { BlueprintEngineError } from "./errors";
import { hashBlueprintContent } from "@/lib/model-forge/blueprint/blueprint-hash";
import type { EnterpriseBlueprintDraft } from "@/lib/model-forge/blueprint/blueprint-types";

export type TransitionContext = {
  currentState: BlueprintRootLifecycleState;
  action: BlueprintReviewActionType;
  exactVersionNumber: number;
  currentVersionNumber: number;
  sharedVersionNumber: number | null;
  reviewCycleState: BlueprintReviewCycleState;
  contentHash: string;
  actionContentHash: string;
  requestOwnerPlatformAccountId: string;
  actorPlatformAccountId: string;
  expectedRowVersion: number;
  actualRowVersion: number;
};

export type TransitionResult = {
  nextState: BlueprintRootLifecycleState;
  nextReviewCycleState?: BlueprintReviewCycleState;
  requiresNewVersion: boolean;
  invalidatesClientAcceptance: boolean;
};

const TRANSITIONS: Partial<
  Record<BlueprintRootLifecycleState, Partial<Record<BlueprintReviewActionType, TransitionResult>>>
> = {
  DRAFT_INTERNAL: {
    SUBMIT_FOR_INTERNAL_REVIEW: {
      nextState: "READY_FOR_INTERNAL_REVIEW",
      nextReviewCycleState: "OPEN",
      requiresNewVersion: false,
      invalidatesClientAcceptance: false,
    },
  },
  READY_FOR_INTERNAL_REVIEW: {
    REQUEST_INTERNAL_CHANGES: {
      nextState: "CHANGES_REQUESTED_INTERNAL",
      nextReviewCycleState: "CHANGES_REQUESTED",
      requiresNewVersion: false,
      invalidatesClientAcceptance: false,
    },
    MARK_READY_TO_SHARE: {
      nextState: "READY_TO_SHARE",
      requiresNewVersion: false,
      invalidatesClientAcceptance: false,
    },
  },
  READY_TO_SHARE: {
    SHARE_WITH_CLIENT: {
      nextState: "SHARED_WITH_CLIENT",
      nextReviewCycleState: "OPEN",
      requiresNewVersion: false,
      invalidatesClientAcceptance: false,
    },
  },
  SHARED_WITH_CLIENT: {
    CLIENT_COMMENT: { nextState: "CLIENT_REVIEWING", requiresNewVersion: false, invalidatesClientAcceptance: false },
    CLIENT_REQUEST_CHANGES: {
      nextState: "CLIENT_CHANGES_REQUESTED",
      nextReviewCycleState: "CHANGES_REQUESTED",
      requiresNewVersion: false,
      invalidatesClientAcceptance: true,
    },
    CLIENT_ACCEPT: {
      nextState: "CLIENT_ACCEPTED",
      nextReviewCycleState: "ACCEPTED",
      requiresNewVersion: false,
      invalidatesClientAcceptance: false,
    },
  },
  CLIENT_ACCEPTED: {
    PLATFORM_FINALIZE: {
      nextState: "PLATFORM_FINALIZED",
      nextReviewCycleState: "CLOSED",
      requiresNewVersion: false,
      invalidatesClientAcceptance: false,
    },
  },
};

export function evaluateTransition(ctx: TransitionContext): TransitionResult {
  if (ctx.expectedRowVersion !== ctx.actualRowVersion) {
    throw new BlueprintEngineError("BLUEPRINT_CONCURRENCY_CONFLICT", "Blueprint was modified by another operator");
  }
  if (ctx.actionContentHash !== ctx.contentHash) {
    throw new BlueprintEngineError("BLUEPRINT_CONTENT_HASH_MISMATCH", "Client action does not match shared version hash");
  }
  if (ctx.exactVersionNumber !== ctx.currentVersionNumber) {
    throw new BlueprintEngineError("BLUEPRINT_VERSION_STALE", "A newer Blueprint version exists");
  }
  if (ctx.sharedVersionNumber !== null && ctx.action.startsWith("CLIENT_") && ctx.exactVersionNumber !== ctx.sharedVersionNumber) {
    throw new BlueprintEngineError("BLUEPRINT_REVIEW_VERSION_MISMATCH", "Version is no longer shared with client");
  }
  if (ctx.reviewCycleState === "CLOSED" || ctx.reviewCycleState === "SUPERSEDED") {
    throw new BlueprintEngineError("BLUEPRINT_REVIEW_CYCLE_CLOSED", "Review cycle is closed");
  }
  if (ctx.currentState === "PLATFORM_FINALIZED") {
    throw new BlueprintEngineError("BLUEPRINT_ALREADY_FINALIZED", "Blueprint is already platform-finalized");
  }

  const result = TRANSITIONS[ctx.currentState]?.[ctx.action];
  if (!result) {
    throw new BlueprintEngineError(
      "BLUEPRINT_INVALID_TRANSITION",
      `Cannot ${ctx.action} from ${ctx.currentState}`,
    );
  }
  return result;
}

export function buildPersistentSnapshot(draft: EnterpriseBlueprintDraft): PersistentBlueprintVersionSnapshot {
  const contentJson = stripSecretsFromDraft(draft);
  const contentHash = hashBlueprintContent({
    ...contentJson,
    metadata: { ...contentJson.metadata, generatedAtDisplay: undefined },
  });
  const sourceModelHash = draft.metadata.sourceModelHash;

  return {
    schemaVersion: draft.metadata.schemaVersion,
    compilerVersion: draft.metadata.compilerVersion,
    sourceModelKey: draft.metadata.sourceModelKey,
    sourceModelHash,
    contentHash,
    contentJson,
    validationJson: draft.validation,
    decisionRegisterJson: draft.unresolvedDecisions,
    provenanceSummaryJson: draft.provenanceSummary,
    scenarioProfileJson: draft.scenarioProfile,
    reviewReadinessJson: {
      overallStatus: draft.provenanceSummary.unexplainedCount === 0 ? "READY_FOR_HUMAN_BLUEPRINT_REVIEW" : "BLOCKED",
      unexplainedProvenance: draft.provenanceSummary.unexplainedCount,
    },
  };
}

export function verifyServerContentHash(snapshot: PersistentBlueprintVersionSnapshot): string {
  const recomputed = hashBlueprintContent({
    ...snapshot.contentJson,
    metadata: { ...snapshot.contentJson.metadata, generatedAtDisplay: undefined },
  });
  if (recomputed !== snapshot.contentHash) {
    throw new BlueprintEngineError("BLUEPRINT_CONTENT_HASH_MISMATCH", "Server hash verification failed", false);
  }
  return recomputed;
}

export function rejectClientProvidedHash(clientHash: string, serverHash: string): void {
  if (clientHash !== serverHash) {
    throw new BlueprintEngineError("BLUEPRINT_CONTENT_HASH_MISMATCH", "Submitted content hash does not match server validation");
  }
}

function stripSecretsFromDraft(draft: EnterpriseBlueprintDraft): EnterpriseBlueprintDraft {
  return JSON.parse(JSON.stringify(draft)) as EnterpriseBlueprintDraft;
}

export function supersedeOnNewVersion(input: {
  previousSharedVersion: number | null;
  newVersionNumber: number;
}): { invalidatesAcceptance: boolean; closesReviewCycles: boolean } {
  return {
    invalidatesAcceptance: input.previousSharedVersion !== null,
    closesReviewCycles: true,
  };
}
