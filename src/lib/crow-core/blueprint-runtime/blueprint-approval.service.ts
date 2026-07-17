import type { BlueprintApprovalDecision } from "@prisma/client";

import { approveBlueprintVersion } from "../blueprint-persistence/blueprint-approval.repository";
import { appendBlueprintTraceEvent } from "../blueprint-persistence/blueprint-trace.repository";
import type { TenantScope } from "../blueprint-persistence/tenant-scope";
import { BlueprintConcurrencyError, BlueprintValidationError } from "./blueprint-errors";

export async function approveBlueprintVersionWithTrace(params: {
  scope: TenantScope;
  versionId: string;
  expectedRevision: number;
  expectedHash: string;
  approverUserId: string;
  approverRole: string;
  decision?: BlueprintApprovalDecision;
  rationale: string;
  policyReference?: string | null;
  aiAssistanceDisclosed?: boolean;
}) {
  const result = await approveBlueprintVersion({
    scope: params.scope,
    versionId: params.versionId,
    expectedRevision: params.expectedRevision,
    expectedHash: params.expectedHash,
    approverUserId: params.approverUserId,
    approverRole: params.approverRole,
    decision: params.decision ?? "APPROVED",
    rationale: params.rationale,
    policyReference: params.policyReference,
    aiAssistanceDisclosed: params.aiAssistanceDisclosed,
  });

  if (!result.ok) {
    if (result.reason === "revision_mismatch" || result.reason === "hash_mismatch") {
      throw new BlueprintConcurrencyError({
        message: "Approval blocked: version changed since last load.",
        expectedRevision: params.expectedRevision,
        currentRevision: result.currentRevision ?? params.expectedRevision,
        currentHash: result.currentHash ?? params.expectedHash,
      });
    }
    throw new BlueprintValidationError(`Approval rejected: ${result.reason}`);
  }

  await appendBlueprintTraceEvent({
    tenantId: result.version.tenantId,
    blueprintId: result.version.blueprintId,
    blueprintVersionId: result.version.id,
    resourceType: "blueprint_approval",
    resourceId: result.approval.id,
    actorType: "HUMAN",
    actorId: params.approverUserId,
    action: "version.approved",
    previousState: "APPROVAL_PENDING",
    newState: "APPROVED",
    metadata: { contentHash: result.version.contentHash },
  });

  return result;
}
