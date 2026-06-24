import type { BlueprintTraceActorType } from "@prisma/client";
import { prisma } from "@/lib/db";
import type { BlueprintAuditRepository } from "../repository-contracts";
import type { BlueprintAuditEventRecord, BlueprintActorClass } from "../types";

function actorClassToTraceType(actorClass: BlueprintActorClass): BlueprintTraceActorType {
  if (actorClass === "PLATFORM_ADMIN" || actorClass === "REQUEST_OWNER") return "HUMAN";
  return "SYSTEM_PROCESS";
}

export const prismaBlueprintAuditRepository: BlueprintAuditRepository = {
  async append(event) {
    const blueprint = await prisma.enterpriseBlueprint.findUnique({
      where: { id: event.blueprintId },
      select: { tenantId: true, requestId: true },
    });
    const row = await prisma.blueprintTraceEvent.create({
      data: {
        tenantId: blueprint?.tenantId ?? null,
        blueprintId: event.blueprintId,
        blueprintVersionId: event.blueprintVersionId,
        resourceType: "BLUEPRINT_LIFECYCLE",
        actorType: actorClassToTraceType(event.actorClass),
        actorId: event.actorPlatformAccountId,
        action: event.eventType,
        previousState: event.payload.fromState ?? null,
        newState: event.payload.toState ?? null,
        requestId: blueprint?.requestId ?? null,
        metadata: {
          versionNumber: event.payload.versionNumber,
          contentHashPrefix: event.payload.contentHashPrefix,
          reviewCycleNumber: event.payload.reviewCycleNumber,
          reasonCode: event.payload.reasonCode,
          actorClass: event.actorClass,
        },
      },
    });
    return {
      id: row.id,
      blueprintId: row.blueprintId,
      blueprintVersionId: row.blueprintVersionId,
      eventType: row.action,
      actorClass: event.actorClass,
      actorPlatformAccountId: event.actorPlatformAccountId,
      payload: event.payload,
      createdAt: row.createdAt.toISOString(),
    } satisfies BlueprintAuditEventRecord;
  },

  async listByBlueprint(blueprintId) {
    const rows = await prisma.blueprintTraceEvent.findMany({
      where: { blueprintId },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    return rows.map((row) => ({
      id: row.id,
      blueprintId: row.blueprintId,
      blueprintVersionId: row.blueprintVersionId,
      eventType: row.action,
      actorClass: "PLATFORM_ADMIN" as const,
      actorPlatformAccountId: row.actorId,
      payload: (row.metadata ?? {}) as BlueprintAuditEventRecord["payload"],
      createdAt: row.createdAt.toISOString(),
    }));
  },
};
