"use server";

import { revalidatePath } from "next/cache";
import { requireActionPlatformStaff } from "@/lib/auth/action-guard";
import { getCrowAuth, isPlatformStaff } from "@/lib/auth/roles";
import { getSessionUser } from "@/lib/auth/session";
import { requireActionTenantPolicy } from "@/lib/auth/tenant-policy-guard";
import { routes } from "@/lib/routes";
import {
  createTenantMembershipInvite,
  type CreateTenantMembershipInviteResult,
} from "@/lib/services/tenant-membership-invite.service";
import { getTenantById, getTenantBySlug } from "@/lib/services/tenant.service";
import {
  isTenantInviteRole,
  type TenantInviteRole,
  type TenantInviteSource,
} from "@/lib/tenant/tenant-membership-invite-contract";

export type TenantMembershipInviteState =
  | { error?: string; success?: string; result?: CreateTenantMembershipInviteResult }
  | undefined;

async function resolveInviteActor(tenantSlug: string): Promise<
  | { error: string }
  | { user: NonNullable<Awaited<ReturnType<typeof getSessionUser>>>; source: TenantInviteSource }
> {
  const user = await getSessionUser();
  if (!user) {
    return { error: "Sign in required." };
  }

  const { role } = getCrowAuth(user);
  if (isPlatformStaff(role)) {
    await requireActionPlatformStaff();
    return { user, source: "procrow_operator" };
  }

  try {
    const { decision } = await requireActionTenantPolicy(tenantSlug, "cem.users.invite");
    if (!decision.canManageTenantUsers) {
      return { error: "Tenant user management requires admin membership on this tenant." };
    }
    return { user, source: "tenant_admin" };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Not authorized to invite tenant members.",
    };
  }
}

export async function createTenantMembershipInviteAction(
  _prev: TenantMembershipInviteState,
  formData: FormData
): Promise<TenantMembershipInviteState> {
  const tenantId = String(formData.get("tenantId") ?? "").trim();
  const tenantSlugInput = String(formData.get("tenantSlug") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const roleRaw = String(formData.get("role") ?? "tenant_user");
  const note = String(formData.get("note") ?? "").trim() || undefined;
  const useSupabaseInviteApi = formData.get("useSupabaseInviteApi") === "on";

  if (!email) {
    return { error: "Email is required." };
  }
  if (!isTenantInviteRole(roleRaw)) {
    return { error: "Role must be tenant_user or tenant_admin." };
  }
  const role = roleRaw as TenantInviteRole;

  const tenant = tenantId
    ? await getTenantById(tenantId)
    : tenantSlugInput
      ? await getTenantBySlug(tenantSlugInput)
      : null;

  if (!tenant) {
    return { error: "Tenant not found." };
  }

  const actor = await resolveInviteActor(tenant.slug);
  if ("error" in actor) {
    return { error: actor.error };
  }

  try {
    const result = await createTenantMembershipInvite({
      tenantId: tenant.id,
      tenantSlug: tenant.slug,
      email,
      role,
      invitedBy: actor.user.id,
      invitedByEmail: actor.user.email ?? null,
      source: actor.source,
      note,
      useSupabaseInviteApi,
    });

    revalidatePath(routes.admin.tenant(tenant.id));
    revalidatePath(routes.admin.tenants);
    revalidatePath(routes.tenant(tenant.slug).users);

    return { success: result.message, result };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Failed to create tenant membership invite.",
    };
  }
}
