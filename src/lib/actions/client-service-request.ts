"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireClientAccess } from "@/lib/auth/session";
import { routes } from "@/lib/routes";
import { createModernServiceRequest } from "@/lib/services/client-service-request.service";
import type { ClientServiceRequestBriefInput } from "@/lib/client-service-request/types";

export type SubmitClientServiceRequestResult =
  | { ok: true; requestId: string; referenceCode: string; duplicate: boolean }
  | { ok: false; error: string; code?: string };

export async function submitClientServiceRequestAction(
  input: ClientServiceRequestBriefInput,
): Promise<SubmitClientServiceRequestResult> {
  const user = await requireClientAccess(routes.client.requestNew);
  try {
    const result = await createModernServiceRequest(user, input);
    revalidatePath(routes.client.requests);
    revalidatePath(routes.client.home);
    return {
      ok: true,
      requestId: result.id,
      referenceCode: result.referenceCode,
      duplicate: result.duplicate,
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Request submission failed.";
    if (msg.includes("registration") || msg.includes("legal")) {
      return { ok: false, error: msg, code: "account_not_activated" };
    }
    if (msg.includes("Sign in")) {
      return { ok: false, error: msg, code: "auth_required" };
    }
    return { ok: false, error: msg, code: "submission_failed" };
  }
}

export async function submitAndRedirectToConfirmation(input: ClientServiceRequestBriefInput) {
  const result = await submitClientServiceRequestAction(input);
  if (!result.ok) return result;
  redirect(routes.client.requestConfirmation(result.requestId));
}
