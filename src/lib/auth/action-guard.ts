import { Permission, type PermissionKey } from "@/lib/auth/permissions";
import {
  requirePermission,
  requirePlatformStaff,
  requireTenantAccess,
} from "@/lib/auth/session";

/** Call at the start of platform server actions (admin, discovery, blueprint). */
export async function requireActionPlatformStaff() {
  await requirePlatformStaff();
}

/** Discovery / blueprint mutations — implementation staff only. */
export async function requireActionDiscoveryWrite() {
  await requirePermission(Permission["platform.discovery.write"]);
}

/** Go-live provision — platform_admin + implementer only. */
export async function requireActionBlueprintProvision() {
  await requirePermission(Permission["platform.blueprint.provision"]);
}

export async function requireActionPermission(permission: PermissionKey) {
  await requirePermission(permission);
}

/** Call at the start of tenant-scoped server actions. */
export async function requireActionTenantAccess(slug: string) {
  await requireTenantAccess(slug);
}
