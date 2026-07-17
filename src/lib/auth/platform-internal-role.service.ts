import "@/lib/server-only-guard";

import type { PlatformInternalRole } from "@prisma/client";
import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/db";
import { findPlatformAccountById } from "@/lib/account/platform-account.service";
import {
  internalRoleToCrowRole,
  pickHighestInternalCrowRole,
} from "@/lib/auth/authority-boundaries";
import { hasPermission, type PermissionKey } from "@/lib/auth/permissions";
import type { CrowRole } from "@/lib/auth/roles";

export type GrantInternalPlatformRoleInput = {
  targetPlatformAccountId: string;
  role: PlatformInternalRole;
  grantorPlatformAccountId: string;
  reason: string;
  correlationId: string;
  auditSource?: string;
};

export type RevokeInternalPlatformRoleInput = {
  assignmentId: string;
  revokerPlatformAccountId: string;
  reason: string;
  correlationId: string;
};

export class PlatformInternalRoleError extends Error {
  constructor(
    message: string,
    readonly code:
      | "NOT_FOUND"
      | "FORBIDDEN"
      | "DUPLICATE_ACTIVE"
      | "ALREADY_REVOKED"
      | "GRANTOR_NOT_AUTHORIZED"
  ) {
    super(message);
    this.name = "PlatformInternalRoleError";
  }
}

export async function listActiveInternalPlatformRoles(
  platformAccountId: string
): Promise<PlatformInternalRole[]> {
  const rows = await prisma.platformInternalRoleAssignment.findMany({
    where: { platformAccountId, status: "ACTIVE" },
    select: { role: true },
  });
  return rows.map((row) => row.role);
}

export async function listActiveInternalRolesForSupabaseUser(
  supabaseUserId: string
): Promise<PlatformInternalRole[]> {
  const account = await prisma.platformAccount.findUnique({
    where: { supabaseUserId },
    select: { id: true },
  });
  if (!account) return [];
  return listActiveInternalPlatformRoles(account.id);
}

export async function resolveInternalPlatformCrowRole(
  supabaseUserId: string
): Promise<CrowRole | null> {
  const roles = await listActiveInternalRolesForSupabaseUser(supabaseUserId);
  return pickHighestInternalCrowRole(roles);
}

export async function resolveInternalPlatformPermissions(
  supabaseUserId: string
): Promise<PermissionKey[]> {
  const role = await resolveInternalPlatformCrowRole(supabaseUserId);
  if (!role) return [];
  const { Permission } = await import("@/lib/auth/permissions");
  const all = Object.values(Permission);
  return all.filter((permission) => hasPermission(role, permission));
}

export async function countActivePlatformAdmins(): Promise<number> {
  return prisma.platformInternalRoleAssignment.count({
    where: { role: "PLATFORM_ADMIN", status: "ACTIVE" },
  });
}

function grantorMayAssignRole(
  grantorRoles: readonly PlatformInternalRole[],
  targetRole: PlatformInternalRole
): boolean {
  if (grantorRoles.includes("PLATFORM_ADMIN")) return true;
  if (targetRole === "PLATFORM_ADMIN") return false;
  if (grantorRoles.includes("IMPLEMENTER")) {
    return targetRole === "SALES" || targetRole === "AUDITOR_READONLY";
  }
  return false;
}

async function recordInternalRoleAudit(
  platformAccountId: string,
  eventType: "platform_internal_role_granted" | "platform_internal_role_revoked",
  metadata: Record<string, unknown>
): Promise<void> {
  await prisma.platformAccountAuditEvent.create({
    data: {
      platformAccountId,
      eventType,
      metadata: metadata as Prisma.InputJsonValue,
    },
  });
}

export async function grantInternalPlatformRole(
  input: GrantInternalPlatformRoleInput
): Promise<{ assignmentId: string; idempotent: boolean }> {
  const [target, grantorRoles] = await Promise.all([
    findPlatformAccountById(input.targetPlatformAccountId),
    listActiveInternalPlatformRoles(input.grantorPlatformAccountId),
  ]);

  if (!target) {
    throw new PlatformInternalRoleError("Target platform account not found", "NOT_FOUND");
  }

  if (!grantorMayAssignRole(grantorRoles, input.role)) {
    throw new PlatformInternalRoleError(
      "Grantor lacks authority to assign this internal role",
      "GRANTOR_NOT_AUTHORIZED"
    );
  }

  const existingActive = await prisma.platformInternalRoleAssignment.findFirst({
    where: {
      platformAccountId: input.targetPlatformAccountId,
      role: input.role,
      status: "ACTIVE",
    },
    select: { id: true, grantCorrelationId: true },
  });

  if (existingActive?.grantCorrelationId === input.correlationId) {
    return { assignmentId: existingActive.id, idempotent: true };
  }

  if (existingActive) {
    throw new PlatformInternalRoleError(
      "Active assignment already exists for this account and role",
      "DUPLICATE_ACTIVE"
    );
  }

  try {
    const created = await prisma.platformInternalRoleAssignment.create({
      data: {
        platformAccountId: input.targetPlatformAccountId,
        role: input.role,
        status: "ACTIVE",
        grantReason: input.reason,
        grantCorrelationId: input.correlationId,
        grantedByPlatformAccountId: input.grantorPlatformAccountId,
      },
      select: { id: true },
    });

    await recordInternalRoleAudit(input.targetPlatformAccountId, "platform_internal_role_granted", {
      assignmentId: created.id,
      role: input.role,
      grantCorrelationId: input.correlationId,
      grantedByPlatformAccountId: input.grantorPlatformAccountId,
      crowRole: internalRoleToCrowRole(input.role),
      ...(input.auditSource ? { source: input.auditSource } : {}),
    });

    return { assignmentId: created.id, idempotent: false };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new PlatformInternalRoleError(
        "Active assignment already exists for this account and role",
        "DUPLICATE_ACTIVE"
      );
    }
    throw error;
  }
}

export async function revokeInternalPlatformRole(
  input: RevokeInternalPlatformRoleInput
): Promise<void> {
  const assignment = await prisma.platformInternalRoleAssignment.findUnique({
    where: { id: input.assignmentId },
    select: {
      id: true,
      status: true,
      role: true,
      platformAccountId: true,
    },
  });

  if (!assignment) {
    throw new PlatformInternalRoleError("Assignment not found", "NOT_FOUND");
  }

  if (assignment.status === "REVOKED") {
    throw new PlatformInternalRoleError("Assignment already revoked", "ALREADY_REVOKED");
  }

  const revokerRoles = await listActiveInternalPlatformRoles(input.revokerPlatformAccountId);
  if (!grantorMayAssignRole(revokerRoles, assignment.role)) {
    throw new PlatformInternalRoleError(
      "Revoker lacks authority to revoke this internal role",
      "GRANTOR_NOT_AUTHORIZED"
    );
  }

  await prisma.platformInternalRoleAssignment.update({
    where: { id: assignment.id },
    data: {
      status: "REVOKED",
      revokedAt: new Date(),
      revokedByPlatformAccountId: input.revokerPlatformAccountId,
      revokeReason: input.reason,
      revokeCorrelationId: input.correlationId,
    },
  });

  await recordInternalRoleAudit(assignment.platformAccountId, "platform_internal_role_revoked", {
    assignmentId: assignment.id,
    role: assignment.role,
    revokeCorrelationId: input.correlationId,
    revokedByPlatformAccountId: input.revokerPlatformAccountId,
  });
}
