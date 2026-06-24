import type { BlueprintVersionProvenance, BlueprintVersionStatus, Prisma } from "@prisma/client";

import { prisma, prismaTransaction } from "@/lib/db";

import { type TenantScope, assertTenantMatch } from "./tenant-scope";

export type CreateVersionInput = {
  blueprintId: string;
  tenantId: string;
  versionNumber: number;
  parentVersionId?: string | null;
  status: BlueprintVersionStatus;
  contentSnapshot: Prisma.InputJsonValue;
  contentHash: string;
  schemaVersion: string;
  revision: number;
  provenance: BlueprintVersionProvenance;
  authorUserId?: string | null;
  isActiveDraft?: boolean;
};

export async function getVersionById(scope: TenantScope, versionId: string) {
  const version = await prisma.enterpriseBlueprintVersion.findUnique({
    where: { id: versionId },
    include: { blueprint: { select: { tenantId: true } } },
  });
  if (!version) return null;
  assertTenantMatch(scope, version.tenantId, "getVersionById");
  return version;
}

export async function getActiveDraftForBlueprint(
  scope: TenantScope,
  blueprintId: string
) {
  const tenantFilter = scope.isPlatformStaff ? {} : { tenantId: scope.tenantId! };
  return prisma.enterpriseBlueprintVersion.findFirst({
    where: {
      blueprintId,
      isActiveDraft: true,
      ...tenantFilter,
    },
  });
}

export async function getCurrentApprovedForBlueprint(
  scope: TenantScope,
  blueprintId: string
) {
  const tenantFilter = scope.isPlatformStaff ? {} : { tenantId: scope.tenantId! };
  return prisma.enterpriseBlueprintVersion.findFirst({
    where: {
      blueprintId,
      isCurrentApproved: true,
      ...tenantFilter,
    },
  });
}

export async function listVersionsForBlueprint(
  scope: TenantScope,
  blueprintId: string
) {
  const tenantFilter = scope.isPlatformStaff ? {} : { tenantId: scope.tenantId! };
  return prisma.enterpriseBlueprintVersion.findMany({
    where: { blueprintId, ...tenantFilter },
    orderBy: { versionNumber: "desc" },
  });
}

export async function createBlueprintVersion(input: CreateVersionInput) {
  return prismaTransaction(async (tx) => {
    if (input.isActiveDraft) {
      await tx.enterpriseBlueprintVersion.updateMany({
        where: { blueprintId: input.blueprintId, isActiveDraft: true },
        data: { isActiveDraft: false },
      });
    }

    const created = await tx.enterpriseBlueprintVersion.create({
      data: {
        blueprintId: input.blueprintId,
        tenantId: input.tenantId,
        versionNumber: input.versionNumber,
        parentVersionId: input.parentVersionId ?? null,
        status: input.status,
        contentSnapshot: input.contentSnapshot,
        contentHash: input.contentHash,
        schemaVersion: input.schemaVersion,
        revision: input.revision,
        provenance: input.provenance,
        authorUserId: input.authorUserId ?? null,
        isActiveDraft: input.isActiveDraft ?? false,
      },
    });

    if (input.isActiveDraft) {
      await tx.enterpriseBlueprint.update({
        where: { id: input.blueprintId },
        data: { activeDraftVersionId: created.id },
      });
    }

    return created;
  });
}

export async function saveDraftVersion(params: {
  scope: TenantScope;
  versionId: string;
  expectedRevision: number;
  contentSnapshot: Prisma.InputJsonValue;
  contentHash: string;
  schemaVersion: string;
}) {
  throw new Error(
    "Blueprint version updates are forbidden — enterprise_blueprint_versions is append-only. Create a new immutable version instead.",
  );
  return prismaTransaction(async (tx) => {
    const current = await tx.enterpriseBlueprintVersion.findUnique({
      where: { id: params.versionId },
    });
    if (!current) throw new Error("Version not found");
    assertTenantMatch(params.scope, current.tenantId, "saveDraftVersion");

    if (current.revision !== params.expectedRevision) {
      return {
        conflict: true as const,
        currentRevision: current.revision,
        currentHash: current.contentHash,
      };
    }

    const updated = await tx.enterpriseBlueprintVersion.update({
      where: { id: params.versionId },
      data: {
        contentSnapshot: params.contentSnapshot,
        contentHash: params.contentHash,
        schemaVersion: params.schemaVersion,
        revision: { increment: 1 },
      },
    });

    return { conflict: false as const, version: updated };
  });
}

export async function transitionVersionStatus(params: {
  scope: TenantScope;
  versionId: string;
  toStatus: BlueprintVersionStatus;
}) {
  const current = await prisma.enterpriseBlueprintVersion.findUnique({
    where: { id: params.versionId },
  });
  if (!current) throw new Error("Version not found");
  assertTenantMatch(params.scope, current.tenantId, "transitionVersionStatus");

  return prisma.enterpriseBlueprintVersion.update({
    where: { id: params.versionId },
    data: { status: params.toStatus },
  });
}

export async function createNextVersionFromParent(params: {
  scope: TenantScope;
  blueprintId: string;
  parentVersionId: string;
  document: {
    contentSnapshot: Prisma.InputJsonValue;
    contentHash: string;
    schemaVersion: string;
  };
  authorUserId?: string | null;
}) {
  return prismaTransaction(async (tx) => {
    const parent = await tx.enterpriseBlueprintVersion.findUnique({
      where: { id: params.parentVersionId },
    });
    if (!parent || parent.blueprintId !== params.blueprintId) {
      throw new Error("Parent version not found");
    }
    assertTenantMatch(params.scope, parent.tenantId, "createNextVersionFromParent");

    const existingDraft = await tx.enterpriseBlueprintVersion.findFirst({
      where: { blueprintId: params.blueprintId, isActiveDraft: true },
    });
    if (existingDraft) {
      return { ok: false as const, reason: "active_draft_exists" as const, draftId: existingDraft.id };
    }

    const max = await tx.enterpriseBlueprintVersion.aggregate({
      where: { blueprintId: params.blueprintId },
      _max: { versionNumber: true },
    });
    const versionNumber = (max._max.versionNumber ?? 0) + 1;

    await tx.enterpriseBlueprintVersion.updateMany({
      where: { blueprintId: params.blueprintId, isActiveDraft: true },
      data: { isActiveDraft: false },
    });

    const created = await tx.enterpriseBlueprintVersion.create({
      data: {
        blueprintId: params.blueprintId,
        tenantId: parent.tenantId,
        versionNumber,
        parentVersionId: parent.id,
        status: "BLUEPRINT_DRAFT",
        contentSnapshot: params.document.contentSnapshot,
        contentHash: params.document.contentHash,
        schemaVersion: params.document.schemaVersion,
        revision: 1,
        provenance: "STUDIO_CAPTURE",
        authorUserId: params.authorUserId ?? null,
        isActiveDraft: true,
      },
    });

    await tx.enterpriseBlueprint.update({
      where: { id: params.blueprintId },
      data: { activeDraftVersionId: created.id },
    });

    return { ok: true as const, version: created };
  });
}
