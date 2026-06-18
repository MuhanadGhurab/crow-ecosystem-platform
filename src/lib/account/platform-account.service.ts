import type {
  PlatformAccount,
  PlatformAccountStatus,
  Prisma,
} from "@prisma/client";
import { assertC2DatabaseEnvironmentSafe } from "@/lib/crow-core/c2-database-mutation-guard";
import { prisma } from "@/lib/db";
import { hasMandatoryLegalAcceptanceComplete } from "@/lib/legal/legal-acceptance.service";
import { normalizeEmail } from "@/lib/account/email-normalize";
import { generatePublicAccountId } from "@/lib/account/public-account-id";

export type PlatformAccountRecord = PlatformAccount;

export async function findPlatformAccountBySupabaseUserId(
  supabaseUserId: string
): Promise<PlatformAccountRecord | null> {
  return prisma.platformAccount.findUnique({ where: { supabaseUserId } });
}

export async function findPlatformAccountByEmailNormalized(
  email: string
): Promise<PlatformAccountRecord | null> {
  return prisma.platformAccount.findUnique({
    where: { emailNormalized: normalizeEmail(email) },
  });
}

export async function createPendingPlatformAccount(input: {
  supabaseUserId: string;
  email: string;
  registrationSource?: string;
}): Promise<PlatformAccountRecord> {
  await assertC2DatabaseEnvironmentSafe();
  const emailNormalized = normalizeEmail(input.email);
  return prisma.platformAccount.create({
    data: {
      supabaseUserId: input.supabaseUserId,
      email: input.email.trim(),
      emailNormalized,
      publicAccountId: generatePublicAccountId(),
      status: "PENDING_EMAIL_VERIFICATION",
      registrationSource: input.registrationSource,
      profile: { create: { isPrivate: true } },
    },
  });
}

export async function ensurePlatformAccountForAuthUser(input: {
  supabaseUserId: string;
  email: string;
  registrationSource: string;
}): Promise<PlatformAccountRecord> {
  const existing = await findPlatformAccountBySupabaseUserId(input.supabaseUserId);
  if (existing) {
    return existing;
  }

  const byEmail = await findPlatformAccountByEmailNormalized(input.email);
  if (byEmail) {
    return byEmail;
  }

  await assertC2DatabaseEnvironmentSafe();
  return createPendingPlatformAccount(input);
}

export async function activatePlatformAccount(
  platformAccountId: string
): Promise<PlatformAccountRecord> {
  await assertC2DatabaseEnvironmentSafe();
  const legalComplete = await hasMandatoryLegalAcceptanceComplete(platformAccountId);
  if (!legalComplete) {
    throw new Error("Mandatory legal acceptances are incomplete.");
  }
  const now = new Date();
  return prisma.platformAccount.update({
    where: { id: platformAccountId },
    data: {
      status: "ACTIVE",
      activatedAt: now,
      lastVerifiedAt: now,
    },
  });
}

export async function recordPlatformAccountAudit(
  platformAccountId: string,
  eventType: Prisma.PlatformAccountAuditEventCreateInput["eventType"],
  metadata?: Prisma.InputJsonValue
): Promise<void> {
  await assertC2DatabaseEnvironmentSafe();
  await prisma.platformAccountAuditEvent.create({
    data: { platformAccountId, eventType, metadata },
  });
}

export function isPlatformAccountActive(account: PlatformAccountRecord): boolean {
  return account.status === "ACTIVE";
}

export function isPendingEmailVerification(account: PlatformAccountRecord): boolean {
  return account.status === "PENDING_EMAIL_VERIFICATION";
}

export function isBlockedPlatformAccountStatus(status: PlatformAccountStatus): boolean {
  return status === "SUSPENDED" || status === "LOCKED" || status === "DEACTIVATED";
}
