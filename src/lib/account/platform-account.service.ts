import type {
  PlatformAccount,
  PlatformAccountStatus,
  Prisma,
} from "@prisma/client";
import { assertC2DatabaseEnvironmentSafe } from "@/lib/crow-core/c2-database-mutation-guard";
import { prisma } from "@/lib/db";
import { normalizeEmail } from "@/lib/account/email-normalize";
import { generatePublicAccountId } from "@/lib/account/public-account-id";
import { getCurrentEnrollmentGeneration, getRequiredOnboardingGeneration, isOnboardingGenerationCurrent } from "@/lib/account/onboarding-generation";
import {
  canActivatePlatformAccount,
  isPhoneVerificationRequiredForAccount,
} from "@/lib/account/platform-account-activation";
import { hasMandatoryLegalAcceptanceComplete } from "@/lib/legal/legal-acceptance.service";
import { resolveRegistrationLocale } from "@/lib/legal/registration-locale";

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

export async function findPlatformAccountById(
  platformAccountId: string
): Promise<PlatformAccountRecord | null> {
  return prisma.platformAccount.findUnique({ where: { id: platformAccountId } });
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
      onboardingGeneration: getCurrentEnrollmentGeneration(),
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
  const result = await activatePlatformAccountIfReady(platformAccountId);
  if (!result.ok) {
    throw new Error(result.reason);
  }
  const account = await prisma.platformAccount.findUniqueOrThrow({
    where: { id: platformAccountId },
  });
  return account;
}

export type ActivateIfReadyResult =
  | { ok: true; activated: boolean }
  | {
      ok: false;
      reason:
        | "not_found"
        | "legal_incomplete"
        | "email_unverified"
        | "phone_unverified"
        | "blocked";
    };

export async function activatePlatformAccountIfReady(
  platformAccountId: string
): Promise<ActivateIfReadyResult> {
  await assertC2DatabaseEnvironmentSafe();
  const account = await prisma.platformAccount.findUnique({
    where: { id: platformAccountId },
  });
  if (!account) {
    return { ok: false, reason: "not_found" };
  }
  if (isBlockedPlatformAccountStatus(account.status)) {
    return { ok: false, reason: "blocked" };
  }
  if (account.status === "ACTIVE") {
    return { ok: true, activated: false };
  }

  const readiness = await canActivatePlatformAccount(account);
  if (!readiness.legalComplete) {
    return { ok: false, reason: "legal_incomplete" };
  }
  if (!readiness.emailVerified) {
    return { ok: false, reason: "email_unverified" };
  }
  if (!readiness.phoneVerified) {
    return { ok: false, reason: "phone_unverified" };
  }

  const now = new Date();
  await prisma.platformAccount.update({
    where: { id: platformAccountId },
    data: {
      status: "ACTIVE",
      activatedAt: now,
      lastVerifiedAt: now,
    },
  });
  await recordPlatformAccountAudit(platformAccountId, "account_activated", {
    onboardingGeneration: account.onboardingGeneration,
  });
  return { ok: true, activated: true };
}

export async function recordEmailVerificationEvidence(input: {
  platformAccountId: string;
  source: string;
}): Promise<PlatformAccountRecord> {
  await assertC2DatabaseEnvironmentSafe();
  const now = new Date();
  const account = await prisma.platformAccount.findUniqueOrThrow({
    where: { id: input.platformAccountId },
  });

  const phoneRequired = isPhoneVerificationRequiredForAccount(account);
  const locale = await resolveRegistrationLocale();
  const legalComplete = await hasMandatoryLegalAcceptanceComplete(
    input.platformAccountId,
    locale
  );

  const nextStatus: PlatformAccountStatus = phoneRequired
    ? "PENDING_PHONE_VERIFICATION"
    : legalComplete
      ? account.status === "ACTIVE"
        ? "ACTIVE"
        : account.status
      : "PENDING_LEGAL_ACCEPTANCE";

  const updated = await prisma.platformAccount.update({
    where: { id: input.platformAccountId },
    data: {
      emailVerifiedAt: now,
      emailVerificationSource: input.source,
      lastVerifiedAt: now,
      status: nextStatus,
    },
  });

  await recordPlatformAccountAudit(input.platformAccountId, "email_verification_recorded", {
    source: input.source,
  });

  if (!phoneRequired) {
    await activatePlatformAccountIfReady(input.platformAccountId);
  }

  return updated;
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
  return (
    account.status === "ACTIVE" &&
    isOnboardingGenerationCurrent(account.onboardingGeneration)
  );
}

export function isPendingLegalAcceptance(account: PlatformAccountRecord): boolean {
  return account.status === "PENDING_LEGAL_ACCEPTANCE";
}

export function isPendingEmailVerification(account: PlatformAccountRecord): boolean {
  if (account.emailVerifiedAt) {
    return false;
  }
  return (
    account.status === "PENDING_EMAIL_VERIFICATION" ||
    (account.status === "PENDING_PHONE_VERIFICATION" && !account.emailVerifiedAt)
  );
}

export function isPendingPhoneVerification(account: PlatformAccountRecord): boolean {
  if (!isPhoneVerificationRequiredForAccount(account)) {
    return false;
  }
  return (
    account.status === "PENDING_PHONE_VERIFICATION" ||
    (account.emailVerifiedAt != null &&
      account.phoneVerifiedAt == null &&
      account.status !== "ACTIVE")
  );
}

export function isBlockedPlatformAccountStatus(status: PlatformAccountStatus): boolean {
  return status === "SUSPENDED" || status === "LOCKED" || status === "DEACTIVATED";
}

/** Bump legacy generation when current mandatory legal evidence is already complete. */
export async function reconcileLegacyOnboardingGeneration(
  platformAccountId: string
): Promise<PlatformAccountRecord> {
  await assertC2DatabaseEnvironmentSafe();
  const required = getRequiredOnboardingGeneration();
  return prisma.platformAccount.update({
    where: { id: platformAccountId },
    data: { onboardingGeneration: required },
  });
}
