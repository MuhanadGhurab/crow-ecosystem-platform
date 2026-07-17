import "@/lib/server-only-guard";

import type { PlatformInternalRole } from "@prisma/client";
import { Prisma } from "@prisma/client";

import { findPlatformAccountById } from "@/lib/account/platform-account.service";
import { internalRoleToCrowRole } from "@/lib/auth/authority-boundaries";
import { prisma } from "@/lib/db";

export const INITIAL_PLATFORM_ADMIN_BOOTSTRAP_REASON =
  "initial authoritative Crow platform-owner bootstrap";

export const INITIAL_PLATFORM_ADMIN_BOOTSTRAP_SOURCE = "initial_system_bootstrap";

export type GrantInitialPlatformAdminBootstrapInput = {
  targetPlatformAccountId: string;
  correlationId: string;
  reason?: string;
};

export type GrantInitialPlatformAdminBootstrapResult = {
  assignmentId: string;
  idempotent: boolean;
  role: PlatformInternalRole;
};

export class PlatformAdminBootstrapError extends Error {
  constructor(
    message: string,
    readonly code:
      | "NOT_FOUND"
      | "DUPLICATE_ACTIVE"
      | "EXISTING_PLATFORM_ADMIN"
      | "INVALID_CORRELATION"
  ) {
    super(message);
    this.name = "PlatformAdminBootstrapError";
  }
}

export async function countActivePlatformAdminAssignments(): Promise<number> {
  return prisma.platformInternalRoleAssignment.count({
    where: { role: "PLATFORM_ADMIN", status: "ACTIVE" },
  });
}

/**
 * First authoritative Platform Admin bootstrap — no human grantor; provenance is system bootstrap.
 * `grantedByPlatformAccountId` is the target (self-bootstrap row) to satisfy FK without inventing a grantor account.
 */
export async function grantInitialPlatformAdminBootstrap(
  input: GrantInitialPlatformAdminBootstrapInput
): Promise<GrantInitialPlatformAdminBootstrapResult> {
  const correlationId = input.correlationId.trim();
  if (correlationId.length < 8) {
    throw new PlatformAdminBootstrapError(
      "Correlation ID must be at least 8 characters",
      "INVALID_CORRELATION"
    );
  }

  const target = await findPlatformAccountById(input.targetPlatformAccountId);
  if (!target) {
    throw new PlatformAdminBootstrapError("Target platform account not found", "NOT_FOUND");
  }

  const existingByCorrelation = await prisma.platformInternalRoleAssignment.findFirst({
    where: {
      grantCorrelationId: correlationId,
      role: "PLATFORM_ADMIN",
    },
    select: { id: true, status: true, platformAccountId: true },
  });

  if (existingByCorrelation) {
    if (
      existingByCorrelation.platformAccountId !== input.targetPlatformAccountId ||
      existingByCorrelation.status !== "ACTIVE"
    ) {
      throw new PlatformAdminBootstrapError(
        "Correlation ID already used for a different bootstrap outcome",
        "DUPLICATE_ACTIVE"
      );
    }
    return {
      assignmentId: existingByCorrelation.id,
      idempotent: true,
      role: "PLATFORM_ADMIN",
    };
  }

  const activeAdmins = await countActivePlatformAdminAssignments();
  if (activeAdmins > 0) {
    throw new PlatformAdminBootstrapError(
      "An active Platform Admin assignment already exists",
      "EXISTING_PLATFORM_ADMIN"
    );
  }

  const conflictingActive = await prisma.platformInternalRoleAssignment.findFirst({
    where: {
      platformAccountId: input.targetPlatformAccountId,
      role: "PLATFORM_ADMIN",
      status: "ACTIVE",
    },
    select: { id: true, grantCorrelationId: true },
  });

  if (conflictingActive) {
    throw new PlatformAdminBootstrapError(
      "Active PLATFORM_ADMIN assignment already exists for target",
      "DUPLICATE_ACTIVE"
    );
  }

  const reason = input.reason?.trim() || INITIAL_PLATFORM_ADMIN_BOOTSTRAP_REASON;

  const created = await prisma.$transaction(async (tx) => {
    const assignment = await tx.platformInternalRoleAssignment.create({
      data: {
        platformAccountId: input.targetPlatformAccountId,
        role: "PLATFORM_ADMIN",
        status: "ACTIVE",
        grantReason: reason,
        grantCorrelationId: correlationId,
        grantedByPlatformAccountId: input.targetPlatformAccountId,
      },
      select: { id: true },
    });

    await tx.platformAccountAuditEvent.create({
      data: {
        platformAccountId: input.targetPlatformAccountId,
        eventType: "platform_internal_role_granted",
        metadata: {
          assignmentId: assignment.id,
          role: "PLATFORM_ADMIN",
          grantCorrelationId: correlationId,
          grantedByPlatformAccountId: input.targetPlatformAccountId,
          source: INITIAL_PLATFORM_ADMIN_BOOTSTRAP_SOURCE,
          crowRole: internalRoleToCrowRole("PLATFORM_ADMIN"),
          bootstrap: true,
        } as Prisma.InputJsonValue,
      },
    });

    return assignment;
  });

  return {
    assignmentId: created.id,
    idempotent: false,
    role: "PLATFORM_ADMIN",
  };
}
