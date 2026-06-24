import { prisma } from "@/lib/db";
import type { BlueprintReviewRepository } from "../repository-contracts";
import type { BlueprintReviewCycleRecord } from "../types";
import { BlueprintEngineError } from "../errors";
import { mapReviewCycle } from "./prisma-mappers";

export const prismaBlueprintReviewRepository: BlueprintReviewRepository = {
  async openReviewCycle(input) {
    const row = await prisma.blueprintReviewCycle.create({
      data: {
        blueprintId: input.blueprintId,
        blueprintVersionId: input.blueprintVersionId,
        versionNumber: input.versionNumber,
        cycleNumber: input.cycleNumber,
        audience: input.audience,
        state: "OPEN",
      },
    });
    return mapReviewCycle(row);
  },

  async getOpenCycle(blueprintId, versionNumber) {
    const row = await prisma.blueprintReviewCycle.findFirst({
      where: { blueprintId, versionNumber, state: "OPEN" },
      orderBy: { cycleNumber: "desc" },
    });
    return row ? mapReviewCycle(row) : null;
  },

  async closeCycle(cycleId, state) {
    const row = await prisma.blueprintReviewCycle.update({
      where: { id: cycleId },
      data: { state, closedAt: new Date() },
    });
    return mapReviewCycle(row);
  },

  async recordAction(input) {
    const row = await prisma.blueprintReviewAction.create({
      data: {
        reviewCycleId: input.reviewCycleId,
        blueprintVersionId: input.blueprintVersionId,
        actorPlatformAccountId: input.actorPlatformAccountId,
        actorAuthorityClass: input.actorClass,
        action: input.action,
        contentHashAtAction: input.contentHashAtAction,
        reasonCode: input.reason ?? null,
        comment: input.reason,
      },
    });
    return {
      id: row.id,
      reviewCycleId: row.reviewCycleId,
      blueprintVersionId: row.blueprintVersionId,
      actorPlatformAccountId: row.actorPlatformAccountId,
      actorClass: input.actorClass,
      action: input.action as typeof input.action,
      reason: row.comment,
      contentHashAtAction: row.contentHashAtAction,
      createdAt: row.createdAt.toISOString(),
    };
  },
};

export async function nextReviewCycleNumber(blueprintId: string): Promise<number> {
  const latest = await prisma.blueprintReviewCycle.findFirst({
    where: { blueprintId },
    orderBy: { cycleNumber: "desc" },
    select: { cycleNumber: true },
  });
  return (latest?.cycleNumber ?? 0) + 1;
}

export async function supersedeOpenCycles(blueprintId: string): Promise<void> {
  await prisma.blueprintReviewCycle.updateMany({
    where: { blueprintId, state: "OPEN" },
    data: { state: "SUPERSEDED", closedAt: new Date() },
  });
}

export async function listReviewCycles(blueprintId: string): Promise<BlueprintReviewCycleRecord[]> {
  const rows = await prisma.blueprintReviewCycle.findMany({
    where: { blueprintId },
    orderBy: { cycleNumber: "asc" },
  });
  return rows.map(mapReviewCycle);
}

export async function listReviewActions(blueprintId: string) {
  return prisma.blueprintReviewAction.findMany({
    where: { blueprintVersion: { blueprintId } },
    orderBy: { createdAt: "asc" },
    include: { reviewCycle: { select: { cycleNumber: true, audience: true } } },
  });
}
