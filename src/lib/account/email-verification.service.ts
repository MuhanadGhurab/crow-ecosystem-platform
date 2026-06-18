import { randomUUID } from "crypto";
import type { EmailVerificationPurpose } from "@prisma/client";
import { assertC2DatabaseEnvironmentSafe } from "@/lib/crow-core/c2-database-mutation-guard";
import { prisma } from "@/lib/db";
import { normalizeEmail } from "@/lib/account/email-normalize";
import { generateOtpCode, hashOtpCode, verifyOtpCode } from "@/lib/account/otp-code";
import {
  activatePlatformAccount,
  recordPlatformAccountAudit,
} from "@/lib/account/platform-account.service";
import { getEmailDeliveryPort } from "@/lib/email/get-email-delivery-port";
import { hasMandatoryLegalAcceptanceComplete } from "@/lib/legal/legal-acceptance.service";

const OTP_TTL_MS = 15 * 60 * 1000;
const RESEND_COOLDOWN_MS = 60 * 1000;
const MAX_SENDS_PER_CHALLENGE = 5;

export type IssueVerificationResult =
  | { ok: true; challengeId: string }
  | { ok: false; reason: "cooldown" | "max_sends" | "no_account" };

export async function issueEmailVerificationCode(input: {
  platformAccountId: string;
  email: string;
  purpose?: EmailVerificationPurpose;
}): Promise<IssueVerificationResult> {
  await assertC2DatabaseEnvironmentSafe();
  const emailNormalized = normalizeEmail(input.email);
  const purpose = input.purpose ?? "registration";
  const now = new Date();

  const pending = await prisma.emailVerificationChallenge.findFirst({
    where: {
      platformAccountId: input.platformAccountId,
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
    await prisma.emailVerificationChallenge.update({
      where: { id: pending.id },
      data: { status: "revoked", invalidatedAt: now },
    });
  }

  const challengeId = randomUUID();
  const code = generateOtpCode();
  const codeHash = hashOtpCode(code, challengeId);
  const expiresAt = new Date(now.getTime() + OTP_TTL_MS);

  const challenge = await prisma.emailVerificationChallenge.create({
    data: {
      id: challengeId,
      platformAccountId: input.platformAccountId,
      emailNormalized,
      purpose,
      codeHash,
      expiresAt,
      lastSentAt: now,
      sendCount: 1,
    },
  });

  const delivery = await getEmailDeliveryPort().send({
    to: input.email.trim(),
    subject: "Your Crow verification code",
    text: `Your Crow verification code is ${code}. It expires in 15 minutes.`,
    html: `<p>Your Crow verification code is <strong>${code}</strong>.</p><p>It expires in 15 minutes.</p>`,
  });

  await prisma.emailVerificationChallenge.update({
    where: { id: challenge.id },
    data: {
      deliveryStatus: delivery.status,
      providerMessageId: delivery.providerMessageId,
    },
  });

  await recordPlatformAccountAudit(input.platformAccountId, "verification_code_sent", {
    purpose,
    challengeId: challenge.id,
    deliveryStatus: delivery.status,
  });

  return { ok: true, challengeId: challenge.id };
}

export type VerifyEmailCodeResult =
  | { ok: true; activated: boolean }
  | {
      ok: false;
      reason:
        | "invalid"
        | "expired"
        | "max_attempts"
        | "no_challenge"
        | "blocked"
        | "legal_incomplete";
    };

export async function verifyEmailVerificationCode(input: {
  platformAccountId: string;
  email: string;
  code: string;
}): Promise<VerifyEmailCodeResult> {
  await assertC2DatabaseEnvironmentSafe();
  const emailNormalized = normalizeEmail(input.email);
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

  const challenge = await prisma.emailVerificationChallenge.findFirst({
    where: {
      platformAccountId: input.platformAccountId,
      emailNormalized,
      status: "pending",
    },
    orderBy: { createdAt: "desc" },
  });

  if (!challenge) {
    return { ok: false, reason: "no_challenge" };
  }

  if (challenge.expiresAt <= now) {
    await prisma.emailVerificationChallenge.update({
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
    await prisma.emailVerificationChallenge.update({
      where: { id: challenge.id },
      data: { attemptCount: { increment: 1 } },
    });
    await recordPlatformAccountAudit(input.platformAccountId, "verification_failed", {
      challengeId: challenge.id,
    });
    return { ok: false, reason: "invalid" };
  }

  await prisma.emailVerificationChallenge.update({
    where: { id: challenge.id },
    data: { status: "consumed", consumedAt: now },
  });

  let activated = false;
  if (account.status === "PENDING_EMAIL_VERIFICATION") {
    const legalComplete = await hasMandatoryLegalAcceptanceComplete(account.id);
    if (!legalComplete) {
      await recordPlatformAccountAudit(account.id, "verification_failed", {
        challengeId: challenge.id,
        reason: "legal_incomplete",
      });
      return { ok: false, reason: "legal_incomplete" };
    }
    await activatePlatformAccount(account.id);
    await recordPlatformAccountAudit(account.id, "account_activated", {
      challengeId: challenge.id,
    });
    activated = true;
  } else {
    await prisma.platformAccount.update({
      where: { id: account.id },
      data: { lastVerifiedAt: now },
    });
  }

  await recordPlatformAccountAudit(account.id, "verification_succeeded", {
    challengeId: challenge.id,
    activated,
  });

  return { ok: true, activated };
}
