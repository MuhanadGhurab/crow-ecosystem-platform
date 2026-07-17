import type {
  BlueprintVersionSnapshot,
  EnterpriseBlueprintDocument,
} from "../blueprint";
import { hashBlueprintDocument } from "./blueprint-hash.service";

const versionStore = new Map<string, BlueprintVersionSnapshot[]>();

export function clearBlueprintVersionStore(): void {
  versionStore.clear();
}

export function listBlueprintVersions(blueprintId: string): BlueprintVersionSnapshot[] {
  return [...(versionStore.get(blueprintId) ?? [])];
}

export function getBlueprintVersion(versionId: string): BlueprintVersionSnapshot | null {
  for (const versions of versionStore.values()) {
    const found = versions.find((v) => v.id === versionId);
    if (found) return found;
  }
  return null;
}

export function createBlueprintVersionSnapshot(
  document: EnterpriseBlueprintDocument,
  options?: { parentVersionId?: string; versionId?: string }
): BlueprintVersionSnapshot {
  const blueprintId = document.ref.blueprintId;
  const id =
    options?.versionId ??
    `bvs-${blueprintId}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const contentHash = hashBlueprintDocument(document);

  const snapshot: BlueprintVersionSnapshot = {
    id,
    blueprintId,
    ref: document.ref,
    contentHash,
    parentVersionId: options?.parentVersionId,
    document,
  };

  const existing = versionStore.get(blueprintId) ?? [];
  versionStore.set(blueprintId, [...existing, snapshot]);
  return snapshot;
}

export function approveBlueprintVersionSnapshot(
  versionId: string
): BlueprintVersionSnapshot {
  const snapshot = getBlueprintVersion(versionId);
  if (!snapshot) throw new Error(`Blueprint version not found: ${versionId}`);

  assertVersionMutable(snapshot);

  const approvedAtIso = new Date().toISOString();
  const approved: BlueprintVersionSnapshot = {
    ...snapshot,
    ref: {
      ...snapshot.ref,
      status: "approved",
      approvedAtIso,
    },
    document: {
      ...snapshot.document,
      ref: {
        ...snapshot.document.ref,
        status: "approved",
        approvedAtIso,
      },
    },
    contentHash: hashBlueprintDocument({
      ...snapshot.document,
      ref: {
        ...snapshot.document.ref,
        status: "approved",
        approvedAtIso,
      },
    }),
  };

  const versions = versionStore.get(snapshot.blueprintId) ?? [];
  versionStore.set(
    snapshot.blueprintId,
    versions.map((v) => (v.id === versionId ? approved : v))
  );
  return approved;
}

export function assertVersionMutable(snapshot: BlueprintVersionSnapshot): void {
  if (snapshot.ref.status === "approved") {
    throw new Error("Cannot mutate an approved blueprint version snapshot");
  }
}

/** Aliases for C1 studio / verifier naming. */
export const getBlueprintVersionSnapshot = getBlueprintVersion;
export const listBlueprintVersionSnapshots = listBlueprintVersions;
export const resetBlueprintVersionStore = clearBlueprintVersionStore;
