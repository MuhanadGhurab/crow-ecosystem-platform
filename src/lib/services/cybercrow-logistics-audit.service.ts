import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import {
  CYBERCROW_AUDIT_ACTIONS,
  logisticsAuditActionFilter,
  LOGISTICS_AUDIT_CATEGORY,
  LOGISTICS_AUDIT_ENTITY_TYPE,
  type LogisticsAuditMetadata,
} from "@/lib/constants/cybercrow-audit-events";

export type RecordLogisticsAuditInput = {
  tenantId: string;
  action: (typeof CYBERCROW_AUDIT_ACTIONS)[keyof typeof CYBERCROW_AUDIT_ACTIONS];
  entityId?: string;
  metadata?: Omit<LogisticsAuditMetadata, "category">;
  actorId?: string | null;
  mirrorSecurityEvent?: boolean;
};

const LOGISTICS_AUDIT_SAMPLES: Array<{
  seedEntityId: string;
  action: RecordLogisticsAuditInput["action"];
  workflowName: string;
  referenceCode: string;
  aiExtraKey?: string;
  severity: LogisticsAuditMetadata["severity"];
  mirrorSecurityEvent?: boolean;
}> = [
  {
    seedEntityId: "seed:logistics:ocr-document-captured",
    action: CYBERCROW_AUDIT_ACTIONS.OCR_DOCUMENT_CAPTURED,
    workflowName: "OCR document capture",
    referenceCode: "MEEM-SHP-1042",
    aiExtraKey: "doc_intelligence",
    severity: "info",
  },
  {
    seedEntityId: "seed:logistics:logistics-dispatch-approved",
    action: CYBERCROW_AUDIT_ACTIONS.LOGISTICS_DISPATCH_APPROVED,
    workflowName: "Shipment dispatch approval",
    referenceCode: "MEEM-SHP-2287",
    severity: "low",
  },
  {
    seedEntityId: "seed:logistics:route-anomaly-detected",
    action: CYBERCROW_AUDIT_ACTIONS.ROUTE_ANOMALY_DETECTED,
    workflowName: "AI route optimization",
    referenceCode: "MEEM-SHP-4410",
    aiExtraKey: "route_optimization",
    severity: "medium",
    mirrorSecurityEvent: true,
  },
  {
    seedEntityId: "seed:logistics:dispatch-sla-breach",
    action: CYBERCROW_AUDIT_ACTIONS.DISPATCH_SLA_BREACH,
    workflowName: "Shipment dispatch approval",
    referenceCode: "MEEM-SHP-2291",
    aiExtraKey: "anomaly_detection",
    severity: "high",
    mirrorSecurityEvent: true,
  },
];

function hasModule(moduleKeys: string[], key: string): boolean {
  return moduleKeys.includes(key);
}

/** Tenant has logistics CEM module (module-driven, not slug). */
export function tenantHasLogisticsModule(moduleKeys: string[]): boolean {
  return hasModule(moduleKeys, "logistics");
}

export async function isTenantCybercrowActive(tenantId: string): Promise<boolean> {
  const init = await prisma.cybercrowAuditLog.findFirst({
    where: { tenantId, action: CYBERCROW_AUDIT_ACTIONS.CYBERCROW_INITIALIZED },
    select: { id: true },
  });
  return Boolean(init);
}

/** Logistics audit samples when logistics module + CyberCrow baseline exist. */
export async function tenantEligibleForLogisticsAudit(
  tenantId: string,
  moduleKeys: string[]
): Promise<boolean> {
  if (!tenantHasLogisticsModule(moduleKeys)) return false;
  return isTenantCybercrowActive(tenantId);
}

export async function recordLogisticsAuditEvent(
  input: RecordLogisticsAuditInput
): Promise<{ auditId: string; securityEventId?: string }> {
  const metadata: LogisticsAuditMetadata = {
    category: LOGISTICS_AUDIT_CATEGORY,
    source: input.metadata?.source ?? "workflow",
    ...input.metadata,
  };

  const audit = await prisma.cybercrowAuditLog.create({
    data: {
      tenantId: input.tenantId,
      actorId: input.actorId ?? null,
      action: input.action,
      entityType: LOGISTICS_AUDIT_ENTITY_TYPE,
      entityId: input.entityId ?? input.metadata?.referenceCode ?? null,
      metadata: metadata as Prisma.InputJsonValue,
    },
  });

  let securityEventId: string | undefined;
  const shouldMirror =
    input.mirrorSecurityEvent ??
    (input.action === CYBERCROW_AUDIT_ACTIONS.ROUTE_ANOMALY_DETECTED ||
      input.action === CYBERCROW_AUDIT_ACTIONS.DISPATCH_SLA_BREACH);

  if (shouldMirror) {
    const severity =
      metadata.severity === "high" ? "high" : metadata.severity === "medium" ? "medium" : "low";
    const event = await prisma.securityEvent.create({
      data: {
        tenantId: input.tenantId,
        eventType: input.action,
        severity,
        payload: {
          category: LOGISTICS_AUDIT_CATEGORY,
          auditLogId: audit.id,
          workflowName: metadata.workflowName,
          referenceCode: metadata.referenceCode,
          shipmentRef: metadata.shipmentRef ?? metadata.referenceCode,
        } as Prisma.InputJsonValue,
      },
    });
    securityEventId = event.id;
  }

  return { auditId: audit.id, securityEventId };
}

/** Idempotent demo logistics audit + security events for ops seed / provision. */
export async function seedLogisticsAuditSamples(
  tenantId: string,
  moduleKeys: string[]
): Promise<{ created: number; skipped: boolean }> {
  const eligible = await tenantEligibleForLogisticsAudit(tenantId, moduleKeys);
  if (!eligible) return { created: 0, skipped: true };

  let created = 0;
  for (const sample of LOGISTICS_AUDIT_SAMPLES) {
    const existing = await prisma.cybercrowAuditLog.findFirst({
      where: { tenantId, entityId: sample.seedEntityId },
      select: { id: true },
    });
    if (existing) continue;

    await recordLogisticsAuditEvent({
      tenantId,
      action: sample.action,
      entityId: sample.seedEntityId,
      metadata: {
        seedKey: sample.seedEntityId,
        source: "tenant-ops-seed",
        workflowName: sample.workflowName,
        referenceCode: sample.referenceCode,
        shipmentRef: sample.referenceCode,
        aiExtraKey: sample.aiExtraKey,
        severity: sample.severity,
      },
      mirrorSecurityEvent: sample.mirrorSecurityEvent,
    });
    created += 1;
  }

  return { created, skipped: false };
}

export async function countLogisticsAuditEvents(tenantId: string): Promise<number> {
  return prisma.cybercrowAuditLog.count({
    where: { tenantId, ...logisticsAuditActionFilter() },
  });
}
