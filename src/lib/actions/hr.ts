"use server";

import { revalidatePath } from "next/cache";
import { requireActionTenantPolicy } from "@/lib/auth/tenant-policy-guard";
import { routes } from "@/lib/routes";
import { createHrEmployee, updateHrEmployee } from "@/lib/services/hr.service";
export type HrActionState = { error?: string; success?: string } | undefined;

export async function createHrEmployeeAction(
  _prev: HrActionState,
  formData: FormData
): Promise<HrActionState> {
  const slug = String(formData.get("tenantSlug") ?? "");
  let tenant;
  try {
    ({ tenant } = await requireActionTenantPolicy(slug, "cem.hr.write"));
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Not allowed." };
  }

  const fullName = String(formData.get("fullName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const jobTitle = String(formData.get("jobTitle") ?? "").trim() || undefined;
  const employeeNumber = String(formData.get("employeeNumber") ?? "").trim() || undefined;
  const departmentId = String(formData.get("departmentId") ?? "").trim() || undefined;
  const employmentStatus = String(formData.get("employmentStatus") ?? "active");

  if (!fullName || !email) {
    return { error: "Name and email are required." };
  }

  try {
    await createHrEmployee(tenant.id, {
      fullName,
      email,
      jobTitle,
      employeeNumber,
      departmentId,
      employmentStatus,
    });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to create employee." };
  }

  revalidatePath(routes.tenant(slug).hr);
  return { success: "Employee added." };
}

export async function updateHrEmployeeAction(
  _prev: HrActionState,
  formData: FormData
): Promise<HrActionState> {
  const slug = String(formData.get("tenantSlug") ?? "");
  const employeeId = String(formData.get("employeeId") ?? "");
  let tenant;
  try {
    ({ tenant } = await requireActionTenantPolicy(slug, "cem.hr.write"));
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Not allowed." };
  }

  const fullName = String(formData.get("fullName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const jobTitle = String(formData.get("jobTitle") ?? "").trim();
  const employmentStatus = String(formData.get("employmentStatus") ?? "active");

  if (!fullName || !email) {
    return { error: "Name and email are required." };
  }

  try {
    await updateHrEmployee(tenant.id, employeeId, {
      fullName,
      email,
      jobTitle: jobTitle || null,
      employmentStatus,
    });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to update employee." };
  }

  revalidatePath(routes.tenant(slug).hr);
  return { success: "Employee updated." };
}
