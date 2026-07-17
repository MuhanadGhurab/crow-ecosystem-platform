import type { EnterpriseBlueprintDocument } from "../blueprint";
import {
  createBlueprintVersion,
  createNextVersionFromParent,
  getActiveDraftForBlueprint,
  getVersionById,
  listVersionsForBlueprint,
  saveDraftVersion,
  transitionVersionStatus,
} from "../blueprint-persistence/blueprint-version.repository";
import { appendBlueprintTraceEvent } from "../blueprint-persistence/blueprint-trace.repository";
import { type TenantScope } from "../blueprint-persistence/tenant-scope";
import { BlueprintConcurrencyError, BlueprintValidationError } from "./blueprint-errors";
import { canTransition, isEditableStatus } from "./lifecycle-transitions";
import { hashBlueprintSnapshotDocument } from "./snapshot-hash";
import {
  buildSnapshotEnvelope,
  validateSnapshotEnvelope,
} from "./snapshot-validation";

export async function ensureInitialDraftVersion(params: {
  scope: TenantScope;
  blueprintId: string;
  tenantId: string;
  document: EnterpriseBlueprintDocument;
  authorUserId?: string | null;
}) {
  const existing = await getActiveDraftForBlueprint(params.scope, params.blueprintId);
  if (existing) return existing;

  const versions = await listVersionsForBlueprint(params.scope, params.blueprintId);
  const envelope = buildSnapshotEnvelope(params.document);
  const validation = validateSnapshotEnvelope(envelope);
  if (!validation.ok) {
    throw new BlueprintValidationError(
      validation.errors.map((e) => `${e.path}: ${e.message}`).join("; ")
    );
  }

  const contentHash = hashBlueprintSnapshotDocument(params.document);
  const version = await createBlueprintVersion({
    blueprintId: params.blueprintId,
    tenantId: params.tenantId,
    versionNumber: versions.length > 0 ? Math.max(...versions.map((v) => v.versionNumber)) + 1 : 1,
    parentVersionId: versions[0]?.id ?? null,
    status: "BLUEPRINT_DRAFT",
    contentSnapshot: envelope,
    contentHash,
    schemaVersion: envelope.schemaVersion,
    revision: 1,
    provenance: "STUDIO_CAPTURE",
    authorUserId: params.authorUserId,
    isActiveDraft: true,
  });

  await appendBlueprintTraceEvent({
    tenantId: params.tenantId,
    blueprintId: params.blueprintId,
    blueprintVersionId: version.id,
    resourceType: "blueprint_version",
    resourceId: version.id,
    actorType: params.authorUserId ? "HUMAN" : "SYSTEM_PROCESS",
    actorId: params.authorUserId ?? "blueprint-runtime",
    action: "draft.created",
    newState: version.status,
  });

  return version;
}

export async function saveBlueprintDraft(params: {
  scope: TenantScope;
  versionId: string;
  expectedRevision: number;
  document: EnterpriseBlueprintDocument;
  authorUserId?: string | null;
}) {
  const envelope = buildSnapshotEnvelope(params.document);
  const validation = validateSnapshotEnvelope(envelope);
  if (!validation.ok) {
    throw new BlueprintValidationError(
      validation.errors.map((e) => `${e.path}: ${e.message}`).join("; ")
    );
  }

  const contentHash = hashBlueprintSnapshotDocument(params.document);
  const result = await saveDraftVersion({
    scope: params.scope,
    versionId: params.versionId,
    expectedRevision: params.expectedRevision,
    contentSnapshot: envelope,
    contentHash,
    schemaVersion: envelope.schemaVersion,
  });

  if (result.conflict) {
    throw new BlueprintConcurrencyError({
      message: "Blueprint draft was modified by another session. Reload and retry.",
      expectedRevision: params.expectedRevision,
      currentRevision: result.currentRevision,
      currentHash: result.currentHash,
    });
  }

  if (!isEditableStatus(result.version.status)) {
    throw new BlueprintValidationError("Version is not editable");
  }

  await appendBlueprintTraceEvent({
    tenantId: result.version.tenantId,
    blueprintId: result.version.blueprintId,
    blueprintVersionId: result.version.id,
    resourceType: "blueprint_version",
    resourceId: result.version.id,
    actorType: params.authorUserId ? "HUMAN" : "SYSTEM_PROCESS",
    actorId: params.authorUserId ?? null,
    action: "draft.saved",
    newState: result.version.status,
    metadata: { revision: result.version.revision },
  });

  return result.version;
}

export async function transitionBlueprintVersionStatus(params: {
  scope: TenantScope;
  versionId: string;
  fromStatus: string;
  toStatus: string;
  actorUserId?: string | null;
}) {
  if (!canTransition(params.fromStatus, params.toStatus)) {
    throw new BlueprintValidationError(
      `Invalid transition ${params.fromStatus} → ${params.toStatus}`
    );
  }

  const version = await getVersionById(params.scope, params.versionId);
  if (!version) throw new BlueprintValidationError("Version not found");

  const updated = await transitionVersionStatus({
    scope: params.scope,
    versionId: params.versionId,
    toStatus: params.toStatus as import("@prisma/client").BlueprintVersionStatus,
  });

  await appendBlueprintTraceEvent({
    tenantId: version.tenantId,
    blueprintId: version.blueprintId,
    blueprintVersionId: version.id,
    resourceType: "blueprint_version",
    resourceId: version.id,
    actorType: params.actorUserId ? "HUMAN" : "SYSTEM_PROCESS",
    actorId: params.actorUserId ?? null,
    action: "lifecycle.transition",
    previousState: params.fromStatus,
    newState: params.toStatus,
  });

  return updated;
}

export async function createNextBlueprintVersion(params: {
  scope: TenantScope;
  blueprintId: string;
  parentVersionId: string;
  document: EnterpriseBlueprintDocument;
  authorUserId?: string | null;
}) {
  const envelope = buildSnapshotEnvelope(params.document);
  const validation = validateSnapshotEnvelope(envelope);
  if (!validation.ok) {
    throw new BlueprintValidationError(
      validation.errors.map((e) => `${e.path}: ${e.message}`).join("; ")
    );
  }

  const contentHash = hashBlueprintSnapshotDocument(params.document);
  const result = await createNextVersionFromParent({
    scope: params.scope,
    blueprintId: params.blueprintId,
    parentVersionId: params.parentVersionId,
    document: {
      contentSnapshot: envelope,
      contentHash,
      schemaVersion: envelope.schemaVersion,
    },
    authorUserId: params.authorUserId,
  });

  if (!result.ok) {
    throw new BlueprintValidationError(
      `Cannot create next version: ${result.reason} (draft ${result.draftId})`
    );
  }

  await appendBlueprintTraceEvent({
    tenantId: result.version.tenantId,
    blueprintId: params.blueprintId,
    blueprintVersionId: result.version.id,
    resourceType: "blueprint_version",
    resourceId: result.version.id,
    actorType: params.authorUserId ? "HUMAN" : "SYSTEM_PROCESS",
    actorId: params.authorUserId ?? null,
    action: "version.created_next",
    previousState: params.parentVersionId,
    newState: result.version.status,
    metadata: { versionNumber: result.version.versionNumber },
  });

  return result.version;
}
