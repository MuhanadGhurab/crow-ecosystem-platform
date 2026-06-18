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
import {
  confirmSupabaseUserEmail,
  isSupabaseUserEmailConfirmed,
} from "@/lib/account/supabase-email-confirmation.service";
import { getEmailDeliveryPort } from "@/lib/email/get-email-delivery-port";
import { buildCrowVerificationEmail } from "@/lib/email/templates/crow-verification-email";
import { resolveHostedEmailProviderConfig } from "@/lib/email/email-provider-config";
import { isC3RegistrationDiagnosticsEnabled } from "@/lib/account/c3-registration-diagnostics";
import { hasMandatoryLegalAcceptanceComplete } from "@/lib/legal/legal-acceptance.service";

const OTP_TTL_MS = 15 * 60 * 1000;
const RESEND_COOLDOWN_MS = 60 * 1000;
const MAX_SENDS_PER_CHALLENGE = 5;

export type IssueVerificationResult =
  | { ok: true; challengeId: string }
  | {
      ok: false;
      reason: "cooldown" | "max_sends" | "no_account" | "delivery_failed";
    };

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

  const emailContent = buildCrowVerificationEmail({ code, expiresMinutes: 15 });

  if (isC3RegistrationDiagnosticsEnabled()) {
    const hostedConfig = resolveHostedEmailProviderConfig();
    const fromDomain = hostedConfig?.fromAddress.match(/@([\w.-]+)/)?.[1] ?? "missing";
    console.info(
      "[c3-registration]",
      JSON.stringify({
        c3_registration: true,
        stage: "OTP_DELIVERY_CONFIG",
        outcome: hostedConfig ? "ok" : "failed",
        keyConfigured: Boolean(hostedConfig?.apiKey),
        keyLength: hostedConfig?.apiKey.length ?? 0,
        fromDomainSuffix: fromDomain,
      })
    );
  }

  const delivery = await getEmailDeliveryPort().send({
    to: input.email.trim(),
    subject: emailContent.subject,
    text: emailContent.text,
    html: emailContent.html,
  });

  if (delivery.status === "failed") {
    await prisma.emailVerificationChallenge.update({
      where: { id: challenge.id },
      data: {
        status: "revoked",
        invalidatedAt: new Date(),
        deliveryStatus: "failed",
        providerMessageId: delivery.providerMessageId,
      },
    });
    await recordPlatformAccountAudit(input.platformAccountId, "verification_failed", {
      purpose,
      challengeId: challenge.id,
      reason: "delivery_failed",
      channel: delivery.channel,
    });
    return { ok: false, reason: "delivery_failed" };
  }

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
    channel: delivery.channel,
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
        | "legal_incomplete"
        | "confirm_failed";
    };

async function finalizeActivationIfPending(
  platformAccountId: string,
  supabaseUserId: string,
  challengeId: string
): Promise<{ activated: boolean; legalIncomplete: boolean; confirmFailed: boolean }> {
  const account = await prisma.platformAccount.findUnique({
    where: { id: platformAccountId },
  });
  if (!account || account.status === "ACTIVE") {
    return { activated: false, legalIncomplete: false, confirmFailed: false };
  }

  const legalComplete = await hasMandatoryLegalAcceptanceComplete(account.id);
  if (!legalComplete) {
    await recordPlatformAccountAudit(account.id, "verification_failed", {
      challengeId,
      reason: "legal_incomplete",
    });
    return { activated: false, legalIncomplete: true, confirmFailed: false };
  }

  const confirmResult = await confirmSupabaseUserEmail(supabaseUserId);
  if (!confirmResult.ok) {
    await recordPlatformAccountAudit(account.id, "verification_failed", {
      challengeId,
      reason: "supabase_email_confirm_failed",
    });
    return { activated: false, legalIncomplete: false, confirmFailed: true };
  }

  if (!confirmResult.alreadyConfirmed) {
    await recordPlatformAccountAudit(account.id, "verification_succeeded", {
      challengeId,
      supabaseEmailConfirmed: true,
    });
  }

  await activatePlatformAccount(account.id);
  await recordPlatformAccountAudit(account.id, "account_activated", {
    challengeId,
    supabaseEmailConfirmed: true,
  });

  return { activated: true, legalIncomplete: false, confirmFailed: false };
}

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
  if (account.status === "ACTIVE") {
    return { ok: true, activated: false };
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
    const consumed = await prisma.emailVerificationChallenge.findFirst({
      where: {
        platformAccountId: input.platformAccountId,
        emailNormalized,
        status: "consumed",
      },
      orderBy: { consumedAt: "desc" },
    });

    if (consumed && account.status === "PENDING_EMAIL_VERIFICATION") {
      const confirmed = await isSupabaseUserEmailConfirmed(account.supabaseUserId);
      if (confirmed) {
        const finish = await finalizeActivationIfPending(
          account.id,
          account.supabaseUserId,
          consumed.id
        );
        if (finish.legalIncomplete) return { ok: false, reason: "legal_incomplete" };
        if (finish.confirmFailed) return { ok: false, reason: "confirm_failed" };
        return { ok: true, activated: finish.activated };
      }
    }

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

  const finish = await finalizeActivationIfPending(
    account.id,
    account.supabaseUserId,
    challenge.id
  );

  if (finish.legalIncomplete) {
    return { ok: false, reason: "legal_incomplete" };
  }
  if (finish.confirmFailed) {
    return { ok: false, reason: "confirm_failed" };
  }

  if (!finish.activated) {
    await prisma.platformAccount.update({
      where: { id: account.id },
      data: { lastVerifiedAt: now },
    });
  }

  await recordPlatformAccountAudit(account.id, "verification_succeeded", {
    challengeId: challenge.id,
    activated: finish.activated,
  });

  return { ok: true, activated: finish.activated };
}
