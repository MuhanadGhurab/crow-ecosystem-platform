import type { BlueprintApprovalDecision, Prisma } from "@prisma/client";

import { prisma, prismaTransaction } from "@/lib/db";

import { type TenantScope, assertTenantMatch } from "./tenant-scope";
import { getVersionById } from "./blueprint-version.repository";

export type ApproveVersionInput = {
  scope: TenantScope;
  versionId: string;
  expectedRevision: number;
  expectedHash: string;
  approverUserId: string;
  approverRole: string;
  decision: BlueprintApprovalDecision;
  rationale: string;
  policyReference?: string | null;
  evidenceRefs?: Prisma.InputJsonValue;
  aiAssistanceDisclosed?: boolean;
};

export async function approveBlueprintVersion(input: ApproveVersionInput) {
  return prismaTransaction(async (tx) => {
    const version = await tx.enterpriseBlueprintVersion.findUnique({
      where: { id: input.versionId },
    });
    if (!version) throw new Error("Version not found");
    assertTenantMatch(input.scope, version.tenantId, "approveBlueprintVersion");

    if (version.revision !== input.expectedRevision) {
      return {
        ok: false as const,
        reason: "revision_mismatch" as const,
        currentRevision: version.revision,
        currentHash: version.contentHash,
      };
    }

    if (version.contentHash !== input.expectedHash) {
      return {
        ok: false as const,
        reason: "hash_mismatch" as const,
        currentRevision: version.revision,
        currentHash: version.contentHash,
      };
    }

    if (version.status !== "APPROVAL_PENDING" && version.status !== "INTERNAL_REVIEW") {
      return { ok: false as const, reason: "invalid_status" as const };
    }

    await tx.enterpriseBlueprintVersion.updateMany({
      where: {
        blueprintId: version.blueprintId,
        isCurrentApproved: true,
      },
      data: {
        isCurrentApproved: false,
        status: "SUPERSEDED",
        supersededAt: new Date(),
      },
    });

    const approved = await tx.enterpriseBlueprintVersion.update({
      where: { id: version.id },
      data: {
        status: "APPROVED",
        isActiveDraft: false,
        isCurrentApproved: true,
        approvedAt: new Date(),
      },
    });

    const approval = await tx.blueprintApproval.create({
      data: {
        tenantId: version.tenantId,
        blueprintId: version.blueprintId,
        blueprintVersionId: version.id,
        contentHash: version.contentHash,
        approverUserId: input.approverUserId,
        approverRole: input.approverRole,
        decision: input.decision,
        rationale: input.rationale,
        policyReference: input.policyReference ?? null,
        evidenceRefs: input.evidenceRefs ?? undefined,
        aiAssistanceDisclosed: input.aiAssistanceDisclosed ?? false,
      },
    });

    await tx.enterpriseBlueprint.update({
      where: { id: version.blueprintId },
      data: {
        currentApprovedVersionId: version.id,
        activeDraftVersionId: null,
        status: "APPROVED",
      },
    });

    return { ok: true as const, version: approved, approval };
  });
}

export async function listApprovalsForBlueprint(
  scope: TenantScope,
  blueprintId: string
) {
  const tenantFilter = scope.isPlatformStaff ? {} : { tenantId: scope.tenantId! };
  return prisma.blueprintApproval.findMany({
    where: { blueprintId, ...tenantFilter },
    orderBy: { createdAt: "desc" },
  });
}

export async function getApprovalForVersion(scope: TenantScope, versionId: string) {
  const version = await getVersionById(scope, versionId);
  if (!version) return null;
  return prisma.blueprintApproval.findFirst({
    where: { blueprintVersionId: versionId },
  });
}
