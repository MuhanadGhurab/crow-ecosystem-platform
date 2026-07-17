import type {
  BlueprintAuditEventRecord,
  BlueprintReviewActionRecord,
  BlueprintReviewCycleRecord,
  BlueprintRootAggregate,
  BlueprintVersionRecord,
} from "./types";
import type {
  BlueprintAuditRepository,
  BlueprintRepository,
  BlueprintReviewRepository,
  BlueprintVersionRepository,
} from "./repository-contracts";
import { BlueprintEngineError } from "./errors";

export function createMemoryBlueprintStores() {
  const roots = new Map<string, BlueprintRootAggregate>();
  const versions = new Map<string, BlueprintVersionRecord[]>();
  const cycles = new Map<string, BlueprintReviewCycleRecord[]>();
  const actions: BlueprintReviewActionRecord[] = [];
  const audits: BlueprintAuditEventRecord[] = [];

  const blueprintRepo: BlueprintRepository = {
    async findByRequestId(requestId) {
      return [...roots.values()].find((r) => r.requestId === requestId) ?? null;
    },
    async findById(blueprintId) {
      return roots.get(blueprintId) ?? null;
    },
    async createRoot(input) {
      const root: BlueprintRootAggregate = {
        id: `bp_${input.requestId}`,
        requestId: input.requestId,
        lifecycleState: "DRAFT_INTERNAL",
        clientVisibility: "NOT_SHARED",
        currentVersionNumber: null,
        platformFinalizedVersionNumber: null,
        sharedWithClientVersionNumber: null,
        rowVersion: 1,
      };
      roots.set(root.id, root);
      return root;
    },
    async transitionLifecycle(blueprintId, expectedRowVersion, patch) {
      const root = roots.get(blueprintId);
      if (!root) throw new BlueprintEngineError("BLUEPRINT_NOT_FOUND", "Blueprint not found");
      if (root.rowVersion !== expectedRowVersion) {
        throw new BlueprintEngineError("BLUEPRINT_CONCURRENCY_CONFLICT", "Concurrency conflict");
      }
      const next = { ...root, ...patch, rowVersion: root.rowVersion + 1 };
      roots.set(blueprintId, next);
      return next;
    },
  };

  const versionRepo: BlueprintVersionRepository = {
    async createImmutableVersion(input) {
      const list = versions.get(input.blueprintId) ?? [];
      if (list.some((v) => v.versionNumber === input.versionNumber)) {
        throw new BlueprintEngineError("BLUEPRINT_DUPLICATE_VERSION_NUMBER", "Duplicate version number");
      }
      const record: BlueprintVersionRecord = {
        id: `ver_${input.blueprintId}_${input.versionNumber}`,
        blueprintId: input.blueprintId,
        versionNumber: input.versionNumber,
        snapshot: input.snapshot,
        createdByPlatformAccountId: input.createdByPlatformAccountId,
        createdAt: new Date().toISOString(),
        supersededAt: null,
        immutable: true,
      };
      versions.set(input.blueprintId, [...list, record]);
      return record;
    },
    async getVersion(blueprintId, versionNumber) {
      return (versions.get(blueprintId) ?? []).find((v) => v.versionNumber === versionNumber) ?? null;
    },
    async getCurrentVersion(blueprintId) {
      const list = versions.get(blueprintId) ?? [];
      if (list.length === 0) return null;
      return list.reduce((a, b) => (a.versionNumber > b.versionNumber ? a : b));
    },
    async listVersions(blueprintId) {
      return [...(versions.get(blueprintId) ?? [])].sort((a, b) => a.versionNumber - b.versionNumber);
    },
    updateVersionUnsupported() {
      throw new BlueprintEngineError("BLUEPRINT_VERSION_IMMUTABLE", "Version update not supported");
    },
    deleteVersionUnsupported() {
      throw new BlueprintEngineError("BLUEPRINT_VERSION_IMMUTABLE", "Version delete not supported");
    },
  };

  const reviewRepo: BlueprintReviewRepository = {
    async openReviewCycle(input) {
      const cycle: BlueprintReviewCycleRecord = {
        id: `cycle_${input.blueprintId}_${input.cycleNumber}`,
        blueprintId: input.blueprintId,
        blueprintVersionId: input.blueprintVersionId,
        versionNumber: input.versionNumber,
        cycleNumber: input.cycleNumber,
        audience: input.audience,
        state: "OPEN",
        openedAt: new Date().toISOString(),
        closedAt: null,
        supersededByCycleId: null,
      };
      const list = cycles.get(input.blueprintId) ?? [];
      cycles.set(input.blueprintId, [...list, cycle]);
      return cycle;
    },
    async getOpenCycle(blueprintId, versionNumber) {
      return (
        (cycles.get(blueprintId) ?? []).find((c) => c.versionNumber === versionNumber && c.state === "OPEN") ?? null
      );
    },
    async closeCycle(cycleId, state) {
      for (const [bpId, list] of cycles) {
        const idx = list.findIndex((c) => c.id === cycleId);
        if (idx >= 0) {
          const updated = { ...list[idx]!, state, closedAt: new Date().toISOString() };
          const next = [...list];
          next[idx] = updated;
          cycles.set(bpId, next);
          return updated;
        }
      }
      throw new BlueprintEngineError("BLUEPRINT_NOT_FOUND", "Review cycle not found");
    },
    async recordAction(input) {
      const record: BlueprintReviewActionRecord = {
        ...input,
        id: `action_${actions.length}`,
        createdAt: new Date().toISOString(),
      };
      actions.push(record);
      return record;
    },
  };

  const auditRepo: BlueprintAuditRepository = {
    async append(event) {
      const record: BlueprintAuditEventRecord = {
        ...event,
        id: `audit_${audits.length}`,
        createdAt: new Date().toISOString(),
      };
      audits.push(record);
      return record;
    },
    async listByBlueprint(blueprintId) {
      return audits.filter((a) => a.blueprintId === blueprintId);
    },
  };

  return { blueprintRepo, versionRepo, reviewRepo, auditRepo, roots, versions, cycles, actions, audits };
}
