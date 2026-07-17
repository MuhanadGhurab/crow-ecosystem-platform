import type {
  BlueprintClientVisibilityState,
  BlueprintRootLifecycleState,
  BlueprintReviewCycleRecord,
  BlueprintReviewCycleState,
  BlueprintRootAggregate,
  BlueprintVersionRecord,
  PersistentBlueprintVersionSnapshot,
} from "../types";
import type {
  BlueprintClientVisibilityState as PrismaVisibility,
  BlueprintRootLifecycleState as PrismaLifecycle,
  BlueprintReviewCycleState as PrismaCycleState,
  EnterpriseBlueprint,
  EnterpriseBlueprintVersion,
  BlueprintReviewCycle,
} from "@prisma/client";

export function mapLifecycle(state: PrismaLifecycle): BlueprintRootLifecycleState {
  return state as BlueprintRootLifecycleState;
}

export function mapVisibility(state: PrismaVisibility): BlueprintClientVisibilityState {
  return state as BlueprintClientVisibilityState;
}

export function mapCycleState(state: PrismaCycleState): BlueprintReviewCycleState {
  return state as BlueprintReviewCycleState;
}

export function mapRoot(row: EnterpriseBlueprint): BlueprintRootAggregate {
  return {
    id: row.id,
    requestId: row.requestId,
    lifecycleState: mapLifecycle(row.lifecycleState),
    clientVisibility: mapVisibility(row.clientVisibilityState),
    currentVersionNumber: null,
    platformFinalizedVersionNumber: null,
    sharedWithClientVersionNumber: row.sharedWithClientVersionNumber,
    rowVersion: row.rowVersion,
  };
}

export function mapRootWithVersions(
  row: EnterpriseBlueprint & {
    currentVersion?: Pick<EnterpriseBlueprintVersion, "versionNumber"> | null;
    platformFinalizedVersion?: Pick<EnterpriseBlueprintVersion, "versionNumber"> | null;
  },
): BlueprintRootAggregate {
  const base = mapRoot(row);
  return {
    ...base,
    currentVersionNumber: row.currentVersion?.versionNumber ?? null,
    platformFinalizedVersionNumber: row.platformFinalizedVersion?.versionNumber ?? null,
  };
}

export function mapVersion(row: EnterpriseBlueprintVersion): BlueprintVersionRecord {
  const snapshot: PersistentBlueprintVersionSnapshot = {
    schemaVersion: row.schemaVersion,
    compilerVersion: row.compilerVersion ?? "",
    sourceModelKey: row.sourceModelKey ?? "",
    sourceModelHash: row.sourceModelHash ?? "",
    contentHash: row.contentHash,
    contentJson: row.contentSnapshot as unknown as PersistentBlueprintVersionSnapshot["contentJson"],
    validationJson: (row.validationJson ?? row.contentSnapshot) as unknown as PersistentBlueprintVersionSnapshot["validationJson"],
    decisionRegisterJson: (row.decisionRegisterJson ?? []) as unknown as PersistentBlueprintVersionSnapshot["decisionRegisterJson"],
    provenanceSummaryJson: (row.provenanceJson ?? {}) as unknown as PersistentBlueprintVersionSnapshot["provenanceSummaryJson"],
    scenarioProfileJson: (row.scenarioProfileJson ?? {}) as unknown as PersistentBlueprintVersionSnapshot["scenarioProfileJson"],
    reviewReadinessJson: (row.reviewReadinessJson ?? {
      overallStatus: "UNKNOWN",
      unexplainedProvenance: 0,
    }) as PersistentBlueprintVersionSnapshot["reviewReadinessJson"],
  };
  return {
    id: row.id,
    blueprintId: row.blueprintId,
    versionNumber: row.versionNumber,
    snapshot,
    createdByPlatformAccountId: row.createdByPlatformAccountId ?? "",
    createdAt: row.createdAt.toISOString(),
    supersededAt: null,
    immutable: true,
  };
}

export function mapReviewCycle(row: BlueprintReviewCycle): BlueprintReviewCycleRecord {
  return {
    id: row.id,
    blueprintId: row.blueprintId,
    blueprintVersionId: row.blueprintVersionId,
    versionNumber: row.versionNumber,
    cycleNumber: row.cycleNumber,
    audience: row.audience,
    state: mapCycleState(row.state),
    openedAt: row.openedAt.toISOString(),
    closedAt: row.closedAt?.toISOString() ?? null,
    supersededByCycleId: row.supersededByCycleId,
  };
}

export function snapshotToVersionCreateData(input: {
  blueprintId: string;
  versionNumber: number;
  snapshot: PersistentBlueprintVersionSnapshot;
  createdByPlatformAccountId: string;
  tenantId?: string | null;
}) {
  const { snapshot } = input;
  return {
    blueprintId: input.blueprintId,
    versionNumber: input.versionNumber,
    tenantId: input.tenantId ?? null,
    contentSnapshot: snapshot.contentJson as object,
    contentHash: snapshot.contentHash,
    schemaVersion: snapshot.schemaVersion,
    compilerVersion: snapshot.compilerVersion,
    sourceModelKey: snapshot.sourceModelKey,
    sourceModelHash: snapshot.sourceModelHash,
    validationJson: snapshot.validationJson as object,
    decisionRegisterJson: snapshot.decisionRegisterJson as object,
    provenanceJson: snapshot.provenanceSummaryJson as object,
    scenarioProfileJson: snapshot.scenarioProfileJson as object,
    reviewReadinessJson: snapshot.reviewReadinessJson as object,
    createdByPlatformAccountId: input.createdByPlatformAccountId,
    provenance: "STUDIO_CAPTURE" as const,
    status: "BLUEPRINT_DRAFT" as const,
  };
}
