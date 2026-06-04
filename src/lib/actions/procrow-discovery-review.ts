"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireActionDiscoveryWrite } from "@/lib/auth/action-guard";
import { routes } from "@/lib/routes";
import {
  PROCROW_DISCOVERY_CHANGE_SECTION_ALLOWLIST,
  MAX_PROCROW_DISCOVERY_CHANGE_MESSAGE_LENGTH,
} from "@/lib/procrow/procrow-discovery-review-contract";
import type { ClientDiscoveryStep } from "@/lib/client-portal/client-discovery-contract";
import {
  acceptClientDiscoveryIntoBlueprint,
  requestClientDiscoveryChanges,
  startProCrowDiscoveryReview,
} from "@/lib/services/procrow-discovery-review.service";
import { requirePlatformStaff } from "@/lib/auth/session";

export type ProcrowDiscoveryReviewActionResult =
  | { ok: true }
  | { ok: false; error: string };

const requestIdSchema = z.string().trim().min(1);

const changeRequestSchema = z.object({
  request_id: z.string().trim().min(1),
  message: z.string().trim().min(1).max(MAX_PROCROW_DISCOVERY_CHANGE_MESSAGE_LENGTH),
  sections: z
    .string()
    .optional()
    .transform((v) =>
      v
        ? v
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : []
    ),
});

function revalidateProcrowDiscovery(requestId: string) {
  revalidatePath(routes.admin.requests);
  revalidatePath(routes.admin.request(requestId));
  revalidatePath(routes.client.request(requestId));
  revalidatePath(routes.client.requestDiscovery(requestId));
  revalidatePath(routes.discovery(requestId).organization);
}

function parseAllowedSections(raw: string[]): ClientDiscoveryStep[] {
  const allow = new Set(
    PROCROW_DISCOVERY_CHANGE_SECTION_ALLOWLIST as readonly string[]
  );
  return raw.filter((s): s is ClientDiscoveryStep => allow.has(s));
}

export async function startProCrowDiscoveryReviewAction(
  _prev: ProcrowDiscoveryReviewActionResult | null,
  formData: FormData
): Promise<ProcrowDiscoveryReviewActionResult> {
  const user = await requirePlatformStaff();
  await requireActionDiscoveryWrite();

  const parsed = requestIdSchema.safeParse(formData.get("request_id"));
  if (!parsed.success) {
    return { ok: false, error: "Invalid request." };
  }

  try {
    await startProCrowDiscoveryReview(user, parsed.data);
    revalidateProcrowDiscovery(parsed.data);
    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Could not start review.",
    };
  }
}

export async function requestClientDiscoveryChangesAction(
  _prev: ProcrowDiscoveryReviewActionResult | null,
  formData: FormData
): Promise<ProcrowDiscoveryReviewActionResult> {
  const user = await requirePlatformStaff();
  await requireActionDiscoveryWrite();

  const sectionList = formData.getAll("sections").map(String).filter(Boolean);
  const sectionsCsv = sectionList.length > 0 ? sectionList.join(",") : formData.get("sections");

  const parsed = changeRequestSchema.safeParse({
    request_id: formData.get("request_id"),
    message: formData.get("message"),
    sections: sectionsCsv || undefined,
  });

  if (!parsed.success) {
    return { ok: false, error: "Please provide a change request message and sections." };
  }

  const sections = parseAllowedSections(
    sectionList.length > 0 ? sectionList : parsed.data.sections
  );
  if (sections.length === 0) {
    return { ok: false, error: "Select at least one section for the client to revise." };
  }

  try {
    await requestClientDiscoveryChanges(
      user,
      parsed.data.request_id,
      parsed.data.message,
      sections
    );
    revalidateProcrowDiscovery(parsed.data.request_id);
    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Could not request changes.",
    };
  }
}

export async function acceptClientDiscoveryIntoBlueprintAction(
  _prev: ProcrowDiscoveryReviewActionResult | null,
  formData: FormData
): Promise<ProcrowDiscoveryReviewActionResult> {
  const user = await requirePlatformStaff();
  await requireActionDiscoveryWrite();

  const parsed = requestIdSchema.safeParse(formData.get("request_id"));
  if (!parsed.success) {
    return { ok: false, error: "Invalid request." };
  }

  try {
    await acceptClientDiscoveryIntoBlueprint(user, parsed.data);
    revalidateProcrowDiscovery(parsed.data);
    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Could not accept discovery.",
    };
  }
}
