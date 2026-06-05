"use server";

import { revalidatePath } from "next/cache";
import { requireActionPlatformStaff } from "@/lib/auth/action-guard";
import { routes } from "@/lib/routes";
import {
  grantTenantAccessByEmail,
  inviteAndGrantTenantAccess,
  promoteClientToTenantUserByEmail,
} from "@/lib/services/membership.service";
import { getTenantById } from "@/lib/services/tenant.service";
import { requireActionTenantPolicy } from "@/lib/auth/tenant-policy-guard";
import type { CrowRole } from "@/lib/auth/roles";

export type GrantAccessState = { error?: string; success?: string } | undefined;

export async function grantTenantAccessAction(
  _prev: GrantAccessState,
  formData: FormData
): Promise<GrantAccessState> {
  await requireActionPlatformStaff();

  const tenantId = String(formData.get("tenantId") ?? "");
  const email = String(formData.get("email") ?? "").trim();
  const role = String(formData.get("role") ?? "tenant_admin") as Extract<
    CrowRole,
    "tenant_admin" | "tenant_user"
  >;
  const inviteIfMissing = formData.get("inviteIfMissing") === "on";

  if (!tenantId || !email) {
    return { error: "Tenant and email are required." };
  }

  const tenant = await getTenantById(tenantId);
  if (!tenant) {
    return { error: "Tenant not found." };
  }

  try {
    if (inviteIfMissing) {
      await inviteAndGrantTenantAccess(email, tenantId, tenant.slug, role);
    } else {
      await grantTenantAccessByEmail(email, tenantId, tenant.slug, role);
    }
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to grant access." };
  }

  revalidatePath(routes.admin.tenant(tenantId));
  revalidatePath(routes.admin.tenants);
  const verb = inviteIfMissing ? "invited to" : "granted access to";
  return { success: `${email} ${verb} /${tenant.slug} as ${role}.` };
}

export async function inviteTenantUserAction(
  _prev: GrantAccessState,
  formData: FormData
): Promise<GrantAccessState> {
  const slug = String(formData.get("tenantSlug") ?? "");
  const email = String(formData.get("email") ?? "").trim();
  const role = String(formData.get("role") ?? "tenant_user") as Extract<
    CrowRole,
    "tenant_admin" | "tenant_user"
  >;

  if (!slug || !email) {
    return { error: "Email is required." };
  }

  try {
    const { tenant } = await requireActionTenantPolicy(slug, "cem.users.invite");
    await inviteAndGrantTenantAccess(email, tenant.id, tenant.slug, role);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to invite user." };
  }

  revalidatePath(routes.tenant(slug).users);
  return {
    success: `${email} membership prepared for /${slug} as ${role}. Crow does not send email in this phase — confirm Supabase Auth delivery if needed.`,
  };
}

export async function promoteClientToTenantAction(
  _prev: GrantAccessState,
  formData: FormData
): Promise<GrantAccessState> {
  await requireActionPlatformStaff();

  const tenantId = String(formData.get("tenantId") ?? "");
  const email = String(formData.get("email") ?? "").trim();
  const role = String(formData.get("role") ?? "tenant_user") as Extract<
    CrowRole,
    "tenant_admin" | "tenant_user"
  >;

  if (!tenantId || !email) {
    return { error: "Tenant and contact email are required." };
  }

  const tenant = await getTenantById(tenantId);
  if (!tenant) {
    return { error: "Tenant not found." };
  }

  try {
    await promoteClientToTenantUserByEmail(email, tenantId, tenant.slug, role);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to promote client." };
  }

  revalidatePath(routes.admin.tenant(tenantId));
  revalidatePath(routes.admin.tenants);
  return {
    success: `${email} promoted to /${tenant.slug} as ${role} (same Microsoft login).`,
  };
}
