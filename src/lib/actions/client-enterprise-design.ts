"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireClientAccess } from "@/lib/auth/session";
import { findPlatformAccountBySupabaseUserId } from "@/lib/account/platform-account.service";
import type { ClientEnterpriseDesignDraft } from "@/lib/client-enterprise-design/types";
import {
  saveClientEnterpriseDesignDraftHosted,
  submitClientEnterpriseDesignHosted,
} from "@/lib/client-enterprise-design/persistence/client-design-discovery.service";
import { routes } from "@/lib/routes";

export type ClientEnterpriseDesignActionResult =
  | { ok: true; snapshotHash?: string; profileUpdatedAt?: string }
  | { ok: false; error: string };

const draftSchema = z.object({
  requestId: z.string().min(1),
  draftJson: z.string().min(2),
  expectedProfileUpdatedAt: z.string().optional(),
});

function revalidateDesign(requestId: string) {
  revalidatePath(routes.client.requestDiscoveryDesign(requestId));
  revalidatePath(routes.client.requestDiscoveryCompare(requestId));
  revalidatePath(routes.client.requestDiscoverySummary(requestId));
  revalidatePath(routes.client.request(requestId));
  revalidatePath(routes.admin.request(requestId));
}

export async function saveClientEnterpriseDesignAction(
  _prev: ClientEnterpriseDesignActionResult | null,
  formData: FormData,
): Promise<ClientEnterpriseDesignActionResult> {
  const user = await requireClientAccess();
  const account = await findPlatformAccountBySupabaseUserId(user.id);
  if (!account) return { ok: false, error: "Platform account required." };
  const parsed = draftSchema.safeParse({
    requestId: formData.get("requestId"),
    draftJson: formData.get("draftJson"),
    expectedProfileUpdatedAt: formData.get("expectedProfileUpdatedAt")?.toString(),
  });
  if (!parsed.success) return { ok: false, error: "Invalid design payload." };

  let draft: ClientEnterpriseDesignDraft;
  try {
    draft = JSON.parse(parsed.data.draftJson) as ClientEnterpriseDesignDraft;
  } catch {
    return { ok: false, error: "Malformed design JSON." };
  }

  try {
    const result = await saveClientEnterpriseDesignDraftHosted({
      supabaseUserId: user.id,
      platformAccountId: account.id,
      draft: { ...draft, status: "DRAFT" },
      expectedProfileUpdatedAt: parsed.data.expectedProfileUpdatedAt ?? null,
      ownerBrowserProofVerified: true,
    });
    revalidateDesign(parsed.data.requestId);
    return { ok: true, snapshotHash: result.snapshotHash, profileUpdatedAt: result.profileUpdatedAt };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Save failed.";
    if (msg.includes("profile_version_conflict")) {
      return { ok: false, error: "Your design was updated elsewhere. Refresh and review before saving." };
    }
    return { ok: false, error: msg };
  }
}

export async function submitClientEnterpriseDesignAction(
  _prev: ClientEnterpriseDesignActionResult | null,
  formData: FormData,
): Promise<ClientEnterpriseDesignActionResult> {
  const user = await requireClientAccess();
  const account = await findPlatformAccountBySupabaseUserId(user.id);
  if (!account) return { ok: false, error: "Platform account required." };
  const parsed = draftSchema.safeParse({
    requestId: formData.get("requestId"),
    draftJson: formData.get("draftJson"),
    expectedProfileUpdatedAt: formData.get("expectedProfileUpdatedAt")?.toString(),
  });
  if (!parsed.success) return { ok: false, error: "Invalid design payload." };

  let draft: ClientEnterpriseDesignDraft;
  try {
    draft = JSON.parse(parsed.data.draftJson) as ClientEnterpriseDesignDraft;
  } catch {
    return { ok: false, error: "Malformed design JSON." };
  }

  try {
    const result = await submitClientEnterpriseDesignHosted({
      supabaseUserId: user.id,
      platformAccountId: account.id,
      draft: { ...draft, status: "SUBMITTED" },
      expectedProfileUpdatedAt: parsed.data.expectedProfileUpdatedAt ?? null,
      ownerBrowserProofVerified: true,
    });
    revalidateDesign(parsed.data.requestId);
    return { ok: true, snapshotHash: result.snapshotHash };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Submit failed." };
  }
}
