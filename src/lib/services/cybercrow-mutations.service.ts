import type { Prisma } from "@prisma/client";
import type { User } from "@supabase/supabase-js";
import { Permission, hasPermission } from "@/lib/auth/permissions";
import { getCrowAuth } from "@/lib/auth/roles";
import {
  INCIDENT_STATUS,
  normalizeIncidentStatus,
  type IncidentStatusValue,
} from "@/lib/constants/cybercrow-incident-status";
import { prisma } from "@/lib/db";

export type SecurityEventReviewStatus = "pending" | "reviewed" | "dismissed" | "escalated";

function payloadObject(payload: unknown): Record<string, unknown> {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return {};
  return { ...payload } as Record<string, unknown>;
}

function mergePayload(payload: unknown, patch: Record<string, unknown>): Prisma.InputJsonValue {
  return { ...payloadObject(payload), ...patch } as Prisma.InputJsonValue;
}

export function getSecurityEventReviewStatus(payload: unknown): SecurityEventReviewStatus {
  const p = payloadObject(payload);
  const raw = p.reviewStatus;
  if (raw === "reviewed" || raw === "dismissed" || raw === "escalated") return raw;
  return "pending";
}

export function assertCybercrowIncidentManage(user: User): void {
  const { role } = getCrowAuth(user);
  if (!hasPermission(role, Permission["cybercrow.incidents.manage"])) {
    throw new Error("You do not have permission to manage CyberCrow incidents or security events.");
  }
}

async function writeCybercrowAudit(
  tenantId: string,
  user: User,
  action: string,
  entityType: string,
  entityId: string,
  metadata?: Record<string, unknown>
) {
  await prisma.cybercrowAuditLog.create({
    data: {
      tenantId,
      actorId: user.id,
      action,
      entityType,
      entityId,
      metadata: metadata ? (metadata as Prisma.InputJsonValue) : undefined,
    },
  });
}

export async function updateIncidentStatus(
  tenantId: string,
  user: User,
  incidentId: string,
  nextStatus: IncidentStatusValue
) {
  assertCybercrowIncidentManage(user);

  const incident = await prisma.incident.findFirst({
    where: { id: incidentId, tenantId },
  });
  if (!incident) throw new Error("Incident not found.");

  const previous = normalizeIncidentStatus(incident.status);
  const updated = await prisma.incident.update({
    where: { id: incidentId },
    data: { status: nextStatus },
  });

  await writeCybercrowAudit(tenantId, user, "INCIDENT_STATUS_CHANGED", "incident", incidentId, {
    previousStatus: previous,
    nextStatus,
    title: incident.title,
  });

  return updated;
}

export async function markSecurityEventReviewed(
  tenantId: string,
  user: User,
  eventId: string
) {
  assertCybercrowIncidentManage(user);
  const event = await prisma.securityEvent.findFirst({ where: { id: eventId, tenantId } });
  if (!event) throw new Error("Security event not found.");

  const updated = await prisma.securityEvent.update({
    where: { id: eventId },
    data: {
      payload: mergePayload(event.payload, {
        reviewStatus: "reviewed",
        reviewedAt: new Date().toISOString(),
        reviewedBy: user.id,
      }),
    },
  });

  await writeCybercrowAudit(tenantId, user, "SECURITY_EVENT_REVIEWED", "security_event", eventId, {
    eventType: event.eventType,
    severity: event.severity,
  });

  return updated;
}

export async function dismissSecurityEventInformational(
  tenantId: string,
  user: User,
  eventId: string
) {
  assertCybercrowIncidentManage(user);
  const event = await prisma.securityEvent.findFirst({ where: { id: eventId, tenantId } });
  if (!event) throw new Error("Security event not found.");

  if (event.severity !== "info" && event.severity !== "low") {
    throw new Error("Only informational or low-severity events can be dismissed without escalation.");
  }

  const updated = await prisma.securityEvent.update({
    where: { id: eventId },
    data: {
      payload: mergePayload(event.payload, {
        reviewStatus: "dismissed",
        dismissedAt: new Date().toISOString(),
        dismissedBy: user.id,
      }),
    },
  });

  await writeCybercrowAudit(tenantId, user, "SECURITY_EVENT_DISMISSED", "security_event", eventId, {
    eventType: event.eventType,
    severity: event.severity,
  });

  return updated;
}

export async function escalateSecurityEventToIncident(
  tenantId: string,
  user: User,
  eventId: string
) {
  assertCybercrowIncidentManage(user);
  const event = await prisma.securityEvent.findFirst({ where: { id: eventId, tenantId } });
  if (!event) throw new Error("Security event not found.");

  const existing = payloadObject(event.payload);
  if (typeof existing.escalatedIncidentId === "string") {
    throw new Error("This event was already escalated to an incident.");
  }

  const title =
    typeof existing.referenceCode === "string"
      ? `Escalated: ${event.eventType} (${existing.referenceCode})`
      : `Escalated: ${event.eventType}`;

  const incident = await prisma.incident.create({
    data: {
      tenantId,
      title,
      status: INCIDENT_STATUS.open,
      severity: event.severity === "info" ? "medium" : event.severity,
    },
  });

  await prisma.securityEvent.update({
    where: { id: eventId },
    data: {
      payload: mergePayload(event.payload, {
        reviewStatus: "escalated",
        escalatedIncidentId: incident.id,
        escalatedAt: new Date().toISOString(),
        escalatedBy: user.id,
      }),
    },
  });

  await writeCybercrowAudit(tenantId, user, "SECURITY_EVENT_ESCALATED", "security_event", eventId, {
    incidentId: incident.id,
    eventType: event.eventType,
  });

  return incident;
}
