import type { User } from "@supabase/supabase-js";
import { Permission, hasPermission, type PermissionKey } from "@/lib/auth/permissions";
import type { CrowRole } from "@/lib/auth/roles";
import { getCrowAuth, isPlatformStaff } from "@/lib/auth/roles";
import { prisma } from "@/lib/db";

export type CybercrowPolicyAction =
  | "cem.users.invite"
  | "cem.hr.write"
  | "cem.crm.write"
  | "cem.roles.manage"
  | "cem.workflows.manage";

const POLICY_TO_PERMISSION: Record<CybercrowPolicyAction, PermissionKey> = {
  "cem.users.invite": Permission["cem.users.manage"],
  "cem.hr.write": Permission["cem.hr.write"],
  "cem.crm.write": Permission["cem.crm.write"],
  "cem.roles.manage": Permission["cem.roles.manage"],
  "cem.workflows.manage": Permission["cem.workflows.manage"],
};

export function canPerformAction(role: CrowRole | null, action: CybercrowPolicyAction): boolean {
  if (!role) return false;
  if (isPlatformStaff(role)) return true;
  if (role === "auditor_readonly") return false;
  const perm = POLICY_TO_PERMISSION[action];
  return hasPermission(role, perm);
}

/** Throws if denied; logs denial to CyberCrow audit when tenantId provided. */
export async function assertCybercrowPolicy(
  tenantId: string,
  user: User,
  action: CybercrowPolicyAction
): Promise<void> {
  const { role } = getCrowAuth(user);
  if (canPerformAction(role, action)) return;

  await prisma.cybercrowAuditLog.create({
    data: {
      tenantId,
      actorId: user.id,
      action: "POLICY_DENIED",
      entityType: "policy",
      entityId: action,
      metadata: { role, email: user.email },
    },
  });

  throw new Error(`CyberCrow policy: ${role ?? "unknown"} cannot perform ${action}`);
}
