"use server";

import { revalidatePath } from "next/cache";
import { requireActionTenantPolicy } from "@/lib/auth/tenant-policy-guard";
import { routes } from "@/lib/routes";
import { assignProfileRole, removeProfileRole } from "@/lib/services/tenant-role.service";

export type TenantRoleActionState = { error?: string; success?: string } | undefined;

export async function assignProfileRoleAction(
  _prev: TenantRoleActionState,
  formData: FormData
): Promise<TenantRoleActionState> {
  const slug = String(formData.get("tenantSlug") ?? "");
  const profileId = String(formData.get("profileId") ?? "");
  const roleId = String(formData.get("roleId") ?? "");

  if (!slug || !profileId || !roleId) {
    return { error: "Profile and role are required." };
  }

  try {
    const { tenant, user } = await requireActionTenantPolicy(slug, "cem.roles.manage");
    const result = await assignProfileRole(tenant.id, user, profileId, roleId);
    revalidatePath(routes.tenant(slug).users);
    revalidatePath(routes.tenant(slug).roles);
    revalidatePath(routes.tenant(slug).cybercrow.auditLogs);

    if (result.alreadyAssigned) {
      return { success: `${result.profile.fullName} already has the ${result.role.name} role.` };
    }
    return { success: `Assigned ${result.role.name} to ${result.profile.fullName}.` };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to assign role." };
  }
}

export async function removeProfileRoleAction(
  _prev: TenantRoleActionState,
  formData: FormData
): Promise<TenantRoleActionState> {
  const slug = String(formData.get("tenantSlug") ?? "");
  const profileId = String(formData.get("profileId") ?? "");
  const roleId = String(formData.get("roleId") ?? "");

  if (!slug || !profileId || !roleId) {
    return { error: "Profile and role are required." };
  }

  try {
    const { tenant, user } = await requireActionTenantPolicy(slug, "cem.roles.manage");
    const { profile, role } = await removeProfileRole(tenant.id, user, profileId, roleId);
    revalidatePath(routes.tenant(slug).users);
    revalidatePath(routes.tenant(slug).roles);
    revalidatePath(routes.tenant(slug).cybercrow.auditLogs);
    return { success: `Removed ${role.name} from ${profile.fullName}.` };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to remove role." };
  }
}
