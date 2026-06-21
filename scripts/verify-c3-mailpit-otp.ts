/**
 * Mailpit + OTP safety checks on disposable local DB (no Supabase required).
 * Run: npm run c3-mailpit:verify
 */
import { randomUUID } from "crypto";
import { PrismaClient } from "@prisma/client";
import { assertDisposableLocalDatabase } from "./lib/local-database-safety";
import { generateOtpCode, hashOtpCode, verifyOtpCode } from "../src/lib/account/otp-code";
import { normalizeEmail } from "../src/lib/account/email-normalize";

const MAILPIT = (process.env.MAILPIT_API_URL ?? "http://127.0.0.1:8025").replace(/\/$/, "");

function ok(msg: string) {
  console.log(`  ✓ ${msg}`);
}

function fail(msg: string): never {
  throw new Error(msg);
}

async function main() {
  console.log("\n=== C3 Mailpit + OTP local verify ===\n");
  assertDisposableLocalDatabase(process.env.DATABASE_URL);

  const health = await fetch(`${MAILPIT}/api/v1/info`);
  if (!health.ok) fail(`Mailpit not reachable at ${MAILPIT}`);
  ok("Mailpit API reachable");

  const code = generateOtpCode();
  const challengeId = randomUUID();
  const hash = hashOtpCode(code, challengeId);
  if (hash === code || hash.length < 20) fail("OTP must be hashed");
  ok("OTP hashing produces non-plain digest");

  if (!verifyOtpCode(code, challengeId, hash)) fail("OTP verify failed for valid code");
  if (verifyOtpCode("000000", challengeId, hash)) fail("OTP verify must reject wrong code");
  ok("OTP verify accepts valid / rejects invalid");

  const prisma = new PrismaClient();
  const stamp = Date.now();
  const email = `c3-mailpit-${stamp}@crow.local.test`;

  try {
    const account = await prisma.platformAccount.create({
      data: {
        supabaseUserId: randomUUID(),
        email,
        emailNormalized: normalizeEmail(email),
        publicAccountId: `PA-MP-${stamp}`,
        status: "PENDING_EMAIL_VERIFICATION",
        registrationSource: "c3-mailpit-verify",
        profile: { create: { isPrivate: true } },
      },
    });

    await prisma.emailVerificationChallenge.create({
      data: {
        id: challengeId,
        platformAccountId: account.id,
        emailNormalized: normalizeEmail(email),
        purpose: "registration",
        codeHash: hash,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
        lastSentAt: new Date(),
        sendCount: 1,
      },
    });

    const row = await prisma.emailVerificationChallenge.findUnique({
      where: { id: challengeId },
    });
    if (!row?.codeHash || row.codeHash === code) {
      fail("Database must store codeHash only, never raw OTP");
    }
    ok("Database stores hashed OTP only");

    const subject = "Your Crow verification code";
    const text = `Your Crow verification code is ${code}. It expires in 15 minutes.`;
    const sendRes = await fetch(`${MAILPIT}/api/v1/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        From: { Email: process.env.MAILPIT_FROM_EMAIL ?? "noreply@crow.local", Name: "Crow" },
        To: [{ Email: email }],
        Subject: subject,
        Text: text,
      }),
    });
    if (!sendRes.ok) fail(`Mailpit send failed: ${sendRes.status}`);
    ok("Mailpit accepts Crow verification email");

    const inbox = await fetch(`${MAILPIT}/api/v1/messages`);
    const data = (await inbox.json()) as {
      messages?: { Subject?: string; To?: { Address: string }[]; Text?: string }[];
    };
    const msg = data.messages?.find(
      (m) =>
        m.To?.some((t) => t.Address === email) &&
        (m.Subject?.includes("Crow") || m.Text?.includes("verification"))
    );
    if (!msg) fail("Expected Crow verification message in Mailpit");
    ok("Mailpit inbox contains Crow verification template");

    await prisma.emailVerificationChallenge.delete({ where: { id: challengeId } });
    await prisma.platformAccountProfile.deleteMany({ where: { platformAccountId: account.id } });
    await prisma.platformAccount.delete({ where: { id: account.id } });
    ok("Cleaned up disposable Mailpit verify rows");
  } finally {
    await prisma.$disconnect();
  }

  console.log("\nc3-mailpit:verify PASSED\n");
}

main().catch((err) => {
  console.error("\nc3-mailpit:verify FAILED:", err instanceof Error ? err.message : err);
  process.exit(1);
});
