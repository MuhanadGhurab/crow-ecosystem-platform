"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireActionPlatformStaff } from "@/lib/auth/action-guard";
import { getCrowAuth, isPlatformStaff } from "@/lib/auth/roles";
import { getSessionUser } from "@/lib/auth/session";
import { requireActionTenantPolicy } from "@/lib/auth/tenant-policy-guard";
import { routes } from "@/lib/routes";
import {
  acceptTenantInviteByToken,
  createTenantInviteToken,
  revokeTenantInvite,
} from "@/lib/services/tenant-invite-token.service";
import { getTenantById, getTenantBySlug } from "@/lib/services/tenant.service";
import type { CreateTenantInviteTokenResult } from "@/lib/tenant/tenant-invite-acceptance-contract";
import {
  isTenantInviteRole,
  type TenantInviteRole,
  type TenantInviteSource,
} from "@/lib/tenant/tenant-membership-invite-contract";

export type TenantInviteTokenState =
  | { error?: string; success?: string; result?: CreateTenantInviteTokenResult }
  | undefined;

export type TenantInviteAcceptState =
  | { error?: string; success?: string; redirectPath?: string }
  | undefined;

export type TenantInviteRevokeState = { error?: string; success?: string } | undefined;

async function resolveInviteActor(tenantSlug: string): Promise<
  | { error: string }
  | {
      user: NonNullable<Awaited<ReturnType<typeof getSessionUser>>>;
      source: TenantInviteSource;
    }
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

export async function createTenantInviteTokenAction(
  _prev: TenantInviteTokenState,
  formData: FormData
): Promise<TenantInviteTokenState> {
  const tenantId = String(formData.get("tenantId") ?? "").trim();
  const tenantSlugInput = String(formData.get("tenantSlug") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const roleRaw = String(formData.get("role") ?? "tenant_user");
  const note = String(formData.get("note") ?? "").trim() || undefined;
  const expiryDaysRaw = String(formData.get("expiryDays") ?? "7").trim();
  const expiryDays = Number.parseInt(expiryDaysRaw, 10);

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
    const result = await createTenantInviteToken({
      tenantId: tenant.id,
      email,
      role,
      invitedByUserId: actor.user.id,
      invitedByLabel: actor.user.email ?? actor.user.id,
      source: actor.source,
      expiryDays: Number.isFinite(expiryDays) ? expiryDays : undefined,
      operatorNote: note,
    });

    revalidatePath(routes.admin.tenant(tenant.id));
    revalidatePath(routes.admin.tenants);
    revalidatePath(routes.tenant(tenant.slug).users);

    return { success: result.message, result };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Failed to create tenant invite link.",
    };
  }
}

export async function acceptTenantInviteAction(
  _prev: TenantInviteAcceptState,
  formData: FormData
): Promise<TenantInviteAcceptState> {
  const token = String(formData.get("token") ?? "").trim();
  if (!token) {
    return { error: "Invite token is required." };
  }

  const user = await getSessionUser();
  if (!user?.email) {
    return { error: "Sign in with the invited email address to accept." };
  }

  try {
    const result = await acceptTenantInviteByToken(token, user.id, user.email);
    return {
      success: `Welcome to ${result.tenantName}. Business Portal access is active.`,
      redirectPath: result.redirectPath,
    };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Failed to accept invite.",
    };
  }
}

export async function acceptTenantInviteAndRedirectAction(
  _prev: TenantInviteAcceptState,
  formData: FormData
): Promise<TenantInviteAcceptState> {
  const state = await acceptTenantInviteAction(_prev, formData);
  if (state?.redirectPath && !state.error) {
    redirect(state.redirectPath);
  }
  return state;
}

export async function revokeTenantInviteAction(
  _prev: TenantInviteRevokeState,
  formData: FormData
): Promise<TenantInviteRevokeState> {
  const inviteId = String(formData.get("inviteId") ?? "").trim();
  const tenantId = String(formData.get("tenantId") ?? "").trim();
  const tenantSlug = String(formData.get("tenantSlug") ?? "").trim();

  if (!inviteId || !tenantId) {
    return { error: "Invite id and tenant are required." };
  }

  const tenant = await getTenantById(tenantId);
  if (!tenant) {
    return { error: "Tenant not found." };
  }

  const actor = await resolveInviteActor(tenantSlug || tenant.slug);
  if ("error" in actor) {
    return { error: actor.error };
  }

  try {
    await revokeTenantInvite(
      inviteId,
      tenant.id,
      actor.user.id,
      actor.user.email ?? actor.user.id,
      actor.source
    );

    revalidatePath(routes.admin.tenant(tenant.id));
    revalidatePath(routes.admin.tenants);
    revalidatePath(routes.tenant(tenant.slug).users);

    return { success: "Pending invite revoked." };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Failed to revoke invite.",
    };
  }
}
