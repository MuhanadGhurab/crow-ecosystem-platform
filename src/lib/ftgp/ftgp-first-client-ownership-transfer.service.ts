/**
 * FTGP.CLIENT.1 — Atomic Candidate 07 ownership transfer (database-backed).
 */
import type { Prisma } from "@prisma/client";

import { findPlatformAccountById } from "@/lib/account/platform-account.service";
import { prisma, prismaTransaction } from "@/lib/db";
import {
  FTGP_FIRST_CLIENT_OWNERSHIP_TRANSFER_CORRELATION_ID,
  FTGP_FIRST_CLIENT_OWNERSHIP_TRANSFER_REASON,
  FTGP_FIRST_CLIENT_OWNERSHIP_TRANSFER_SOURCE,
} from "@/lib/ftgp/ftgp-first-client-ownership.constants";
import { hasMandatoryLegalAcceptanceComplete } from "@/lib/legal/legal-acceptance.service";
import { createHash } from "node:crypto";

export type FtgpFirstClientOwnershipTransferType =
  | "IDEMPOTENT_NO_OP"
  | "ATOMIC_CANDIDATE_OWNER_TRANSFER";

export type FtgpFirstClientOwnershipTransferPlan = {
  transferType: FtgpFirstClientOwnershipTransferType;
  requestId: string;
  requestFingerprint: string;
  currentOwnerSupabaseUserId: string | null;
  currentOwnerFingerprint: string | null;
  targetAccountId: string;
  targetSupabaseUserId: string;
  targetFingerprint: string;
  correlationId: string;
  ownershipUpdates: number;
  auditEvents: number;
};

export type FtgpFirstClientOwnershipTransferResult = {
  transferType: FtgpFirstClientOwnershipTransferType;
  requestId: string;
  targetFingerprint: string;
  idempotent: boolean;
};

export function ownerFingerprint(platformAccountId: string): string {
  return createHash("sha256")
    .update(`ftgp-owner:${platformAccountId}`)
    .digest("hex")
    .slice(0, 16);
}

export function requestFingerprint(requestId: string): string {
  return createHash("sha256")
    .update(`ftgp-request:${requestId}`)
    .digest("hex")
    .slice(0, 16);
}

export async function planFtgpFirstClientOwnershipTransfer(input: {
  requestId: string;
  expectedRequestFingerprint: string;
  targetAccountId: string;
  expectedTargetFingerprint?: string;
  expectedCurrentOwnerFingerprint?: string | null;
}): Promise<FtgpFirstClientOwnershipTransferPlan> {
  const requestFp = requestFingerprint(input.requestId);
  if (requestFp !== input.expectedRequestFingerprint) {
    throw new Error("Request fingerprint mismatch");
  }

  const request = await prisma.implementationRequest.findUnique({
    where: { id: input.requestId },
    select: { id: true, submittedByUserId: true, status: true },
  });
  if (!request) {
    throw new Error("Candidate request not found");
  }

  const target = await findPlatformAccountById(input.targetAccountId);
  if (!target) {
    throw new Error("Target platform account not found");
  }

  const targetFp = ownerFingerprint(target.id);
  if (input.expectedTargetFingerprint && targetFp !== input.expectedTargetFingerprint) {
    throw new Error("Target fingerprint mismatch");
  }

  let currentOwnerFingerprint: string | null = null;
  if (request.submittedByUserId) {
    const currentOwner = await prisma.platformAccount.findFirst({
      where: { supabaseUserId: request.submittedByUserId },
      select: { id: true },
    });
    if (currentOwner) {
      currentOwnerFingerprint = ownerFingerprint(currentOwner.id);
    }
  }

  if (
    input.expectedCurrentOwnerFingerprint !== undefined &&
    currentOwnerFingerprint !== input.expectedCurrentOwnerFingerprint
  ) {
    throw new Error("Current owner fingerprint mismatch");
  }

  if (request.submittedByUserId === target.supabaseUserId) {
    return {
      transferType: "IDEMPOTENT_NO_OP",
      requestId: request.id,
      requestFingerprint: requestFp,
      currentOwnerSupabaseUserId: request.submittedByUserId,
      currentOwnerFingerprint: targetFp,
      targetAccountId: target.id,
      targetSupabaseUserId: target.supabaseUserId,
      targetFingerprint: targetFp,
      correlationId: FTGP_FIRST_CLIENT_OWNERSHIP_TRANSFER_CORRELATION_ID,
      ownershipUpdates: 0,
      auditEvents: 0,
    };
  }

  const locale = process.env.PLATFORM_OWNER_LEGAL_LOCALE?.trim() || "en-US";
  const [legalCurrent, internalRoleCount, tenantCount] = await Promise.all([
    hasMandatoryLegalAcceptanceComplete(target.id, locale),
    prisma.platformInternalRoleAssignment.count({
      where: { platformAccountId: target.id, status: "ACTIVE" },
    }),
    prisma.tenantMembership.count({
      where: { supabaseUserId: target.supabaseUserId },
    }),
  ]);

  if (target.status !== "ACTIVE") {
    throw new Error("Target platform account is not ACTIVE");
  }
  if (!legalCurrent) {
    throw new Error("Target mandatory legal acceptance is not current");
  }
  if (internalRoleCount > 0) {
    throw new Error("Target has active internal roles");
  }
  if (tenantCount > 0) {
    throw new Error("Target has tenant memberships");
  }

  const verifiedGoogle = await prisma.platformProviderIdentity.findFirst({
    where: {
      platformAccountId: target.id,
      provider: "google",
      emailVerified: true,
    },
    select: { id: true },
  });
  if (!verifiedGoogle) {
    throw new Error("Target lacks verified Google provider identity");
  }

  return {
    transferType: "ATOMIC_CANDIDATE_OWNER_TRANSFER",
    requestId: request.id,
    requestFingerprint: requestFp,
    currentOwnerSupabaseUserId: request.submittedByUserId,
    currentOwnerFingerprint,
    targetAccountId: target.id,
    targetSupabaseUserId: target.supabaseUserId,
    targetFingerprint: targetFp,
    correlationId: FTGP_FIRST_CLIENT_OWNERSHIP_TRANSFER_CORRELATION_ID,
    ownershipUpdates: 1,
    auditEvents: 2,
  };
}

export async function executeFtgpFirstClientOwnershipTransfer(input: {
  requestId: string;
  expectedRequestFingerprint: string;
  targetAccountId: string;
  expectedTargetFingerprint?: string;
  expectedCurrentOwnerFingerprint?: string | null;
}): Promise<FtgpFirstClientOwnershipTransferResult> {
  const plan = await planFtgpFirstClientOwnershipTransfer(input);

  if (plan.transferType === "IDEMPOTENT_NO_OP") {
    return {
      transferType: plan.transferType,
      requestId: plan.requestId,
      targetFingerprint: plan.targetFingerprint,
      idempotent: true,
    };
  }

  await prismaTransaction(async (tx: Prisma.TransactionClient) => {
    const locked = await tx.implementationRequest.findUnique({
      where: { id: plan.requestId },
      select: { id: true, submittedByUserId: true, status: true },
    });
    if (!locked) {
      throw new Error("Request missing during transfer");
    }
    if (locked.submittedByUserId === plan.targetSupabaseUserId) {
      return;
    }

    const target = await tx.platformAccount.findUnique({
      where: { id: plan.targetAccountId },
      select: { id: true, supabaseUserId: true, status: true },
    });
    if (!target || target.status !== "ACTIVE") {
      throw new Error("Target account inactive during transfer");
    }

    const internalRoles = await tx.platformInternalRoleAssignment.count({
      where: { platformAccountId: target.id, status: "ACTIVE" },
    });
    if (internalRoles > 0) {
      throw new Error("Target gained internal roles during transfer");
    }

    await tx.implementationRequest.update({
      where: { id: plan.requestId },
      data: { submittedByUserId: plan.targetSupabaseUserId },
    });

    const auditMeta = {
      source: FTGP_FIRST_CLIENT_OWNERSHIP_TRANSFER_SOURCE,
      correlationId: plan.correlationId,
      reason: FTGP_FIRST_CLIENT_OWNERSHIP_TRANSFER_REASON,
      requestFingerprint: plan.requestFingerprint,
      targetFingerprint: plan.targetFingerprint,
      previousOwnerFingerprint: plan.currentOwnerFingerprint,
    };

    await tx.platformAccountAuditEvent.create({
      data: {
        platformAccountId: plan.targetAccountId,
        eventType: "profile_updated",
        metadata: { ...auditMeta, action: "ownership_assigned" },
      },
    });

    if (plan.currentOwnerSupabaseUserId) {
      const previousOwner = await tx.platformAccount.findFirst({
        where: { supabaseUserId: plan.currentOwnerSupabaseUserId },
        select: { id: true },
      });
      if (previousOwner) {
        await tx.platformAccountAuditEvent.create({
          data: {
            platformAccountId: previousOwner.id,
            eventType: "profile_updated",
            metadata: { ...auditMeta, action: "ownership_released" },
          },
        });
      }
    }

    const ownerCount = await tx.implementationRequest.count({
      where: { id: plan.requestId, submittedByUserId: plan.targetSupabaseUserId },
    });
    if (ownerCount !== 1) {
      throw new Error("Post-transfer authoritative owner verification failed");
    }
  });

  return {
    transferType: plan.transferType,
    requestId: plan.requestId,
    targetFingerprint: plan.targetFingerprint,
    idempotent: false,
  };
}
