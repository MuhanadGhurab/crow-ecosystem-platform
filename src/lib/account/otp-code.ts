import { createHmac, randomInt, timingSafeEqual } from "crypto";

const OTP_LENGTH = 6;

export function generateOtpCode(): string {
  return String(randomInt(0, 1_000_000)).padStart(OTP_LENGTH, "0");
}

function getVerificationSecret(): string {
  const secret = process.env.EMAIL_VERIFICATION_CODE_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      "EMAIL_VERIFICATION_CODE_SECRET must be set (min 16 chars) for email verification."
    );
  }
  return secret;
}

export function hashOtpCode(code: string, challengeId: string): string {
  return createHmac("sha256", getVerificationSecret())
    .update(`${challengeId}:${code}`)
    .digest("hex");
}

export function verifyOtpCode(
  code: string,
  challengeId: string,
  codeHash: string
): boolean {
  const expected = hashOtpCode(code, challengeId);
  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(codeHash));
  } catch {
    return false;
  }
}
