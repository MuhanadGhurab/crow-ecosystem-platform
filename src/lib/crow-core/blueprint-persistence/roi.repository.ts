import type { Prisma, RoiAssumptionApprovalState } from "@prisma/client";

import { prisma, prismaTransaction } from "@/lib/db";

import { type TenantScope, assertTenantMatch } from "./tenant-scope";

export async function listAssumptionsForBlueprint(
  scope: TenantScope,
  blueprintId: string
) {
  const tenantFilter = scope.isPlatformStaff ? {} : { tenantId: scope.tenantId! };
  return prisma.roiAssumption.findMany({
    where: { blueprintId, ...tenantFilter },
    include: {
      revisions: { orderBy: { revisionNumber: "desc" }, take: 1 },
    },
  });
}

export async function createAssumptionRevision(params: {
  scope: TenantScope;
  assumptionId: string;
  value: number;
  unit: string;
  currency?: string;
  frequency?: string | null;
  annualizedValue?: number | null;
  source?: string | null;
  sourceType?: Prisma.RoiAssumptionRevisionCreateInput["sourceType"];
  confidence?: string | null;
  ownerUserId?: string | null;
  scenarioTags?: string[];
}) {
  return prismaTransaction(async (tx) => {
    const assumption = await tx.roiAssumption.findUnique({
      where: { id: params.assumptionId },
    });
    if (!assumption) throw new Error("ROI assumption not found");
    assertTenantMatch(params.scope, assumption.tenantId, "createAssumptionRevision");

    const latest = await tx.roiAssumptionRevision.findFirst({
      where: { assumptionId: params.assumptionId },
      orderBy: { revisionNumber: "desc" },
    });
    const revisionNumber = (latest?.revisionNumber ?? 0) + 1;

    return tx.roiAssumptionRevision.create({
      data: {
        tenantId: assumption.tenantId,
        assumptionId: params.assumptionId,
        revisionNumber,
        value: params.value,
        unit: params.unit,
        currency: params.currency ?? "SAR",
        frequency: params.frequency ?? null,
        annualizedValue: params.annualizedValue ?? null,
        source: params.source ?? null,
        sourceType: params.sourceType ?? "OPERATOR_ESTIMATE",
        confidence: params.confidence ?? null,
        ownerUserId: params.ownerUserId ?? null,
        approvalState: "DRAFT",
        scenarioTags: params.scenarioTags ?? [],
      },
    });
  });
}

export async function approveAssumptionRevision(params: {
  scope: TenantScope;
  revisionId: string;
  approvalState: RoiAssumptionApprovalState;
}) {
  const revision = await prisma.roiAssumptionRevision.findUnique({
    where: { id: params.revisionId },
  });
  if (!revision) throw new Error("Revision not found");
  assertTenantMatch(params.scope, revision.tenantId, "approveAssumptionRevision");

  return prisma.roiAssumptionRevision.update({
    where: { id: params.revisionId },
    data: {
      approvalState: params.approvalState,
      reviewedAt: new Date(),
    },
  });
}

export async function persistRoiSnapshot(params: {
  tenantId: string;
  blueprintVersionId: string;
  assumptionRevisionIds: string[];
  engineName: string;
  engineVersion: string;
  formulaVersion: string;
  scenarioInputs: Prisma.InputJsonValue;
  results: Prisma.InputJsonValue;
  warnings?: Prisma.InputJsonValue;
  unsupportedInputs?: Prisma.InputJsonValue;
  currency?: string;
  contentHash: string;
}) {
  return prisma.roiSnapshot.create({
    data: {
      tenantId: params.tenantId,
      blueprintVersionId: params.blueprintVersionId,
      assumptionRevisionIds: params.assumptionRevisionIds,
      engineName: params.engineName,
      engineVersion: params.engineVersion,
      formulaVersion: params.formulaVersion,
      scenarioInputs: params.scenarioInputs,
      results: params.results,
      warnings: params.warnings ?? undefined,
      unsupportedInputs: params.unsupportedInputs ?? undefined,
      currency: params.currency ?? "SAR",
      advisoryLabel: "advisory_only",
      contentHash: params.contentHash,
    },
  });
}

export async function listSnapshotsForVersion(
  scope: TenantScope,
  blueprintVersionId: string
) {
  const tenantFilter = scope.isPlatformStaff ? {} : { tenantId: scope.tenantId! };
  return prisma.roiSnapshot.findMany({
    where: { blueprintVersionId, ...tenantFilter },
    orderBy: { createdAt: "desc" },
  });
}
