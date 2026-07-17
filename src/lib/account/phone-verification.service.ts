import { randomUUID } from "crypto";
import type { PhoneVerificationPurpose } from "@prisma/client";

import { assertC2DatabaseEnvironmentSafe } from "@/lib/crow-core/c2-database-mutation-guard";
import { prisma } from "@/lib/db";
import { generateOtpCode, hashOtpCode, verifyOtpCode } from "@/lib/account/otp-code";
import {
  activatePlatformAccountIfReady,
  recordPlatformAccountAudit,
} from "@/lib/account/platform-account.service";
import { isValidE164Phone } from "@/lib/account/phone-normalize";
import { isPhoneVerificationRequiredForAccount, isPhoneVerificationFlowEnabled } from "@/lib/account/phone-verification-policy";
import { getPhoneVerificationDeliveryPort } from "@/lib/phone/get-phone-verification-port";
import { isPreviewPhoneDestinationAllowed } from "@/lib/phone/preview-phone-allowlist";
import { buildOtpSmsBody } from "@/lib/phone/otp-sms-templates";
import { PHONE_VERIFICATION_SOURCES } from "@/lib/account/verification-sources";

const OTP_TTL_MS = 10 * 60 * 1000;
const RESEND_COOLDOWN_MS = 60 * 1000;
const MAX_SENDS_PER_CHALLENGE = 5;
const HOURLY_SEND_LIMIT = 6;
const DAILY_SEND_LIMIT = 12;

export type IssuePhoneVerificationResult =
  | { ok: true; challengeId: string; maskedPhone: string }
  | {
      ok: false;
      reason:
        | "cooldown"
        | "max_sends"
        | "rate_limited"
        | "invalid_phone"
        | "duplicate"
        | "delivery_failed"
        | "no_account";
    };

export type VerifyPhoneCodeResult =
  | { ok: true; activated: boolean }
  | {
      ok: false;
      reason:
        | "invalid"
        | "expired"
        | "max_attempts"
        | "no_challenge"
        | "blocked"
        | "legal_incomplete"
        | "email_unverified";
    };

async function countRecentPhoneSends(
  platformAccountId: string,
  since: Date
): Promise<number> {
  return prisma.phoneVerificationChallenge.count({
    where: {
      platformAccountId,
      createdAt: { gte: since },
    },
  });
}

/** One verified phone per active account — generic response on conflict. */
async function isPhoneOwnedByAnotherActiveAccount(
  phoneNormalized: string,
  excludeAccountId: string
): Promise<boolean> {
  const owner = await prisma.platformAccount.findFirst({
    where: {
      phoneNormalized,
      id: { not: excludeAccountId },
      status: { in: ["ACTIVE", "PENDING_PHONE_VERIFICATION", "PENDING_EMAIL_VERIFICATION"] },
      phoneVerifiedAt: { not: null },
    },
    select: { id: true },
  });
  return owner != null;
}

export async function issuePhoneVerificationCode(input: {
  platformAccountId: string;
  phoneNormalized: string;
  phoneMasked: string;
  purpose?: PhoneVerificationPurpose;
}): Promise<IssuePhoneVerificationResult> {
  await assertC2DatabaseEnvironmentSafe();

  const accountForPolicy = await prisma.platformAccount.findUnique({
    where: { id: input.platformAccountId },
    select: { onboardingGeneration: true },
  });
  if (!accountForPolicy) {
    return { ok: false, reason: "no_account" };
  }
  // Enrollment gen≥3 policy OR client-process constitution flow (CROW.REQUEST.2).
  if (
    !isPhoneVerificationRequiredForAccount(accountForPolicy) &&
    !isPhoneVerificationFlowEnabled()
  ) {
    return { ok: false, reason: "no_account" };
  }

  if (!isValidE164Phone(input.phoneNormalized)) {
    return { ok: false, reason: "invalid_phone" };
  }

  const account = await prisma.platformAccount.findUnique({
    where: { id: input.platformAccountId },
  });
  if (!account) {
    return { ok: false, reason: "no_account" };
  }

  if (await isPhoneOwnedByAnotherActiveAccount(input.phoneNormalized, account.id)) {
    return { ok: false, reason: "duplicate" };
  }

  const now = new Date();
  const hourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const [hourly, daily] = await Promise.all([
    countRecentPhoneSends(account.id, hourAgo),
    countRecentPhoneSends(account.id, dayAgo),
  ]);

  if (hourly >= HOURLY_SEND_LIMIT || daily >= DAILY_SEND_LIMIT) {
    return { ok: false, reason: "rate_limited" };
  }

  const purpose = input.purpose ?? "registration";

  const pending = await prisma.phoneVerificationChallenge.findFirst({
    where: {
      platformAccountId: account.id,
      purpose,
      status: "pending",
      expiresAt: { gt: now },
    },
    orderBy: { createdAt: "desc" },
  });

  if (pending?.lastSentAt) {
    const elapsed = now.getTime() - pending.lastSentAt.getTime();
    if (elapsed < RESEND_COOLDOWN_MS) {
      return { ok: false, reason: "cooldown" };
    }
    if (pending.sendCount >= MAX_SENDS_PER_CHALLENGE) {
      return { ok: false, reason: "max_sends" };
    }
  }

  if (pending) {
    await prisma.phoneVerificationChallenge.update({
      where: { id: pending.id },
      data: { status: "revoked", invalidatedAt: now },
    });
  }

  await prisma.platformAccount.update({
    where: { id: account.id },
    data: {
      phoneNormalized: input.phoneNormalized,
      phoneMasked: input.phoneMasked,
    },
  });

  const challengeId = randomUUID();
  const code = generateOtpCode();
  const codeHash = hashOtpCode(code, challengeId);
  const expiresAt = new Date(now.getTime() + OTP_TTL_MS);

  const challenge = await prisma.phoneVerificationChallenge.create({
    data: {
      id: challengeId,
      platformAccountId: account.id,
      phoneNormalized: input.phoneNormalized,
      purpose,
      codeHash,
      expiresAt,
      lastSentAt: now,
      sendCount: 1,
    },
  });

  if (
    process.env.VERCEL_ENV === "preview" &&
    !isPreviewPhoneDestinationAllowed(input.phoneNormalized)
  ) {
    await prisma.phoneVerificationChallenge.update({
      where: { id: challenge.id },
      data: { status: "revoked", invalidatedAt: now, deliveryStatus: "failed" },
    });
    return { ok: false, reason: "delivery_failed" };
  }

  const otpMinutes = Math.round(OTP_TTL_MS / 60_000);
  const delivery = await getPhoneVerificationDeliveryPort().send({
    toE164: input.phoneNormalized,
    message: buildOtpSmsBody({
      code,
      minutes: otpMinutes,
      locale: process.env.C3_SMS_DEFAULT_LOCALE,
    }),
  });

  if (delivery.status === "failed") {
    await prisma.phoneVerificationChallenge.update({
      where: { id: challenge.id },
      data: { status: "revoked", invalidatedAt: now, deliveryStatus: "failed" },
    });
    return { ok: false, reason: "delivery_failed" };
  }

  await prisma.phoneVerificationChallenge.update({
    where: { id: challenge.id },
    data: {
      deliveryStatus: delivery.status,
      providerMessageId: delivery.providerMessageId,
    },
  });

  await recordPlatformAccountAudit(account.id, "phone_verification_code_sent", {
    challengeId: challenge.id,
    maskedPhone: input.phoneMasked,
  });

  return { ok: true, challengeId: challenge.id, maskedPhone: input.phoneMasked };
}

export async function verifyPhoneVerificationCode(input: {
  platformAccountId: string;
  phoneNormalized: string;
  code: string;
}): Promise<VerifyPhoneCodeResult> {
  await assertC2DatabaseEnvironmentSafe();
  const now = new Date();

  const account = await prisma.platformAccount.findUnique({
    where: { id: input.platformAccountId },
  });
  if (!account) {
    return { ok: false, reason: "no_challenge" };
  }
  if (account.status === "SUSPENDED" || account.status === "LOCKED") {
    return { ok: false, reason: "blocked" };
  }
  if (!account.emailVerifiedAt) {
    return { ok: false, reason: "email_unverified" };
  }

  const challenge = await prisma.phoneVerificationChallenge.findFirst({
    where: {
      platformAccountId: account.id,
      phoneNormalized: input.phoneNormalized,
      status: "pending",
    },
    orderBy: { createdAt: "desc" },
  });

  if (!challenge) {
    return { ok: false, reason: "no_challenge" };
  }

  if (challenge.expiresAt <= now) {
    await prisma.phoneVerificationChallenge.update({
      where: { id: challenge.id },
      data: { status: "expired" },
    });
    return { ok: false, reason: "expired" };
  }

  if (challenge.attemptCount >= challenge.maxAttempts) {
    return { ok: false, reason: "max_attempts" };
  }

  const valid = verifyOtpCode(input.code.trim(), challenge.id, challenge.codeHash);
  if (!valid) {
    await prisma.phoneVerificationChallenge.update({
      where: { id: challenge.id },
      data: { attemptCount: { increment: 1 } },
    });
    await recordPlatformAccountAudit(account.id, "phone_verification_failed", {
      challengeId: challenge.id,
    });
    return { ok: false, reason: "invalid" };
  }

  await prisma.phoneVerificationChallenge.update({
    where: { id: challenge.id },
    data: { status: "consumed", consumedAt: now },
  });

  await prisma.phoneVerificationChallenge.updateMany({
    where: {
      platformAccountId: account.id,
      status: "pending",
      id: { not: challenge.id },
    },
    data: { status: "revoked", invalidatedAt: now },
  });

  await prisma.platformAccount.update({
    where: { id: account.id },
    data: {
      phoneVerifiedAt: now,
      phoneVerificationSource: PHONE_VERIFICATION_SOURCES.CROW_SMS_OTP,
      lastVerifiedAt: now,
    },
  });

  await recordPlatformAccountAudit(account.id, "phone_verification_succeeded", {
    challengeId: challenge.id,
  });

  const activation = await activatePlatformAccountIfReady(account.id);
  if (!activation.ok) {
    if (activation.reason === "legal_incomplete") {
      return { ok: false, reason: "legal_incomplete" };
    }
    return { ok: true, activated: false };
  }

  return { ok: true, activated: activation.activated };
}
