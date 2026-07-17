/**
 * BLUEPRINT.1A — persistent Blueprint Engine domain types (design contracts).
 * Does not perform database I/O.
 */

import type { EnterpriseBlueprintDraft } from "@/lib/model-forge/blueprint/blueprint-types";

/** Root lifecycle — separates internal, client-visible, and finalization concerns. */
export type BlueprintRootLifecycleState =
  | "DRAFT_INTERNAL"
  | "READY_FOR_INTERNAL_REVIEW"
  | "CHANGES_REQUESTED_INTERNAL"
  | "READY_TO_SHARE"
  | "SHARED_WITH_CLIENT"
  | "CLIENT_REVIEWING"
  | "CLIENT_CHANGES_REQUESTED"
  | "CLIENT_ACCEPTED"
  | "PLATFORM_FINALIZED"
  | "SUPERSEDED"
  | "WITHDRAWN";

export type BlueprintClientVisibilityState =
  | "NOT_SHARED"
  | "SHARED_EXACT_VERSION"
  | "CLIENT_REVIEW_CLOSED";

export type BlueprintActorClass =
  | "PLATFORM_ADMIN"
  | "IMPLEMENTER"
  | "REQUEST_OWNER"
  | "UNRELATED_CLIENT"
  | "TENANT_MEMBER"
  | "ANONYMOUS";

export type BlueprintReviewAudience = "INTERNAL" | "CLIENT";

export type BlueprintReviewCycleState = "OPEN" | "CHANGES_REQUESTED" | "ACCEPTED" | "CLOSED" | "SUPERSEDED";

export type BlueprintReviewActionType =
  | "SUBMIT_FOR_INTERNAL_REVIEW"
  | "REQUEST_INTERNAL_CHANGES"
  | "MARK_READY_TO_SHARE"
  | "SHARE_WITH_CLIENT"
  | "CLIENT_COMMENT"
  | "CLIENT_REQUEST_CHANGES"
  | "CLIENT_ACCEPT"
  | "PLATFORM_FINALIZE"
  | "WITHDRAW"
  | "SUPERSEDE";

export type ClientProjectionVisibility =
  | "CLIENT_VISIBLE"
  | "CLIENT_SUMMARIZED"
  | "INTERNAL_ONLY"
  | "CONDITIONALLY_VISIBLE";

export type PersistentBlueprintVersionSnapshot = {
  schemaVersion: string;
  compilerVersion: string;
  sourceModelKey: string;
  sourceModelHash: string;
  contentHash: string;
  contentJson: EnterpriseBlueprintDraft;
  validationJson: EnterpriseBlueprintDraft["validation"];
  decisionRegisterJson: EnterpriseBlueprintDraft["unresolvedDecisions"];
  provenanceSummaryJson: EnterpriseBlueprintDraft["provenanceSummary"];
  scenarioProfileJson: EnterpriseBlueprintDraft["scenarioProfile"];
  reviewReadinessJson: { overallStatus: string; unexplainedProvenance: number };
};

export type BlueprintRootAggregate = {
  id: string;
  requestId: string;
  lifecycleState: BlueprintRootLifecycleState;
  clientVisibility: BlueprintClientVisibilityState;
  currentVersionNumber: number | null;
  platformFinalizedVersionNumber: number | null;
  sharedWithClientVersionNumber: number | null;
  rowVersion: number;
};

export type BlueprintVersionRecord = {
  id: string;
  blueprintId: string;
  versionNumber: number;
  snapshot: PersistentBlueprintVersionSnapshot;
  createdByPlatformAccountId: string;
  createdAt: string;
  supersededAt: string | null;
  immutable: true;
};

export type BlueprintReviewCycleRecord = {
  id: string;
  blueprintId: string;
  blueprintVersionId: string;
  versionNumber: number;
  cycleNumber: number;
  audience: BlueprintReviewAudience;
  state: BlueprintReviewCycleState;
  openedAt: string;
  closedAt: string | null;
  supersededByCycleId: string | null;
};

export type BlueprintReviewActionRecord = {
  id: string;
  reviewCycleId: string;
  blueprintVersionId: string;
  actorPlatformAccountId: string;
  actorClass: BlueprintActorClass;
  action: BlueprintReviewActionType;
  reason: string | null;
  contentHashAtAction: string;
  createdAt: string;
};

export type BlueprintAuditEventRecord = {
  id: string;
  blueprintId: string;
  blueprintVersionId: string | null;
  eventType: string;
  actorClass: BlueprintActorClass;
  actorPlatformAccountId: string | null;
  payload: {
    versionNumber?: number;
    contentHashPrefix?: string;
    fromState?: string;
    toState?: string;
    reviewCycleNumber?: number;
    reasonCode?: string;
  };
  createdAt: string;
};
