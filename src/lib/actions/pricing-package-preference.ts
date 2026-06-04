"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireClientAccess } from "@/lib/auth/session";
import type { ClientPackageChangeType } from "@/lib/pricing/pricing-package-contract";
import { routes } from "@/lib/routes";
import { recordClientPackagePreference } from "@/lib/services/pricing-package-recommendation.service";

const preferenceSchema = z.object({
  request_id: z.string().trim().min(1),
  change_type: z.enum(["keep_recommended", "downscale", "upscale", "request_custom"]),
  notes: z.string().trim().max(2000).optional(),
  target_tier: z.enum(["startup", "growth", "enterprise"]).optional(),
});

export type PricingPackagePreferenceActionResult =
  | { ok: true }
  | { ok: false; error: string };

function revalidatePackagePaths(requestId: string) {
  revalidatePath(routes.client.request(requestId));
  revalidatePath(routes.client.requests);
  revalidatePath(routes.admin.request(requestId));
}

export async function submitClientPackagePreferenceAction(
  _prev: PricingPackagePreferenceActionResult | null,
  formData: FormData
): Promise<PricingPackagePreferenceActionResult> {
  const requestId = String(formData.get("request_id") ?? "");
  const user = await requireClientAccess(routes.client.request(requestId));

  const parsed = preferenceSchema.safeParse({
    request_id: formData.get("request_id"),
    change_type: formData.get("change_type"),
    notes: formData.get("notes") || undefined,
    target_tier: formData.get("target_tier") || undefined,
  });

  if (!parsed.success) {
    return { ok: false, error: "Invalid package preference." };
  }

  try {
    await recordClientPackagePreference(
      user,
      parsed.data.request_id,
      parsed.data.change_type as ClientPackageChangeType,
      parsed.data.notes ?? null,
      parsed.data.target_tier ?? null
    );
    revalidatePackagePaths(parsed.data.request_id);
    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Could not record package preference.",
    };
  }
}
