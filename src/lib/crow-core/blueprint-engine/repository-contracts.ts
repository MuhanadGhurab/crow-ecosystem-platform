import type {
  BlueprintAuditEventRecord,
  BlueprintReviewActionRecord,
  BlueprintReviewCycleRecord,
  BlueprintRootAggregate,
  BlueprintVersionRecord,
  PersistentBlueprintVersionSnapshot,
} from "./types";

export interface BlueprintRepository {
  findByRequestId(requestId: string): Promise<BlueprintRootAggregate | null>;
  findById(blueprintId: string): Promise<BlueprintRootAggregate | null>;
  createRoot(input: { requestId: string; createdByPlatformAccountId: string }): Promise<BlueprintRootAggregate>;
  transitionLifecycle(
    blueprintId: string,
    expectedRowVersion: number,
    patch: Partial<Pick<BlueprintRootAggregate, "lifecycleState" | "clientVisibility" | "currentVersionNumber" | "sharedWithClientVersionNumber" | "platformFinalizedVersionNumber">>,
  ): Promise<BlueprintRootAggregate>;
}

export interface BlueprintVersionRepository {
  createImmutableVersion(input: {
    blueprintId: string;
    versionNumber: number;
    snapshot: PersistentBlueprintVersionSnapshot;
    createdByPlatformAccountId: string;
  }): Promise<BlueprintVersionRecord>;
  getVersion(blueprintId: string, versionNumber: number): Promise<BlueprintVersionRecord | null>;
  getCurrentVersion(blueprintId: string): Promise<BlueprintVersionRecord | null>;
  listVersions(blueprintId: string): Promise<BlueprintVersionRecord[]>;
  updateVersionUnsupported(): never;
  deleteVersionUnsupported(): never;
}

export interface BlueprintReviewRepository {
  openReviewCycle(input: {
    blueprintId: string;
    blueprintVersionId: string;
    versionNumber: number;
    cycleNumber: number;
    audience: BlueprintReviewCycleRecord["audience"];
  }): Promise<BlueprintReviewCycleRecord>;
  getOpenCycle(blueprintId: string, versionNumber: number): Promise<BlueprintReviewCycleRecord | null>;
  closeCycle(cycleId: string, state: BlueprintReviewCycleRecord["state"]): Promise<BlueprintReviewCycleRecord>;
  recordAction(input: Omit<BlueprintReviewActionRecord, "id" | "createdAt">): Promise<BlueprintReviewActionRecord>;
}

export interface BlueprintAuditRepository {
  append(event: Omit<BlueprintAuditEventRecord, "id" | "createdAt">): Promise<BlueprintAuditEventRecord>;
  listByBlueprint(blueprintId: string): Promise<BlueprintAuditEventRecord[]>;
}
