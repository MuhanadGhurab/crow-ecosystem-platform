"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireClientAccess } from "@/lib/auth/session";
import { CLIENT_PORTAL_EMPLOYEE_BAND_VALUES } from "@/lib/client-portal/client-company-profile-fields";
import { routes } from "@/lib/routes";
import {
  saveClientDiscoveryDraft,
  submitClientDiscoveryForReview,
} from "@/lib/services/client-discovery.service";

const listField = z
  .string()
  .optional()
  .transform((v) =>
    v
      ? v
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : undefined
  );

const draftSchema = z.object({
  request_id: z.string().trim().min(1),
  industry_template: z.string().trim().optional(),
  company_stage_template: z.enum(["startup", "growth", "enterprise"]).optional(),
  employee_band: z.enum(CLIENT_PORTAL_EMPLOYEE_BAND_VALUES).optional(),
  expected_users: z.string().trim().max(40).optional(),
  selected_modules: listField,
  selected_departments: listField,
  selected_roles: listField,
  selected_workflows: listField,
  security_preference: z.string().trim().max(500).optional(),
  sarea_preference: z.string().trim().max(500).optional(),
  notes: z.string().trim().max(2000).optional(),
});

export type ClientDiscoveryActionResult =
  | { ok: true }
  | { ok: false; error: string };

function revalidateClientDiscovery(requestId: string) {
  revalidatePath(routes.client.home);
  revalidatePath(routes.client.company);
  revalidatePath(routes.client.requests);
  revalidatePath(routes.client.request(requestId));
  revalidatePath(routes.client.requestDiscovery(requestId));
}

export async function saveClientDiscoveryDraftAction(
  _prev: ClientDiscoveryActionResult | null,
  formData: FormData
): Promise<ClientDiscoveryActionResult> {
  const requestId = String(formData.get("request_id") ?? "");
  const user = await requireClientAccess(routes.client.requestDiscovery(requestId));

  const moduleKeys = formData.getAll("selected_modules").map(String).filter(Boolean);

  const parsed = draftSchema.safeParse({
    request_id: formData.get("request_id"),
    industry_template: formData.get("industry_template") || undefined,
    company_stage_template: formData.get("company_stage_template") || undefined,
    employee_band: formData.get("employee_band") || undefined,
    expected_users: formData.get("expected_users") || undefined,
    selected_modules: moduleKeys.length > 0 ? moduleKeys.join(",") : undefined,
    selected_departments: formData.get("selected_departments") || undefined,
    selected_roles: formData.get("selected_roles") || undefined,
    selected_workflows: formData.get("selected_workflows") || undefined,
    security_preference: formData.get("security_preference") || undefined,
    sarea_preference: formData.get("sarea_preference") || undefined,
    notes: formData.get("notes") || undefined,
  });

  if (!parsed.success) {
    return { ok: false, error: "Please check your discovery inputs." };
  }

  const data = parsed.data;

  try {
    await saveClientDiscoveryDraft(user, {
      requestId: data.request_id,
      industryTemplate: data.industry_template,
      companyStageTemplate: data.company_stage_template,
      employeeBand: data.employee_band,
      expectedUsers: data.expected_users,
      selectedModules: data.selected_modules,
      selectedDepartments: data.selected_departments,
      selectedRoles: data.selected_roles,
      selectedWorkflows: data.selected_workflows,
      securityPreference: data.security_preference,
      sareaPreference: data.sarea_preference,
      notes: data.notes,
    });
    revalidateClientDiscovery(data.request_id);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Could not save discovery." };
  }
}

export async function submitClientDiscoveryForReviewAction(
  _prev: ClientDiscoveryActionResult | null,
  formData: FormData
): Promise<ClientDiscoveryActionResult> {
  const requestId = String(formData.get("request_id") ?? "");
  const user = await requireClientAccess(routes.client.requestDiscovery(requestId));

  try {
    await submitClientDiscoveryForReview(user, requestId);
    revalidateClientDiscovery(requestId);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Could not submit discovery." };
  }
}
