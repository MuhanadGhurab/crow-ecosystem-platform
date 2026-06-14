import type { BlueprintTraceActorType, Prisma } from "@prisma/client";

import { prisma } from "@/lib/db";

import { type TenantScope, tenantWhereClause } from "./tenant-scope";

export type AppendTraceEventInput = {
  tenantId: string;
  blueprintId: string;
  blueprintVersionId?: string | null;
  resourceType: string;
  resourceId?: string | null;
  actorType: BlueprintTraceActorType;
  actorId?: string | null;
  action: string;
  reason?: string | null;
  previousState?: string | null;
  newState?: string | null;
  impact?: string | null;
  evidenceRefs?: Prisma.InputJsonValue;
  aiInvolved?: boolean;
  correlationId?: string | null;
  requestId?: string | null;
  metadata?: Prisma.InputJsonValue;
};

export async function appendBlueprintTraceEvent(input: AppendTraceEventInput) {
  return prisma.blueprintTraceEvent.create({
    data: {
      tenantId: input.tenantId,
      blueprintId: input.blueprintId,
      blueprintVersionId: input.blueprintVersionId ?? null,
      resourceType: input.resourceType,
      resourceId: input.resourceId ?? null,
      actorType: input.actorType,
      actorId: input.actorId ?? null,
      action: input.action,
      reason: input.reason ?? null,
      previousState: input.previousState ?? null,
      newState: input.newState ?? null,
      impact: input.impact ?? null,
      evidenceRefs: input.evidenceRefs ?? undefined,
      aiInvolved: input.aiInvolved ?? false,
      correlationId: input.correlationId ?? null,
      requestId: input.requestId ?? null,
      metadata: input.metadata ?? undefined,
    },
  });
}

export async function listTraceEventsForBlueprint(
  scope: TenantScope,
  blueprintId: string,
  options?: { limit?: number; cursor?: string }
) {
  const tenantFilter = tenantWhereClause(scope);
  return prisma.blueprintTraceEvent.findMany({
    where: {
      blueprintId,
      ...(tenantFilter ? { tenantId: tenantFilter.tenantId } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: options?.limit ?? 50,
    ...(options?.cursor
      ? { skip: 1, cursor: { id: options.cursor } }
      : {}),
  });
}
