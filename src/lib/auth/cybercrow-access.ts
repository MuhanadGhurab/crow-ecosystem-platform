import { Permission, hasPermission } from "@/lib/auth/permissions";
import { getCrowAuth } from "@/lib/auth/roles";
import { requireTenantAccess } from "@/lib/auth/session";

export async function canManageCybercrowIncidents(slug: string): Promise<boolean> {
  const user = await requireTenantAccess(slug);
  const { role } = getCrowAuth(user);
  return hasPermission(role, Permission["cybercrow.incidents.manage"]);
}
