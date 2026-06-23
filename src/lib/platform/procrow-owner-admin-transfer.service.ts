/**
 * PROCROW.ADMIN.1 — Atomic sole PLATFORM_ADMIN transfer (database-backed).
 */
import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/db";
import { findPlatformAccountById } from "@/lib/account/platform-account.service";
import { internalRoleToCrowRole } from "@/lib/auth/authority-boundaries";
import {
  PROCROW_OWNER_ADMIN_TRANSFER_CORRELATION_ID,
  PROCROW_OWNER_ADMIN_TRANSFER_REASON,
  PROCROW_OWNER_ADMIN_TRANSFER_SOURCE,
  procrowOwnerAdminAssignmentFingerprint,
  procrowOwnerAdminTargetFingerprint,
} from "@/lib/platform/procrow-owner-admin-transfer.constants";

export type ProcrowOwnerAdminTransferType =
  | "IDEMPOTENT_NO_OP"
  | "ATOMIC_SINGLE_ADMIN_TRANSFER";

export type ProcrowOwnerAdminTransferPlan = {
  transferType: ProcrowOwnerAdminTransferType;
  currentAdminAccountId: string;
  currentAdminAssignmentId: string;
  currentAdminFingerprint: string;
  targetAccountId: string;
  targetFingerprint: string;
  correlationId: string;
  assignmentCreates: number;
  assignmentRevokes: number;
  auditEvents: number;
};

export type ProcrowOwnerAdminTransferResult = {
  transferType: ProcrowOwnerAdminTransferType;
  targetAssignmentId: string | null;
  revokedAssignmentId: string | null;
  idempotent: boolean;
};

export async function findActivePlatformAdminAssignment(): Promise<{
  assignmentId: string;
  platformAccountId: string;
  fingerprint: string;
} | null> {
  const rows = await prisma.platformInternalRoleAssignment.findMany({
    where: { role: "PLATFORM_ADMIN", status: "ACTIVE" },
    select: { id: true, platformAccountId: true },
  });
  if (rows.length !== 1) return null;
  const row = rows[0]!;
  return {
    assignmentId: row.id,
    platformAccountId: row.platformAccountId,
    fingerprint: procrowOwnerAdminTargetFingerprint(row.platformAccountId),
  };
}

export async function planProcrowOwnerAdminTransfer(
  targetAccountId: string,
  expectedCurrentAdminFingerprint?: string,
  expectedTargetFingerprint?: string
): Promise<ProcrowOwnerAdminTransferPlan> {
  const current = await findActivePlatformAdminAssignment();
  if (!current) {
    throw new Error("Expected exactly one active PLATFORM_ADMIN before transfer");
  }

  const target = await findPlatformAccountById(targetAccountId);
  if (!target) {
    throw new Error("Target platform account not found");
  }

  const targetFingerprint = procrowOwnerAdminTargetFingerprint(targetAccountId);
  if (expectedTargetFingerprint && targetFingerprint !== expectedTargetFingerprint) {
    throw new Error("Target fingerprint mismatch");
  }
  if (
    expectedCurrentAdminFingerprint &&
    current.fingerprint !== expectedCurrentAdminFingerprint
  ) {
    throw new Error("Current admin fingerprint mismatch");
  }

  if (current.platformAccountId === targetAccountId) {
    return {
      transferType: "IDEMPOTENT_NO_OP",
      currentAdminAccountId: current.platformAccountId,
      currentAdminAssignmentId: current.assignmentId,
      currentAdminFingerprint: current.fingerprint,
      targetAccountId,
      targetFingerprint,
      correlationId: PROCROW_OWNER_ADMIN_TRANSFER_CORRELATION_ID,
      assignmentCreates: 0,
      assignmentRevokes: 0,
      auditEvents: 0,
    };
  }

  const targetExisting = await prisma.platformInternalRoleAssignment.findFirst({
    where: {
      platformAccountId: targetAccountId,
      role: "PLATFORM_ADMIN",
      status: "ACTIVE",
    },
    select: { id: true },
  });
  if (targetExisting) {
    throw new Error("Target already holds a different active PLATFORM_ADMIN assignment");
  }

  return {
    transferType: "ATOMIC_SINGLE_ADMIN_TRANSFER",
    currentAdminAccountId: current.platformAccountId,
    currentAdminAssignmentId: current.assignmentId,
    currentAdminFingerprint: current.fingerprint,
    targetAccountId,
    targetFingerprint,
    correlationId: PROCROW_OWNER_ADMIN_TRANSFER_CORRELATION_ID,
    assignmentCreates: 1,
    assignmentRevokes: 1,
    auditEvents: 2,
  };
}

export async function executeProcrowOwnerAdminTransfer(
  targetAccountId: string,
  expectedCurrentAdminFingerprint?: string,
  expectedTargetFingerprint?: string
): Promise<ProcrowOwnerAdminTransferResult> {
  const plan = await planProcrowOwnerAdminTransfer(
    targetAccountId,
    expectedCurrentAdminFingerprint,
    expectedTargetFingerprint
  );

  if (plan.transferType === "IDEMPOTENT_NO_OP") {
    return {
      transferType: plan.transferType,
      targetAssignmentId: plan.currentAdminAssignmentId,
      revokedAssignmentId: null,
      idempotent: true,
    };
  }

  const result = await prisma.$transaction(async (tx) => {
    const activeAdmins = await tx.platformInternalRoleAssignment.count({
      where: { role: "PLATFORM_ADMIN", status: "ACTIVE" },
    });
    if (activeAdmins !== 1) {
      throw new Error(`Pre-transfer admin count must be 1, got ${activeAdmins}`);
    }

    const currentAssignment = await tx.platformInternalRoleAssignment.findUnique({
      where: { id: plan.currentAdminAssignmentId },
      select: { id: true, platformAccountId: true, status: true, role: true },
    });
    if (!currentAssignment || currentAssignment.status !== "ACTIVE") {
      throw new Error("Current PLATFORM_ADMIN assignment is not active");
    }
    if (currentAssignment.platformAccountId !== plan.currentAdminAccountId) {
      throw new Error("Current admin assignment account mismatch");
    }

    const targetConflict = await tx.platformInternalRoleAssignment.findFirst({
      where: {
        platformAccountId: plan.targetAccountId,
        role: "PLATFORM_ADMIN",
        status: "ACTIVE",
      },
      select: { id: true },
    });
    if (targetConflict) {
      throw new Error("Target already has active PLATFORM_ADMIN during transfer");
    }

    const grant = await tx.platformInternalRoleAssignment.create({
      data: {
        platformAccountId: plan.targetAccountId,
        role: "PLATFORM_ADMIN",
        status: "ACTIVE",
        grantReason: PROCROW_OWNER_ADMIN_TRANSFER_REASON,
        grantCorrelationId: plan.correlationId,
        grantedByPlatformAccountId: plan.currentAdminAccountId,
      },
      select: { id: true },
    });

    await tx.platformAccountAuditEvent.create({
      data: {
        platformAccountId: plan.targetAccountId,
        eventType: "platform_internal_role_granted",
        metadata: {
          assignmentId: grant.id,
          role: "PLATFORM_ADMIN",
          grantCorrelationId: plan.correlationId,
          grantedByPlatformAccountId: plan.currentAdminAccountId,
          source: PROCROW_OWNER_ADMIN_TRANSFER_SOURCE,
          crowRole: internalRoleToCrowRole("PLATFORM_ADMIN"),
          transfer: true,
        } as Prisma.InputJsonValue,
      },
    });

    await tx.platformInternalRoleAssignment.update({
      where: { id: plan.currentAdminAssignmentId },
      data: {
        status: "REVOKED",
        revokedAt: new Date(),
        revokedByPlatformAccountId: plan.currentAdminAccountId,
        revokeReason: PROCROW_OWNER_ADMIN_TRANSFER_REASON,
        revokeCorrelationId: plan.correlationId,
      },
    });

    await tx.platformAccountAuditEvent.create({
      data: {
        platformAccountId: plan.currentAdminAccountId,
        eventType: "platform_internal_role_revoked",
        metadata: {
          assignmentId: plan.currentAdminAssignmentId,
          role: "PLATFORM_ADMIN",
          revokeCorrelationId: plan.correlationId,
          revokedByPlatformAccountId: plan.currentAdminAccountId,
          source: PROCROW_OWNER_ADMIN_TRANSFER_SOURCE,
          transfer: true,
        } as Prisma.InputJsonValue,
      },
    });

    const postCount = await tx.platformInternalRoleAssignment.count({
      where: { role: "PLATFORM_ADMIN", status: "ACTIVE" },
    });
    if (postCount !== 1) {
      throw new Error(`Post-transfer admin count must be 1, got ${postCount}`);
    }

    const sole = await tx.platformInternalRoleAssignment.findFirst({
      where: { role: "PLATFORM_ADMIN", status: "ACTIVE" },
      select: { platformAccountId: true },
    });
    if (sole?.platformAccountId !== plan.targetAccountId) {
      throw new Error("Post-transfer sole admin is not the designated target");
    }

    return {
      transferType: plan.transferType,
      targetAssignmentId: grant.id,
      revokedAssignmentId: plan.currentAdminAssignmentId,
      idempotent: false,
    };
  });

  return {
    ...result,
    transferType: plan.transferType,
  };
}

export function assignmentFingerprintForTests(assignmentId: string): string {
  return procrowOwnerAdminAssignmentFingerprint(assignmentId);
}
