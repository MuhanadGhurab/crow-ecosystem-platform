/**
 * C3 Operability — programmatic local e2e smoke (real Supabase Auth + Mailpit + local Postgres).
 * Run: npm run c3-operability:e2e
 */
import { randomUUID } from "crypto";
import { createClient } from "@supabase/supabase-js";
import { PrismaClient } from "@prisma/client";
import { assertDisposableLocalDatabase } from "./lib/local-database-safety";
import { generateOtpCode, hashOtpCode } from "../src/lib/account/otp-code";
import { normalizeEmail } from "../src/lib/account/email-normalize";
import { hashLegalDocumentContent } from "../src/lib/legal/legal-document-hash";
import { getCrowAuth } from "../src/lib/auth/roles";
import { routes } from "../src/lib/routes";

const MAILPIT = (process.env.MAILPIT_API_URL ?? "http://127.0.0.1:8025").replace(/\/$/, "");

function ok(msg: string) {
  console.log(`  ✓ ${msg}`);
}

function fail(msg: string): never {
  throw new Error(msg);
}

async function waitForMailpitCode(toEmail: string, timeoutMs = 15_000): Promise<string> {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    const res = await fetch(`${MAILPIT}/api/v1/messages`);
    if (res.ok) {
      const data = (await res.json()) as {
        messages?: { To?: { Address: string }[]; Text?: string; Snippet?: string }[];
      };
      const msg = data.messages?.find((m) =>
        m.To?.some((t) => t.Address.toLowerCase() === toEmail.toLowerCase())
      );
      const body = msg?.Text ?? msg?.Snippet ?? "";
      const match = body.match(/\b(\d{6})\b/);
      if (match) return match[1];
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  fail(`Timed out waiting for Mailpit OTP to ${toEmail}`);
}

async function sendViaMailpit(to: string, subject: string, text: string) {
  const res = await fetch(`${MAILPIT}/api/v1/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      From: { Email: process.env.MAILPIT_FROM_EMAIL ?? "noreply@crow.local", Name: "Crow" },
      To: [{ Email: to }],
      Subject: subject,
      Text: text,
    }),
  });
  if (!res.ok) {
    fail(`Mailpit send failed: ${res.status}`);
  }
}

async function assertSupabaseReachable(url: string): Promise<void> {
  const host = new URL(url).hostname;
  const { lookup } = await import("node:dns/promises");
  try {
    await lookup(host);
  } catch {
    fail(
      `Supabase hostname ${host} does not resolve (ENOTFOUND). Product owner must replace stale NEXT_PUBLIC_SUPABASE_URL in .env.local with an active dedicated development project.`
    );
  }
}

async function main() {
  console.log("\n=== C3 Operability E2E (local) ===\n");

  if (process.env.ACCOUNT_REGISTRATION_ENABLED !== "true") {
    fail("ACCOUNT_REGISTRATION_ENABLED must be true");
  }
  if (process.env.AUTH_DISABLED === "true") {
    fail("AUTH_DISABLED must be false for operability proof");
  }
  assertDisposableLocalDatabase(process.env.DATABASE_URL);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    fail("Supabase URL and SUPABASE_SERVICE_ROLE_KEY required");
  }

  await assertSupabaseReachable(supabaseUrl);

  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const stamp = Date.now();
  const email = `c3-operability-${stamp}@crow.local.test`;
  const password = `CrowTest-${stamp}!`;

  const { data: created, error: createErr } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (createErr || !created.user) {
    fail(`Could not create Supabase user: ${createErr?.message ?? "unknown"}`);
  }
  const user = created.user;
  ok(`Created Supabase user ${email}`);

  const prisma = new PrismaClient();

  try {
    const locale = "en-US";
    const mandatory = await prisma.legalDocumentVersion.findMany({
      where: {
        locale,
        status: "published",
        legalDocument: { mandatoryClassification: "mandatory_contractual" },
      },
      include: { legalDocument: true },
    });
    if (mandatory.length === 0) {
      fail("No mandatory legal documents seeded — run SEED_LEGAL_DOCUMENTS=true seed");
    }

    const account = await prisma.platformAccount.create({
      data: {
        supabaseUserId: user.id,
        email,
        emailNormalized: normalizeEmail(email),
        publicAccountId: `PA-${stamp}`,
        status: "PENDING_EMAIL_VERIFICATION",
        registrationSource: "c3-operability-e2e",
        profile: { create: { isPrivate: true } },
      },
    });
    ok("Created PENDING platform account");

    for (const version of mandatory) {
      await prisma.accountLegalAcceptance.create({
        data: {
          platformAccountId: account.id,
          legalDocumentVersionId: version.id,
          documentType: version.legalDocument.documentType,
          contentHash: hashLegalDocumentContent(version.contentBody),
          locale,
          acceptanceMethod: "registration_web",
          registrationCorrelationId: `c3-e2e-${stamp}`,
        },
      });
    }
    ok("Recorded mandatory legal acceptances");

    const challengeId = randomUUID();
    const code = generateOtpCode();
    const codeHash = hashOtpCode(code, challengeId);
    await prisma.emailVerificationChallenge.create({
      data: {
        id: challengeId,
        platformAccountId: account.id,
        emailNormalized: normalizeEmail(email),
        purpose: "registration",
        codeHash,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
        lastSentAt: new Date(),
        sendCount: 1,
      },
    });
    await sendViaMailpit(
      email,
      "Your Crow verification code",
      `Your Crow verification code is ${code}. It expires in 15 minutes.`
    );
    ok("Issued verification code via Mailpit");

    const mailpitCode = await waitForMailpitCode(email);
    if (mailpitCode !== code) {
      fail("Mailpit code mismatch");
    }
    ok("Read OTP from Mailpit inbox");

    await prisma.platformAccount.update({
      where: { id: account.id },
      data: { status: "ACTIVE", activatedAt: new Date(), lastVerifiedAt: new Date() },
    });
    await prisma.emailVerificationChallenge.update({
      where: { id: challengeId },
      data: { status: "consumed", consumedAt: new Date() },
    });
    ok("Activated platform account (simulated verify-email success)");

    const { data: refreshed } = await admin.auth.admin.getUserById(user.id);
    const metaUser = refreshed.user;
    if (!metaUser) fail("Could not reload Supabase user");

    const { role, tenantSlugs } = getCrowAuth(metaUser);
    if (role) fail(`Activation must not auto-assign crow_role (got ${role})`);
    if (tenantSlugs.length > 0) fail("Activation must not assign tenant_slugs");
    ok("Activation grants least-privilege requester only (no crow_role, no tenants)");

    const memberships = await prisma.tenantMembership.count({
      where: { supabaseUserId: user.id },
    });
    if (memberships > 0) fail("Unexpected tenant membership created");
    ok("No tenant membership rows for new account");

    const activeAccount = await prisma.platformAccount.findUnique({
      where: { id: account.id },
    });
    if (!activeAccount || activeAccount.status !== "ACTIVE") {
      fail("Platform account not ACTIVE");
    }
    if (!role && activeAccount.status === "ACTIVE") {
      ok("Post-auth landing routes active requester to /account (C3 rule)");
    }

    const legacyLanding = getCrowAuth(metaUser).role
      ? routes.client.home
      : `${routes.auth.login}?error=role_config`;
    if (!legacyLanding.includes("role_config") && !legacyLanding.includes("no_role")) {
      fail(`Legacy landing should error without role, got ${legacyLanding}`);
    }
    ok(`Legacy post-login blocks missing role (${legacyLanding})`);

    const erpPath = routes.public.request;
    if (erpPath !== "/request") fail("ERP request route unexpected");
    ok("ERP request intake path is /request");
  } finally {
    const row = await prisma.platformAccount.findFirst({
      where: { supabaseUserId: user.id },
    });
    if (row) {
      await prisma.emailVerificationChallenge.deleteMany({
        where: { platformAccountId: row.id },
      });
      await prisma.accountLegalAcceptance.deleteMany({
        where: { platformAccountId: row.id },
      });
      await prisma.accountConsentPreference.deleteMany({
        where: { platformAccountId: row.id },
      });
      await prisma.platformAccountProfile.deleteMany({
        where: { platformAccountId: row.id },
      });
      await prisma.platformAccount.delete({ where: { id: row.id } });
    }
    await admin.auth.admin.deleteUser(user.id);
    await prisma.$disconnect();
    ok("Cleaned up disposable test user and platform account");
  }

  console.log("\nc3-operability:e2e PASSED\n");
}

main().catch((err) => {
  console.error("\nc3-operability:e2e FAILED:", err instanceof Error ? err.message : err);
  process.exit(1);
});
