"use server";

import { revalidatePath } from "next/cache";

import { findPlatformAccountBySupabaseUserId } from "@/lib/account/platform-account.service";
import { requireActionRequestReview } from "@/lib/auth/action-guard";
import { requirePlatformStaff } from "@/lib/auth/session";
import { getBusinessField, listBusinessFields } from "@/lib/business-field-catalog/fields";
import {
  isProcrowQualificationOutcome,
  type ProcrowQualificationOutcome,
} from "@/lib/procrow/procrow-qualification";
import {
  applyProcrowFieldResolution,
  applyProcrowQualification,
} from "@/lib/services/client-service-request.service";
import {
  getImplementationRequest,
  rejectImplementationRequest,
} from "@/lib/services/implementation-request.service";
import { routes } from "@/lib/routes";

export async function resolveProcrowRequestFieldAction(
  requestId: string,
  formData: FormData,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const user = await requirePlatformStaff();
  const account = await findPlatformAccountBySupabaseUserId(user.id);
  if (!account) return { ok: false, error: "Platform account required." };

  const canonicalFieldKey = String(formData.get("canonicalFieldKey") ?? "").trim();
  const reviewerNote = String(formData.get("reviewerNote") ?? "").trim() || null;
  const originalClientDescription = String(formData.get("originalClientDescription") ?? "").trim();
  const suggestedRaw = String(formData.get("suggestedCatalogMatches") ?? "").trim();

  if (!canonicalFieldKey || !getBusinessField(canonicalFieldKey)) {
    return { ok: false, error: "Select a valid catalog field." };
  }
  if (!originalClientDescription) {
    return { ok: false, error: "Original client description is required." };
  }

  const suggestedCatalogMatches = suggestedRaw
    ? suggestedRaw.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const result = await applyProcrowFieldResolution(requestId, {
    reviewedCanonicalFieldKey: canonicalFieldKey,
    reviewerNote,
    resolvedByPlatformAccountId: account.id,
    originalClientDescription,
    suggestedCatalogMatches,
  });

  if (!result) return { ok: false, error: "Request brief not found." };

  revalidatePath(routes.admin.request(requestId));
  return { ok: true };
}

/**
 * CROW.PROCROW.1 — record qualification outcome in brief notes.
 * Declined also sets DB status REJECTED without destroying brief JSON.
 * Does not create tenant membership, platform role, Blueprint, or payment.
 */
export async function recordProcrowQualificationAction(
  requestId: string,
  formData: FormData,
): Promise<{ ok: true } | { ok: false; error: string }> {
  await requireActionRequestReview();
  const user = await requirePlatformStaff();
  const account = await findPlatformAccountBySupabaseUserId(user.id);
  if (!account) return { ok: false, error: "Platform account required." };

  const request = await getImplementationRequest(requestId);
  if (!request) return { ok: false, error: "Request not found." };
  if (request.status !== "PENDING_REVIEW" && request.status !== "REJECTED") {
    return {
      ok: false,
      error: `Cannot record qualification from status ${request.status}.`,
    };
  }

  const outcomeRaw = String(formData.get("outcome") ?? "").trim();
  if (!isProcrowQualificationOutcome(outcomeRaw)) {
    return { ok: false, error: "Select a valid qualification outcome." };
  }
  const outcome = outcomeRaw as ProcrowQualificationOutcome;
  const operatorNote = String(formData.get("operatorNote") ?? "").trim() || null;

  if (request.status === "REJECTED" && outcome !== "declined") {
    return { ok: false, error: "Closed declined requests cannot be re-opened from this panel." };
  }

  const result = await applyProcrowQualification(requestId, {
    outcome,
    operatorNote,
    recordedByPlatformAccountId: account.id,
  });
  if (!result) {
    return {
      ok: false,
      error: "Modern request brief not found — qualification requires notes JSON brief.",
    };
  }

  if (outcome === "declined" && request.status === "PENDING_REVIEW") {
    // Status transition only — notes already hold declined outcome + note.
    await rejectImplementationRequest(requestId);
  }

  revalidatePath(routes.admin.request(requestId));
  revalidatePath(routes.admin.requests);
  revalidatePath(routes.admin.queue);
  return { ok: true };
}

export async function listCatalogFieldOptionsAction(): Promise<Array<{ key: string; label: string }>> {
  await requirePlatformStaff();
  return listBusinessFields()
    .filter((f) => f.status === "ACTIVE")
    .map((f) => ({ key: f.key, label: f.displayNameEn }))
    .sort((a, b) => a.label.localeCompare(b.label));
}
