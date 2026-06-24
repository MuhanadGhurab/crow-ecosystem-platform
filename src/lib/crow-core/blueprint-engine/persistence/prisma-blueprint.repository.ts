import { prisma, prismaTransaction } from "@/lib/db";
import type { BlueprintRepository } from "../repository-contracts";
import type { BlueprintRootAggregate } from "../types";
import { BlueprintEngineError } from "../errors";
import { mapRoot, mapRootWithVersions } from "./prisma-mappers";

export const prismaBlueprintRepository: BlueprintRepository = {
  async findByRequestId(requestId) {
    const row = await prisma.enterpriseBlueprint.findUnique({
      where: { requestId },
      include: {
        currentVersion: { select: { versionNumber: true } },
        platformFinalizedVersion: { select: { versionNumber: true } },
      },
    });
    return row ? mapRootWithVersions(row) : null;
  },

  async findById(blueprintId) {
    const row = await prisma.enterpriseBlueprint.findUnique({
      where: { id: blueprintId },
      include: {
        currentVersion: { select: { versionNumber: true } },
        platformFinalizedVersion: { select: { versionNumber: true } },
      },
    });
    return row ? mapRootWithVersions(row) : null;
  },

  async createRoot(input) {
    const request = await prisma.implementationRequest.findUnique({
      where: { id: input.requestId },
      include: { discoveryProfile: { select: { id: true } }, enterpriseBlueprint: { select: { id: true } } },
    });
    if (!request) {
      throw new BlueprintEngineError("BLUEPRINT_NOT_FOUND", "Implementation request not found", true);
    }
    if (request.enterpriseBlueprint) {
      throw new BlueprintEngineError("BLUEPRINT_INVALID_TRANSITION", "Blueprint already exists for this request", true);
    }
    if (!request.discoveryProfile) {
      throw new BlueprintEngineError("BLUEPRINT_NOT_READY_FOR_REVIEW", "Request has no discovery profile", true);
    }

    const row = await prisma.enterpriseBlueprint.create({
      data: {
        requestId: input.requestId,
        discoveryProfileId: request.discoveryProfile.id,
        lifecycleState: "DRAFT_INTERNAL",
        clientVisibilityState: "NOT_SHARED",
        rowVersion: 1,
      },
      include: {
        currentVersion: { select: { versionNumber: true } },
        platformFinalizedVersion: { select: { versionNumber: true } },
      },
    });
    return mapRootWithVersions(row);
  },

  async transitionLifecycle(blueprintId, expectedRowVersion, patch) {
    return prismaTransaction(async (tx) => {
      const current = await tx.enterpriseBlueprint.findUnique({ where: { id: blueprintId } });
      if (!current) throw new BlueprintEngineError("BLUEPRINT_NOT_FOUND", "Blueprint not found");
      if (current.rowVersion !== expectedRowVersion) {
        throw new BlueprintEngineError("BLUEPRINT_CONCURRENCY_CONFLICT", "Blueprint was modified by another operator");
      }

      const data: Record<string, unknown> = { rowVersion: { increment: 1 } };
      if (patch.lifecycleState) data.lifecycleState = patch.lifecycleState;
      if (patch.clientVisibility) data.clientVisibilityState = patch.clientVisibility;
      if (patch.sharedWithClientVersionNumber !== undefined) {
        data.sharedWithClientVersionNumber = patch.sharedWithClientVersionNumber;
      }

      const updated = await tx.enterpriseBlueprint.update({
        where: { id: blueprintId },
        data,
        include: {
          currentVersion: { select: { versionNumber: true } },
          platformFinalizedVersion: { select: { versionNumber: true } },
        },
      });

      const mapped = mapRootWithVersions(updated);
      if (patch.currentVersionNumber !== undefined) mapped.currentVersionNumber = patch.currentVersionNumber;
      if (patch.platformFinalizedVersionNumber !== undefined) {
        mapped.platformFinalizedVersionNumber = patch.platformFinalizedVersionNumber;
      }
      return mapped;
    });
  },
};

export async function setBlueprintCurrentVersion(
  blueprintId: string,
  versionId: string,
  versionNumber: number,
  expectedRowVersion: number,
): Promise<BlueprintRootAggregate> {
  return prismaTransaction(async (tx) => {
    const current = await tx.enterpriseBlueprint.findUnique({ where: { id: blueprintId } });
    if (!current) throw new BlueprintEngineError("BLUEPRINT_NOT_FOUND", "Blueprint not found");
    if (current.rowVersion !== expectedRowVersion) {
      throw new BlueprintEngineError("BLUEPRINT_CONCURRENCY_CONFLICT", "Blueprint was modified by another operator");
    }
    const updated = await tx.enterpriseBlueprint.update({
      where: { id: blueprintId },
      data: {
        currentVersionId: versionId,
        rowVersion: { increment: 1 },
      },
      include: {
        currentVersion: { select: { versionNumber: true } },
        platformFinalizedVersion: { select: { versionNumber: true } },
      },
    });
    const mapped = mapRootWithVersions(updated);
    mapped.currentVersionNumber = versionNumber;
    return mapped;
  });
}

export async function setBlueprintPlatformFinalized(
  blueprintId: string,
  versionId: string,
  versionNumber: number,
  expectedRowVersion: number,
): Promise<BlueprintRootAggregate> {
  return prismaTransaction(async (tx) => {
    const current = await tx.enterpriseBlueprint.findUnique({ where: { id: blueprintId } });
    if (!current) throw new BlueprintEngineError("BLUEPRINT_NOT_FOUND", "Blueprint not found");
    if (current.rowVersion !== expectedRowVersion) {
      throw new BlueprintEngineError("BLUEPRINT_CONCURRENCY_CONFLICT", "Blueprint was modified by another operator");
    }
    const updated = await tx.enterpriseBlueprint.update({
      where: { id: blueprintId },
      data: {
        platformFinalizedVersionId: versionId,
        lifecycleState: "PLATFORM_FINALIZED",
        rowVersion: { increment: 1 },
      },
      include: {
        currentVersion: { select: { versionNumber: true } },
        platformFinalizedVersion: { select: { versionNumber: true } },
      },
    });
    const mapped = mapRootWithVersions(updated);
    mapped.platformFinalizedVersionNumber = versionNumber;
    return mapped;
  });
}
