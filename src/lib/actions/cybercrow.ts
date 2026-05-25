"use server";

import { revalidatePath } from "next/cache";
import { requireTenantAccess } from "@/lib/auth/session";
import { INCIDENT_STATUS, type IncidentStatusValue } from "@/lib/constants/cybercrow-incident-status";
import { routes } from "@/lib/routes";
import { getTenantBySlug } from "@/lib/services/tenant.service";
import {
  dismissSecurityEventInformational,
  escalateSecurityEventToIncident,
  markSecurityEventReviewed,
  updateIncidentStatus,
} from "@/lib/services/cybercrow-mutations.service";

export type CybercrowActionState = { error?: string; success?: string } | undefined;

async function tenantFromSlug(slug: string) {
  const user = await requireTenantAccess(slug);
  const tenant = await getTenantBySlug(slug);
  if (!tenant) throw new Error("Tenant not found");
  return { user, tenant };
}

function revalidateCybercrow(slug: string) {
  const r = routes.tenant(slug).cybercrow;
  revalidatePath(r.dashboard);
  revalidatePath(r.incidents);
  revalidatePath(r.securityEvents);
  revalidatePath(r.auditLogs);
  revalidatePath(r.risk);
  revalidatePath(r.evidence);
  revalidatePath(r.compliance);
  revalidatePath(r.grc);
}

export async function updateIncidentStatusAction(
  _prev: CybercrowActionState,
  formData: FormData
): Promise<CybercrowActionState> {
  const slug = String(formData.get("tenantSlug") ?? "");
  const incidentId = String(formData.get("incidentId") ?? "");
  const status = String(formData.get("status") ?? "") as IncidentStatusValue;

  if (!slug || !incidentId || !status) {
    return { error: "Missing incident or status." };
  }

  const allowed = new Set(Object.values(INCIDENT_STATUS));
  if (!allowed.has(status)) {
    return { error: "Invalid status." };
  }

  try {
    const { user, tenant } = await tenantFromSlug(slug);
    await updateIncidentStatus(tenant.id, user, incidentId, status);
    revalidateCybercrow(slug);
    return { success: `Incident marked ${status.replace(/_/g, " ")}.` };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to update incident." };
  }
}

export async function markSecurityEventReviewedAction(
  _prev: CybercrowActionState,
  formData: FormData
): Promise<CybercrowActionState> {
  const slug = String(formData.get("tenantSlug") ?? "");
  const eventId = String(formData.get("eventId") ?? "");
  if (!slug || !eventId) return { error: "Missing event." };

  try {
    const { user, tenant } = await tenantFromSlug(slug);
    await markSecurityEventReviewed(tenant.id, user, eventId);
    revalidateCybercrow(slug);
    return { success: "Event marked reviewed." };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to review event." };
  }
}

export async function dismissSecurityEventAction(
  _prev: CybercrowActionState,
  formData: FormData
): Promise<CybercrowActionState> {
  const slug = String(formData.get("tenantSlug") ?? "");
  const eventId = String(formData.get("eventId") ?? "");
  if (!slug || !eventId) return { error: "Missing event." };

  try {
    const { user, tenant } = await tenantFromSlug(slug);
    await dismissSecurityEventInformational(tenant.id, user, eventId);
    revalidateCybercrow(slug);
    return { success: "Informational event dismissed." };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to dismiss event." };
  }
}

export async function escalateSecurityEventAction(
  _prev: CybercrowActionState,
  formData: FormData
): Promise<CybercrowActionState> {
  const slug = String(formData.get("tenantSlug") ?? "");
  const eventId = String(formData.get("eventId") ?? "");
  if (!slug || !eventId) return { error: "Missing event." };

  try {
    const { user, tenant } = await tenantFromSlug(slug);
    const incident = await escalateSecurityEventToIncident(tenant.id, user, eventId);
    revalidateCybercrow(slug);
    return { success: `Escalated to incident: ${incident.title}` };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to escalate event." };
  }
}
