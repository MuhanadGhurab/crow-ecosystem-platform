"use server";

import { revalidatePath } from "next/cache";
import { requireActionTenantPolicy } from "@/lib/auth/tenant-policy-guard";
import { routes } from "@/lib/routes";
import {
  createCrmAccount,
  createCrmContact,
  updateCrmAccount,
  updateCrmContact,
} from "@/lib/services/crm.service";
import { getTenantBySlug } from "@/lib/services/tenant.service";

export type CrmActionState = { error?: string; success?: string } | undefined;

export async function createCrmAccountAction(
  _prev: CrmActionState,
  formData: FormData
): Promise<CrmActionState> {
  const slug = String(formData.get("tenantSlug") ?? "");
  try {
    await requireActionTenantPolicy(slug, "cem.crm.write");
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Policy denied." };
  }

  const tenant = await getTenantBySlug(slug);
  if (!tenant) return { error: "Tenant not found." };

  const name = String(formData.get("name") ?? "").trim();
  const industry = String(formData.get("industry") ?? "").trim() || undefined;
  const website = String(formData.get("website") ?? "").trim() || undefined;

  if (!name) return { error: "Account name is required." };

  try {
    await createCrmAccount(tenant.id, { name, industry, website });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to create account." };
  }

  revalidatePath(routes.tenant(slug).crm);
  return { success: "Account created." };
}

export async function createCrmContactAction(
  _prev: CrmActionState,
  formData: FormData
): Promise<CrmActionState> {
  const slug = String(formData.get("tenantSlug") ?? "");
  try {
    await requireActionTenantPolicy(slug, "cem.crm.write");
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Policy denied." };
  }

  const tenant = await getTenantBySlug(slug);
  if (!tenant) return { error: "Tenant not found." };

  const fullName = String(formData.get("fullName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim() || undefined;
  const phone = String(formData.get("phone") ?? "").trim() || undefined;
  const title = String(formData.get("title") ?? "").trim() || undefined;
  const accountId = String(formData.get("accountId") ?? "").trim() || undefined;

  if (!fullName) return { error: "Contact name is required." };

  try {
    await createCrmContact(tenant.id, { fullName, email, phone, title, accountId });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to create contact." };
  }

  revalidatePath(routes.tenant(slug).crm);
  return { success: "Contact created." };
}

export async function updateCrmAccountAction(
  _prev: CrmActionState,
  formData: FormData
): Promise<CrmActionState> {
  const slug = String(formData.get("tenantSlug") ?? "");
  const accountId = String(formData.get("accountId") ?? "");
  try {
    await requireActionTenantPolicy(slug, "cem.crm.write");
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Policy denied." };
  }

  const tenant = await getTenantBySlug(slug);
  if (!tenant) return { error: "Tenant not found." };

  const name = String(formData.get("name") ?? "").trim();
  const status = String(formData.get("status") ?? "active");

  if (!name) return { error: "Account name is required." };

  try {
    await updateCrmAccount(tenant.id, accountId, { name, status });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to update account." };
  }

  revalidatePath(routes.tenant(slug).crm);
  return { success: "Account updated." };
}

export async function updateCrmContactAction(
  _prev: CrmActionState,
  formData: FormData
): Promise<CrmActionState> {
  const slug = String(formData.get("tenantSlug") ?? "");
  const contactId = String(formData.get("contactId") ?? "");
  try {
    await requireActionTenantPolicy(slug, "cem.crm.write");
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Policy denied." };
  }

  const tenant = await getTenantBySlug(slug);
  if (!tenant) return { error: "Tenant not found." };

  const fullName = String(formData.get("fullName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();

  if (!fullName) return { error: "Contact name is required." };

  try {
    await updateCrmContact(tenant.id, contactId, {
      fullName,
      email: email || null,
      title: title || null,
    });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to update contact." };
  }

  revalidatePath(routes.tenant(slug).crm);
  return { success: "Contact updated." };
}
