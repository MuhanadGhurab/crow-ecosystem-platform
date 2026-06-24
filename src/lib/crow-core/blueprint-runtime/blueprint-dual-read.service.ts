import type { BlueprintVersionStatus, EnterpriseBlueprintVersion } from "@prisma/client";

import type { ApprovalStatus } from "../common";
import type { TenantScope } from "../blueprint-persistence/tenant-scope";
import { listVersionsForBlueprint } from "../blueprint-persistence/blueprint-version.repository";
import { listTraceEventsForBlueprint } from "../blueprint-persistence/blueprint-trace.repository";
import type { BlueprintVersionSnapshot, EnterpriseBlueprintDocument } from "../blueprint";
import {
  TRACEABILITY_CHAIN_STAGES,
  type BlueprintTraceEvent,
  type BlueprintTraceTimeline,
  type TraceabilityChainStage,
} from "../traceability";
import { validateSnapshotEnvelope } from "./snapshot-validation";

export type PersistenceReadMode = "c2_version" | "legacy_unversioned";

function mapVersionStatus(status: BlueprintVersionStatus): ApprovalStatus {
  switch (status) {
    case "APPROVED":
    case "CONFIGURATION_PROPOSED":
      return "approved";
    case "INTERNAL_REVIEW":
    case "CLIENT_REVIEW":
    case "APPROVAL_PENDING":
      return "pending_review";
    case "CHANGES_REQUESTED":
      return "rejected";
    case "SUPERSEDED":
      return "superseded";
    default:
      return "draft";
  }
}

export function mapPersistedVersionToSnapshot(
  row: EnterpriseBlueprintVersion,
  fallbackDocument: EnterpriseBlueprintDocument
): BlueprintVersionSnapshot {
  const envelope = validateSnapshotEnvelope(row.contentSnapshot);
  const baseDocument =
    envelope.ok && envelope.value.document
      ? envelope.value.document
      : fallbackDocument;

  const approvalStatus = mapVersionStatus(row.status);
  const versionLabel = String(row.versionNumber);
  const ref = {
    ...baseDocument.ref,
    blueprintId: row.blueprintId,
    version: versionLabel,
    tenantId: row.tenantId ?? "",
    status: approvalStatus,
    createdAtIso: row.createdAt.toISOString(),
    approvedAtIso: row.approvedAt?.toISOString() ?? null,
  };

  const document: EnterpriseBlueprintDocument = {
    ...baseDocument,
    ref,
  };

  return {
    id: row.id,
    blueprintId: row.blueprintId,
    ref,
    contentHash: row.contentHash,
    parentVersionId: row.parentVersionId ?? undefined,
    document,
  };
}

export async function loadPersistedBlueprintVersions(
  scope: TenantScope,
  blueprintId: string,
  fallbackDocument: EnterpriseBlueprintDocument
): Promise<{ mode: PersistenceReadMode; versions: BlueprintVersionSnapshot[] }> {
  const rows = await listVersionsForBlueprint(scope, blueprintId);
  if (rows.length === 0) {
    return { mode: "legacy_unversioned", versions: [] };
  }
  return {
    mode: "c2_version",
    versions: rows.map((row) => mapPersistedVersionToSnapshot(row, fallbackDocument)),
  };
}

const ACTION_TO_STAGE: Record<string, TraceabilityChainStage> = {
  "draft.created": "blueprint_version",
  "draft.saved": "blueprint_version",
  "lifecycle.transition": "blueprint_version",
  "version.approved": "approval",
};

export function mapPersistedTraceToTimeline(
  blueprintId: string,
  events: Awaited<ReturnType<typeof listTraceEventsForBlueprint>>
): BlueprintTraceTimeline {
  const mapped: BlueprintTraceEvent[] = events.map((e) => ({
    id: e.id,
    blueprintId: e.blueprintId,
    versionId: e.blueprintVersionId ?? undefined,
    stage: ACTION_TO_STAGE[e.action] ?? "blueprint_version",
    actor: {
      actorType:
        e.actorType === "HUMAN"
          ? "human_user"
          : e.actorType === "AI_ASSISTANT"
            ? "ai_assistant"
            : "system_process",
      actorId: e.actorId ?? e.actorType,
      displayName: e.actorId ?? e.actorType,
      isNonHuman: e.actorType !== "HUMAN",
    },
    summary: e.reason ?? e.action,
    timestamp: e.createdAt.toISOString(),
    aiAssisted: e.aiInvolved,
    payload: (e.metadata as Record<string, unknown> | null) ?? undefined,
  }));

  const stagesPresent = [
    ...new Set(mapped.map((ev) => ev.stage)),
  ] as TraceabilityChainStage[];
  const missingStages = (TRACEABILITY_CHAIN_STAGES as readonly TraceabilityChainStage[]).filter(
    (stage) => !stagesPresent.includes(stage)
  );

  return {
    blueprintId,
    events: mapped.sort((a, b) => a.timestamp.localeCompare(b.timestamp)),
    stagesPresent,
    missingStages,
    chainComplete: missingStages.length === 0,
  };
}
