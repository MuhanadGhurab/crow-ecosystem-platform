"use server";

import { revalidatePath } from "next/cache";

import { findPlatformAccountBySupabaseUserId } from "@/lib/account/platform-account.service";
import { requirePlatformStaff } from "@/lib/auth/session";
import { getBusinessField, listBusinessFields } from "@/lib/business-field-catalog/fields";
import { applyProcrowFieldResolution } from "@/lib/services/client-service-request.service";
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

export async function listCatalogFieldOptionsAction(): Promise<Array<{ key: string; label: string }>> {
  await requirePlatformStaff();
  return listBusinessFields()
    .filter((f) => f.status === "ACTIVE")
    .map((f) => ({ key: f.key, label: f.displayNameEn }))
    .sort((a, b) => a.label.localeCompare(b.label));
}
