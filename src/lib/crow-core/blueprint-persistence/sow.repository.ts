import type { Prisma, SowSectionProvenance, SowVersionStatus } from "@prisma/client";

import { prisma, prismaTransaction } from "@/lib/db";

import { type TenantScope, assertTenantMatch } from "./tenant-scope";

export type SowSectionInput = {
  sectionKey: string;
  orderIndex: number;
  title: string;
  provenance: SowSectionProvenance;
  generatedContent?: string | null;
  manualContent?: string | null;
  sourceRefs?: Prisma.InputJsonValue;
  manuallyEdited?: boolean;
  locked?: boolean;
  completeness?: string | null;
  warnings?: Prisma.InputJsonValue;
};

export async function getOrCreateSowDocument(
  scope: TenantScope,
  blueprintId: string,
  title: string
) {
  const tenantFilter = scope.isPlatformStaff ? {} : { tenantId: scope.tenantId! };
  const existing = await prisma.sowDocument.findFirst({
    where: { blueprintId, ...tenantFilter },
  });
  if (existing) return existing;

  const tenantId = scope.tenantId;
  if (!tenantId) throw new Error("tenantId required to create SOW document");

  return prisma.sowDocument.create({
    data: { tenantId, blueprintId, title },
  });
}

export async function createSowVersion(params: {
  scope: TenantScope;
  sowDocumentId: string;
  blueprintVersionId: string;
  roiSnapshotId?: string | null;
  contentHash: string;
  sections: SowSectionInput[];
  status?: SowVersionStatus;
}) {
  return prismaTransaction(async (tx) => {
    const doc = await tx.sowDocument.findUnique({
      where: { id: params.sowDocumentId },
    });
    if (!doc) throw new Error("SOW document not found");
    assertTenantMatch(params.scope, doc.tenantId, "createSowVersion");

    const latest = await tx.sowVersion.findFirst({
      where: { sowDocumentId: params.sowDocumentId },
      orderBy: { versionNumber: "desc" },
    });
    const versionNumber = (latest?.versionNumber ?? 0) + 1;

    const version = await tx.sowVersion.create({
      data: {
        tenantId: doc.tenantId,
        sowDocumentId: params.sowDocumentId,
        versionNumber,
        status: params.status ?? "DRAFT",
        blueprintVersionId: params.blueprintVersionId,
        roiSnapshotId: params.roiSnapshotId ?? null,
        contentHash: params.contentHash,
      },
    });

    for (const section of params.sections) {
      await tx.sowSection.create({
        data: {
          tenantId: doc.tenantId,
          sowVersionId: version.id,
          sectionKey: section.sectionKey,
          orderIndex: section.orderIndex,
          title: section.title,
          provenance: section.provenance,
          generatedContent: section.generatedContent ?? null,
          manualContent: section.manualContent ?? null,
          sourceRefs: section.sourceRefs ?? undefined,
          manuallyEdited: section.manuallyEdited ?? false,
          locked: section.locked ?? false,
          completeness: section.completeness ?? null,
          warnings: section.warnings ?? undefined,
        },
      });
    }

    return version;
  });
}

export async function updateSowSectionManualContent(params: {
  scope: TenantScope;
  sectionId: string;
  manualContent: string;
}) {
  const section = await prisma.sowSection.findUnique({
    where: { id: params.sectionId },
    include: { sowVersion: true },
  });
  if (!section) throw new Error("SOW section not found");
  assertTenantMatch(params.scope, section.tenantId, "updateSowSectionManualContent");

  if (section.sowVersion.status === "APPROVED") {
    throw new Error("Approved SOW versions are immutable");
  }
  if (section.locked) {
    throw new Error("Locked SOW sections cannot be edited");
  }

  return prisma.sowSection.update({
    where: { id: params.sectionId },
    data: {
      manualContent: params.manualContent,
      manuallyEdited: true,
      provenance: section.generatedContent ? "GENERATED_EDITED" : "MANUAL",
    },
  });
}

export async function listSowVersionsForDocument(
  scope: TenantScope,
  sowDocumentId: string
) {
  const tenantFilter = scope.isPlatformStaff ? {} : { tenantId: scope.tenantId! };
  return prisma.sowVersion.findMany({
    where: { sowDocumentId, ...tenantFilter },
    orderBy: { versionNumber: "desc" },
    include: { sections: { orderBy: { orderIndex: "asc" } } },
  });
}
