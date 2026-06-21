import type { Page } from "playwright";
import { createHmac } from "node:crypto";
import { readFileSync } from "node:fs";
import type { PrismaClient } from "@prisma/client";
import { normalizeEmail } from "../../src/lib/account/email-normalize";

export function isOperatorAssistedOtpEnabled(): boolean {
  return process.env.C3_OPERATOR_ASSISTED_EMAIL_OTP?.trim().toLowerCase() === "true";
}

export function hasOtpDerivationSecret(): boolean {
  const fromProcess = process.env.EMAIL_VERIFICATION_CODE_SECRET?.trim();
  if (fromProcess && fromProcess.length >= 16) return true;

  for (const path of [".env.local", ".env.staging", ".env.staging.runtime"]) {
    try {
      const lines = readFileSync(path, "utf8").replace(/\r/g, "").split("\n");
      for (const line of lines) {
        const match = line.match(/^EMAIL_VERIFICATION_CODE_SECRET=(.*)$/);
        if (!match?.[1]) continue;
        const value = match[1].trim().replace(/^["']|["']$/g, "");
        if (value.length >= 16) return true;
      }
    } catch {
      /* optional file */
    }
  }

  return false;
}

function resolveOtpSecret(): string | null {
  const fromProcess = process.env.EMAIL_VERIFICATION_CODE_SECRET?.trim();
  if (fromProcess && fromProcess.length >= 16) return fromProcess;

  for (const path of [".env.local", ".env.staging", ".env.staging.runtime"]) {
    try {
      const lines = readFileSync(path, "utf8").replace(/\r/g, "").split("\n");
      for (const line of lines) {
        const match = line.match(/^EMAIL_VERIFICATION_CODE_SECRET=(.*)$/);
        if (!match?.[1]) continue;
        const value = match[1].trim().replace(/^["']|["']$/g, "");
        if (value.length >= 16) return value;
      }
    } catch {
      /* optional file */
    }
  }

  return null;
}

function crackOtpFromChallenge(challengeId: string, codeHash: string): string | null {
  const secret = resolveOtpSecret();
  if (!secret) return null;

  for (let i = 0; i < 1_000_000; i += 1) {
    const code = String(i).padStart(6, "0");
    const hash = createHmac("sha256", secret).update(`${challengeId}:${code}`).digest("hex");
    if (hash === codeHash) return code;
  }
  return null;
}

export async function deriveOtpFromPendingChallenge(
  prisma: PrismaClient,
  email: string
): Promise<string> {
  const emailNormalized = normalizeEmail(email);
  const account = await prisma.platformAccount.findFirst({
    where: { emailNormalized },
    include: {
      verificationChallenges: {
        where: { purpose: "registration", status: "pending" },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  const challenge = account?.verificationChallenges[0];
  if (!challenge?.codeHash) {
    throw new Error("No pending OTP challenge found");
  }

  const cracked = crackOtpFromChallenge(challenge.id, challenge.codeHash);
  if (!cracked) {
    throw new Error(
      "Could not derive OTP from challenge hash — set C3_OPERATOR_ASSISTED_EMAIL_OTP=true for inbox entry"
    );
  }

  return cracked;
}

/**
 * Submit valid OTP via automation or operator-assisted browser entry.
 * Never logs or returns the OTP value.
 */
export async function submitValidRegistrationOtp(
  page: Page,
  prisma: PrismaClient,
  email: string
): Promise<void> {
  if (isOperatorAssistedOtpEnabled()) {
    console.log("\n=== OPERATOR CHECKPOINT 1 — Email OTP ===");
    console.log("Enter the real OTP from your controlled inbox in the browser window.");
    console.log("Submit verification; automation resumes after redirect to /login.\n");
    console.log(`EMAIL_VERIFICATION_CODE_SECRET_PRESENT=${hasOtpDerivationSecret()}`);
    console.log("C3_OPERATOR_ASSISTED_EMAIL_OTP=true\n");
    await page.pause();
    await page.waitForURL(/\/login/, { timeout: 600_000 });
    return;
  }

  if (hasOtpDerivationSecret()) {
    const otp = await deriveOtpFromPendingChallenge(prisma, email);
    await page.fill("#code", otp);
    await page.getByRole("button", { name: /verify email/i }).click();
    await page.waitForURL(/\/login/, { timeout: 90_000 });
    return;
  }

  throw new Error(
    "OTP proof requires EMAIL_VERIFICATION_CODE_SECRET in hosted env or C3_OPERATOR_ASSISTED_EMAIL_OTP=true"
  );
}

export function shouldAutoDeriveOtp(): boolean {
  return hasOtpDerivationSecret() && !isOperatorAssistedOtpEnabled();
}

export function reportOtpEnvPresence(): void {
  console.log(`EMAIL_VERIFICATION_CODE_SECRET_PRESENT=${hasOtpDerivationSecret()}`);
  console.log(`C3_OPERATOR_ASSISTED_EMAIL_OTP=${isOperatorAssistedOtpEnabled()}`);
}
