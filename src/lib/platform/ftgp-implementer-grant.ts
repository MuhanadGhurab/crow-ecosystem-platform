import "@/lib/server-only-guard";

import type { PlatformInternalRole } from "@prisma/client";
import { Prisma } from "@prisma/client";

import { findPlatformAccountById } from "@/lib/account/platform-account.service";
import { internalRoleToCrowRole } from "@/lib/auth/authority-boundaries";
import { prisma } from "@/lib/db";

export const FTGP_IMPLEMENTER_GRANT_REASON = "initial FTGP implementer operator grant";
export const FTGP_IMPLEMENTER_GRANT_SOURCE = "platform_admin_grant";

export type GrantFtgpImplementerInput = {
  targetPlatformAccountId: string;
  grantorPlatformAccountId: string;
  correlationId: string;
  reason?: string;
};

export type GrantFtgpImplementerResult = {
  assignmentId: string;
  idempotent: boolean;
  role: PlatformInternalRole;
};

export class FtgpImplementerGrantError extends Error {
  constructor(
    message: string,
    readonly code:
      | "NOT_FOUND"
      | "FORBIDDEN"
      | "DUPLICATE_ACTIVE"
      | "INVALID_CORRELATION"
      | "GRANTOR_NOT_AUTHORIZED"
  ) {
    super(message);
    this.name = "FtgpImplementerGrantError";
  }
}

export async function countActiveImplementerAssignments(): Promise<number> {
  return prisma.platformInternalRoleAssignment.count({
    where: { role: "IMPLEMENTER", status: "ACTIVE" },
  });
}

export async function countActivePlatformAdminAssignmentsForGrant(): Promise<number> {
  return prisma.platformInternalRoleAssignment.count({
    where: { role: "PLATFORM_ADMIN", status: "ACTIVE" },
  });
}

async function grantorHasPlatformAdmin(grantorPlatformAccountId: string): Promise<boolean> {
  const count = await prisma.platformInternalRoleAssignment.count({
    where: {
      platformAccountId: grantorPlatformAccountId,
      role: "PLATFORM_ADMIN",
      status: "ACTIVE",
    },
  });
  return count === 1;
}

export async function grantFtgpImplementerRole(
  input: GrantFtgpImplementerInput
): Promise<GrantFtgpImplementerResult> {
  const correlationId = input.correlationId.trim();
  if (correlationId.length < 8) {
    throw new FtgpImplementerGrantError(
      "Correlation ID must be at least 8 characters",
      "INVALID_CORRELATION"
    );
  }
  if (correlationId.includes("ftgp-first-platform-admin")) {
    throw new FtgpImplementerGrantError(
      "IMPLEMENTER grant must not reuse Platform Admin bootstrap correlation",
      "INVALID_CORRELATION"
    );
  }

  const activeAdmins = await countActivePlatformAdminAssignmentsForGrant();
  if (activeAdmins !== 1) {
    throw new FtgpImplementerGrantError(
      `Expected exactly one active Platform Admin grantor, got ${activeAdmins}`,
      "GRANTOR_NOT_AUTHORIZED"
    );
  }

  const target = await findPlatformAccountById(input.targetPlatformAccountId);
  if (!target) {
    throw new FtgpImplementerGrantError("Target platform account not found", "NOT_FOUND");
  }

  const grantorAuthorized = await grantorHasPlatformAdmin(input.grantorPlatformAccountId);
  if (!grantorAuthorized) {
    throw new FtgpImplementerGrantError(
      "Grantor lacks active PLATFORM_ADMIN assignment",
      "GRANTOR_NOT_AUTHORIZED"
    );
  }

  const existingActive = await prisma.platformInternalRoleAssignment.findFirst({
    where: {
      platformAccountId: input.targetPlatformAccountId,
      role: "IMPLEMENTER",
      status: "ACTIVE",
    },
    select: { id: true, grantCorrelationId: true },
  });

  if (existingActive?.grantCorrelationId === correlationId) {
    return { assignmentId: existingActive.id, idempotent: true, role: "IMPLEMENTER" };
  }

  if (existingActive) {
    throw new FtgpImplementerGrantError(
      "Active IMPLEMENTER assignment already exists for target",
      "DUPLICATE_ACTIVE"
    );
  }

  const reason = input.reason?.trim() || FTGP_IMPLEMENTER_GRANT_REASON;

  try {
    const created = await prisma.$transaction(async (tx) => {
      const assignment = await tx.platformInternalRoleAssignment.create({
        data: {
          platformAccountId: input.targetPlatformAccountId,
          role: "IMPLEMENTER",
          status: "ACTIVE",
          grantReason: reason,
          grantCorrelationId: correlationId,
          grantedByPlatformAccountId: input.grantorPlatformAccountId,
        },
        select: { id: true },
      });

      await tx.platformAccountAuditEvent.create({
        data: {
          platformAccountId: input.targetPlatformAccountId,
          eventType: "platform_internal_role_granted",
          metadata: {
            assignmentId: assignment.id,
            role: "IMPLEMENTER",
            grantCorrelationId: correlationId,
            grantedByPlatformAccountId: input.grantorPlatformAccountId,
            source: FTGP_IMPLEMENTER_GRANT_SOURCE,
            crowRole: internalRoleToCrowRole("IMPLEMENTER"),
          } as Prisma.InputJsonValue,
        },
      });

      return assignment;
    });

    return {
      assignmentId: created.id,
      idempotent: false,
      role: "IMPLEMENTER",
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      throw new FtgpImplementerGrantError(
        "Active IMPLEMENTER assignment already exists for target",
        "DUPLICATE_ACTIVE"
      );
    }
    throw error;
  }
}
