"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireClientAccess } from "@/lib/auth/session";
import { getCrowAuth, isPlatformStaff } from "@/lib/auth/roles";
import {
  CLIENT_PORTAL_EMPLOYEE_BAND_VALUES,
} from "@/lib/client-portal/client-company-profile-fields";
import { routes } from "@/lib/routes";
import { prisma } from "@/lib/db";
import { resolveCanClientEditCompanyProfile } from "@/lib/services/client-company-edit.service";
import { buildClientPortalDashboardSnapshot } from "@/lib/services/client-portal.service";
import { resolveCompanyLinkStatusForRequest } from "@/lib/services/client-profile.service";
import { createClient } from "@/lib/supabase/server";
import { isAuthDisabled } from "@/lib/supabase/env";

const profileUpdateSchema = z.object({
  full_name: z.string().trim().min(1, "Display name is required").max(120),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  job_title: z.string().trim().max(80).optional().or(z.literal("")),
  preferred_language: z.string().trim().max(40).optional().or(z.literal("")),
});

export type ClientProfileUpdateResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

export async function updateClientProfileMetadata(
  _prev: ClientProfileUpdateResult | null,
  formData: FormData
): Promise<ClientProfileUpdateResult> {
  const user = await requireClientAccess(routes.client.profile);
  const { role } = getCrowAuth(user);

  if (isAuthDisabled()) {
    return { ok: false, error: "Profile editing is disabled in local auth bypass mode." };
  }

  if (isPlatformStaff(role)) {
    return {
      ok: false,
      error: "Platform staff cannot update client profile fields from the Client Portal.",
    };
  }

  const parsed = profileUpdateSchema.safeParse({
    full_name: formData.get("full_name"),
    phone: formData.get("phone") ?? "",
    job_title: formData.get("job_title") ?? "",
    preferred_language: formData.get("preferred_language") ?? "",
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string") fieldErrors[key] = issue.message;
    }
    return {
      ok: false,
      error: "Please fix the highlighted fields.",
      fieldErrors,
    };
  }

  const { full_name, phone, job_title, preferred_language } = parsed.data;
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    data: {
      full_name,
      phone: phone || undefined,
      job_title: job_title || undefined,
      preferred_language: preferred_language || undefined,
    },
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath(routes.client.profile);
  revalidatePath(routes.client.home);
  revalidatePath(routes.client.settings);

  return { ok: true };
}

const companySafeUpdateSchema = z.object({
  request_id: z.string().trim().min(1, "Request is required"),
  employee_band: z.enum(CLIENT_PORTAL_EMPLOYEE_BAND_VALUES, {
    errorMap: () => ({ message: "Select a valid employee band" }),
  }),
});

export type ClientCompanyUpdateResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

const CLIENT_COMPANY_SAFE_FIELD_KEYS = ["employeeBand"] as const;

/**
 * Update allowlisted company fields on the client's primary implementation request.
 * Does not mutate approval, proposal, tenant, or provisioning state.
 */
export async function updateClientCompanySafeFields(
  _prev: ClientCompanyUpdateResult | null,
  formData: FormData
): Promise<ClientCompanyUpdateResult> {
  const user = await requireClientAccess(routes.client.company);
  const { role } = getCrowAuth(user);

  if (isAuthDisabled()) {
    return { ok: false, error: "Company editing is disabled in local auth bypass mode." };
  }

  if (isPlatformStaff(role)) {
    return {
      ok: false,
      error: "Platform staff cannot update company profile fields from the Client Portal.",
    };
  }

  const parsed = companySafeUpdateSchema.safeParse({
    request_id: formData.get("request_id"),
    employee_band: formData.get("employee_band"),
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (key === "employee_band") fieldErrors.employee_band = issue.message;
      else if (key === "request_id") fieldErrors.request_id = issue.message;
    }
    return {
      ok: false,
      error: "Please fix the highlighted fields.",
      fieldErrors,
    };
  }

  const { request_id, employee_band } = parsed.data;

  const snapshot = await buildClientPortalDashboardSnapshot(user);

  const request = await prisma.implementationRequest.findUnique({
    where: { id: request_id },
    select: {
      id: true,
      submittedByUserId: true,
    },
  });

  if (!request) {
    return { ok: false, error: "Request not found." };
  }

  const linkStatus = resolveCompanyLinkStatusForRequest(
    snapshot.authState,
    request.submittedByUserId,
    user.id
  );

  const editDecision = await resolveCanClientEditCompanyProfile(
    user,
    request_id,
    snapshot.authState,
    linkStatus
  );

  if (!editDecision.canEdit) {
    return {
      ok: false,
      error: editDecision.blockedReason ?? "You cannot edit this company profile.",
    };
  }

  const data: Record<string, string> = {};
  for (const key of CLIENT_COMPANY_SAFE_FIELD_KEYS) {
    if (key === "employeeBand") data.employeeBand = employee_band;
  }

  await prisma.implementationRequest.update({
    where: { id: request_id },
    data,
  });

  revalidatePath(routes.client.company);
  revalidatePath(routes.client.home);
  revalidatePath(routes.client.profile);
  revalidatePath(routes.client.requests);
  revalidatePath(routes.client.request(request_id));

  return { ok: true };
}
