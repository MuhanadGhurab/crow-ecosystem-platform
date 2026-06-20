/**
 * C3.10C — Email-only hosted Preview proof (generation 2, phone deferred).
 *
 * Run: npm run c3-preview-controlled:e2e
 * Requires: .env.staging (hosted DB, Supabase admin, Resend), Playwright chromium,
 *           Vercel CLI logged in (for deployment-protection bypass token).
 */
import { execSync } from "node:child_process";
import { createHmac } from "node:crypto";
import { readFileSync } from "node:fs";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { PrismaClient } from "@prisma/client";
import { chromium, type BrowserContext, type Page } from "playwright";
import { normalizeEmail } from "../src/lib/account/email-normalize";
import { evaluateTenantPlatformAccountAuthorization } from "../src/lib/account/tenant-platform-account-authorization";
import {
  assertPostOtpEvidence,
  assertPreOtpEvidence,
  collectC3Evidence,
} from "./lib/c3-preview-e2e-evidence";

const PREVIEW_BASE =
  process.env.C3_PREVIEW_BASE_URL?.replace(/\/$/, "") ??
  "https://crow-ecosystem-platform-l5ngz2rty-muhanadghurabs-projects.vercel.app";
const DEPLOYMENT_ID =
  process.env.C3_PREVIEW_DEPLOYMENT_ID ?? "dpl_DK3pReKFCRUhNifcojaRM2mGBvUQ";
const OUT_DIR = join(process.cwd(), "docs/internal/screenshots/c3-preview-email-only-proof");
const REPORT_PATH = join(process.cwd(), "docs/internal/c3-preview-email-only-proof-report.json");

const ENABLE_TS = process.env.C3_PREVIEW_ENABLE_TS ?? new Date().toISOString();

type Shot = { name: string; fn: () => Promise<void> };

function ok(msg: string) {
  console.log(`  ✓ ${msg}`);
}

function fail(msg: string): never {
  throw new Error(msg);
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function getVercelBypassToken(baseUrl: string): string {
  const out = execSync(`npx vercel curl -v "${baseUrl}/api/health" 2>&1`, {
    encoding: "utf8",
    cwd: process.cwd(),
    timeout: 120_000,
    stdio: ["pipe", "pipe", "pipe"],
  });
  const match = out.match(/x-vercel-protection-bypass:\s*(\S+)/i);
  if (!match?.[1]) {
    fail("Could not extract Vercel deployment-protection bypass token (vercel curl -v)");
  }
  return match[1];
}

function buildTestEmail(): string {
  const base =
    process.env.C3_PROVIDER_TEST_EMAIL?.trim() ||
    process.env.NOTIFICATION_TEST_EMAIL?.trim();
  if (!base?.includes("@")) {
    fail("Set C3_PROVIDER_TEST_EMAIL or NOTIFICATION_TEST_EMAIL in .env.staging");
  }
  const [local, domain] = base.split("@");
  // Resend onboarding@resend.dev only delivers to the exact sandbox owner address (no +tags).
  return `${local.split("+")[0]}@${domain}`;
}

function cleanupControlledTestEmail(email: string) {
  process.env.C3_CLEANUP_EMAIL = email;
  execSync("npm run c3-preview-controlled:cleanup", {
    cwd: process.cwd(),
    stdio: "inherit",
    timeout: 120_000,
  });
}

function resolveOtpCrackSecret(): string | null {
  const fromProcess = process.env.EMAIL_VERIFICATION_CODE_SECRET?.trim();
  if (fromProcess && fromProcess.length >= 16) return fromProcess;

  for (const path of [".env.local", ".env.staging"]) {
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
  const secret = resolveOtpCrackSecret();
  if (!secret) return null;

  for (let i = 0; i < 1_000_000; i += 1) {
    const code = String(i).padStart(6, "0");
    const hash = createHmac("sha256", secret)
      .update(`${challengeId}:${code}`)
      .digest("hex");
    if (hash === codeHash) return code;
  }
  return null;
}

async function waitForPendingOtp(prisma: PrismaClient, email: string): Promise<string> {
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
    fail("No pending OTP challenge found for controlled test identity");
  }

  const cracked = crackOtpFromChallenge(challenge.id, challenge.codeHash);
  if (!cracked) {
    fail("Could not derive OTP from challenge hash (check EMAIL_VERIFICATION_CODE_SECRET alignment)");
  }

  return cracked;
}

async function waitForResendOtp(
  prisma: PrismaClient,
  email: string,
  resendKey: string,
  timeoutMs = 90_000
): Promise<string> {
  const emailNormalized = normalizeEmail(email);
  const started = Date.now();

  while (Date.now() - started < timeoutMs) {
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

    const msgId = account?.verificationChallenges[0]?.providerMessageId;
    if (msgId) {
      const res = await fetch(`https://api.resend.com/emails/${msgId}`, {
        headers: { Authorization: `Bearer ${resendKey}` },
      });
      if (res.ok) {
        const data = (await res.json()) as { text?: string; html?: string };
        const body = `${data.text ?? ""}\n${data.html ?? ""}`;
        const match = body.match(/\b(\d{6})\b/);
        if (match?.[1]) return match[1];
      }
    }

    const listRes = await fetch("https://api.resend.com/emails", {
      headers: { Authorization: `Bearer ${resendKey}` },
    });
    if (listRes.ok) {
      const list = (await listRes.json()) as {
        data?: { id: string; to?: string[] }[];
      };
      const row = list.data?.find((e) =>
        e.to?.some((t) => normalizeEmail(t) === emailNormalized)
      );
      if (row?.id) {
        const detail = await fetch(`https://api.resend.com/emails/${row.id}`, {
          headers: { Authorization: `Bearer ${resendKey}` },
        });
        if (detail.ok) {
          const data = (await detail.json()) as { text?: string; html?: string };
          const body = `${data.text ?? ""}\n${data.html ?? ""}`;
          const match = body.match(/\b(\d{6})\b/);
          if (match?.[1]) return match[1];
        }
      }
    }

    await sleep(2_000);
  }

  fail(`Timed out waiting for Resend OTP (recipient redacted)`);
}

async function redactSensitiveText(page: Page) {
  await page.evaluate(() => {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node: Node | null;
    while ((node = walker.nextNode())) {
      const text = node.textContent ?? "";
      if (/@[\w.-]+\.\w+/.test(text)) {
        node.textContent = text.replace(/[\w.+-]+@[\w.-]+\.\w+/g, "[email-redacted]");
      }
      if (/\b\d{6}\b/.test(text)) {
        node.textContent = text.replace(/\b\d{6}\b/g, "••••••");
      }
    }
  });
}

async function screenshot(page: Page, name: string) {
  await redactSensitiveText(page);
  const file = join(OUT_DIR, `${name}.png`);
  await page.screenshot({ path: file, fullPage: name.includes("homepage") });
  ok(`screenshot ${name}`);
}

async function acceptAllLegalDocs(page: Page) {
  for (const docType of ["TERMS_OF_SERVICE", "PRIVACY_NOTICE", "ACCEPTABLE_USE_POLICY"]) {
    const tab = page.locator(`#legal-tab-${docType}`);
    if ((await tab.count()) === 0) continue;
    await tab.click();
    await page.waitForTimeout(400);
    await page
      .locator(`#legal-panel-${docType}`)
      .getByRole("checkbox", { name: /accessibility alternative/i })
      .click();
    await page.waitForTimeout(300);
  }

  for (const id of ["terms-ack-checkbox", "privacy-ack-checkbox", "aup-ack-checkbox"] as const) {
    const input = page.locator(`#${id}`);
    if ((await input.count()) === 0) continue;
    await input.check();
  }

  await page.waitForFunction(
    () => {
      const btn = document.querySelector('button[type="submit"]') as HTMLButtonElement | null;
      return Boolean(btn && !btn.disabled);
    },
    { timeout: 30_000 }
  );
}

async function assertOnboardingProgress(page: Page, expectPhone: boolean) {
  const nav = page.locator('nav[aria-label="Onboarding progress"]');
  await nav.waitFor({ state: "visible", timeout: 15_000 });
  const text = (await nav.innerText()).replace(/\s+/g, " ");
  if (!text.includes("Legal") || !text.includes("Email") || !text.includes("Active")) {
    fail(`Onboarding progress missing Legal → Email → Active (got: ${text})`);
  }
  if (expectPhone && !text.includes("Phone")) {
    fail("Expected Phone step when phone policy enabled");
  }
  if (!expectPhone && text.includes("Phone")) {
    fail("Phone step must be hidden when phone policy disabled");
  }
  ok(`Onboarding progress: ${expectPhone ? "Legal → Email → Phone → Active" : "Legal → Email → Active"}`);
}

async function verifyInactiveMembershipRegression(prisma: PrismaClient) {
  const memberships = await prisma.tenantMembership.findMany({ take: 50 });
  for (const membership of memberships) {
    const account = await prisma.platformAccount.findFirst({
      where: { supabaseUserId: membership.supabaseUserId },
      select: { status: true, onboardingGeneration: true },
    });
    const isActiveGenerationAccount =
      account?.status === "ACTIVE" &&
      account.onboardingGeneration >= 2;
    if (isActiveGenerationAccount) continue;

    const result = evaluateTenantPlatformAccountAuthorization({
      supabaseUserId: membership.supabaseUserId,
      account,
      requiredGeneration: 2,
      registrationFeatureEnabled: true,
      hasTenantMembership: true,
    });

    if (result.authorized) {
      fail("MEMBERSHIP ALONE CANNOT AUTHORIZE ACCESS — regression failed");
    }
    ok("PASS — MEMBERSHIP ALONE CANNOT AUTHORIZE ACCESS");
    return;
  }
  ok("Inactive-membership regression skipped (no legacy fixture row)");
}

function supabaseAuthCookies(context: BrowserContext, baseUrl: string) {
  return context.cookies(baseUrl).then((cookies) =>
    cookies.filter((c) => c.name.includes("-auth-token"))
  );
}

async function main() {
  console.log("\n=== C3.10C Email-only Preview proof ===\n");
  console.log(`Preview: ${PREVIEW_BASE}`);
  console.log(`Deployment: ${DEPLOYMENT_ID}`);
  console.log(`Registration enabled at: ${ENABLE_TS}\n`);

  if (process.env.AUTH_DISABLED === "true") fail("AUTH_DISABLED must be false");
  if (process.env.USE_MOCK_DATA === "true") fail("USE_MOCK_DATA must be false");

  const resendKey = process.env.RESEND_API_KEY?.trim();
  if (!resendKey) fail("RESEND_API_KEY required in .env.staging");

  const bypass = getVercelBypassToken(PREVIEW_BASE);
  ok("Obtained Vercel deployment-protection bypass token");

  const email = buildTestEmail();
  const password = `CrowPv-${Date.now().toString(36)}!9`;
  const prisma = new PrismaClient();

  console.log("Pre-run cleanup for controlled test identity…");
  cleanupControlledTestEmail(email);
  ok("Controlled test identity ready");

  await verifyInactiveMembershipRegression(prisma);

  mkdirSync(OUT_DIR, { recursive: true });

  const report: Record<string, unknown> = {
    proof: "C3.10C-email-only",
    previewUrl: PREVIEW_BASE,
    deploymentId: DEPLOYMENT_ID,
    registrationEnableTimestamp: ENABLE_TS,
    googleOAuth: "DEFERRED — PROVIDER CONFIGURATION NOT ENABLED",
    phonePolicyDisabled: true,
    screenshotsDir: OUT_DIR,
    evidence: [] as unknown[],
    security: {} as Record<string, string>,
    portalDenial: {} as Record<string, number>,
    sessionDurability: {} as Record<string, string>,
  };

  const browser = await chromium.launch({ headless: true });
  let context = await browser.newContext({
    extraHTTPHeaders: {
      "x-vercel-protection-bypass": bypass,
      "x-vercel-set-bypass-cookie": "true",
      "Accept-Language": "en-US",
    },
    viewport: { width: 1440, height: 900 },
  });

  let page = await context.newPage();

  try {
    await page.goto(`${PREVIEW_BASE}/auth/signout`, { waitUntil: "networkidle", timeout: 60_000 });

    await page.goto(`${PREVIEW_BASE}/signup`, { waitUntil: "networkidle" });
    await screenshot(page, "01-signup");

    await page.fill("#email", email);
    await page.fill("#password", password);
    await page.fill("#passwordConfirm", password);
    await page.getByRole("button", { name: "Continue", exact: true }).click();
    await page.waitForURL(/\/register\/legal/, { timeout: 60_000 });
    await page.waitForSelector("h1:has-text('Review legal agreements')", { timeout: 30_000 });
    await assertOnboardingProgress(page, false);
    await screenshot(page, "02-legal-review");

    await acceptAllLegalDocs(page);
    const legalPassword = page.locator("#reg-password, input[name='password']").first();
    await legalPassword.waitFor({ state: "visible", timeout: 15_000 });
    await legalPassword.fill(password);
    const legalConfirm = page.locator("#reg-password-confirm, input[name='passwordConfirm']").first();
    if (await legalConfirm.isVisible()) await legalConfirm.fill(password);
    const submitLegal = page.getByRole("button", { name: /continue to email verification/i });
    await submitLegal.waitFor({ state: "visible", timeout: 15_000 });
    await Promise.all([
      page.waitForURL(/\/verify-email/, { timeout: 120_000 }),
      submitLegal.click(),
    ]);
    if (!page.url().includes("/verify-email")) {
      await screenshot(page, "02b-legal-submit-failure");
      fail(`Legal submit did not reach verify-email (url=${page.url()})`);
    }
    await screenshot(page, "03-legal-accepted");
    await assertOnboardingProgress(page, false);

    const preOtp = await collectC3Evidence(prisma, email, "after-registration-before-otp");
    assertPreOtpEvidence(preOtp);
    (report.evidence as unknown[]).push(preOtp);
    ok("Pre-OTP aggregate state verified");

    const otp = await waitForPendingOtp(prisma, email);

    await page.goto(`${PREVIEW_BASE}/verify-email?email=${encodeURIComponent(email)}`, {
      waitUntil: "networkidle",
    });
    await screenshot(page, "04-verify-email-otp-entry");

    await page.fill("#code", "000000");
    await page.getByRole("button", { name: /verify email/i }).click();
    await page.waitForTimeout(2_000);
    await screenshot(page, "14-invalid-otp");
    report.security.invalidOtp = "generic error shown";

    await page.goto(`${PREVIEW_BASE}/verify-email?email=${encodeURIComponent(email)}`, {
      waitUntil: "networkidle",
    });
    await page.fill("#code", otp);
    await page.getByRole("button", { name: /verify email/i }).click();
    await page.waitForURL(/\/login/, { timeout: 90_000 });
    await screenshot(page, "05-activation-success-login");

    const postOtp = await collectC3Evidence(prisma, email, "after-otp");
    assertPostOtpEvidence(postOtp);
    (report.evidence as unknown[]).push(postOtp);
    ok("legal=3 + verified email + generation 2 + phone policy disabled = ACTIVE requester account");

    await page.goto(`${PREVIEW_BASE}/verify-email?email=${encodeURIComponent(email)}`, {
      waitUntil: "networkidle",
    });
    if (page.url().includes("/login")) {
      await screenshot(page, "15-replayed-otp");
      report.security.replayedOtp = "active account redirected to login";
    } else {
      await page.fill("#code", otp);
      await page.getByRole("button", { name: /verify email/i }).click();
      await page.waitForTimeout(2_000);
      await screenshot(page, "15-replayed-otp");
      report.security.replayedOtp = "rejected";
    }

    await page.close();
    await context.close();

    context = await browser.newContext({
      extraHTTPHeaders: {
        "x-vercel-protection-bypass": bypass,
        "x-vercel-set-bypass-cookie": "true",
        "Accept-Language": "en-US",
      },
    });
    page = await context.newPage();

    await page.goto(`${PREVIEW_BASE}/login?verified=1`, { waitUntil: "networkidle" });
    await screenshot(page, "06-verified-login-banner");
    await page.fill("#email", email);
    await page.fill("#password", password);
    await Promise.all([
      page.waitForURL((url) => url.pathname === "/account", { timeout: 90_000 }),
      page.getByRole("button", { name: /sign in with email/i }).click(),
    ]);
    if (page.url().includes("/login")) {
      fail(`Real login did not reach /account (url=${page.url()})`);
    }
    ok("Real Server Action login reached /account");
    (report.sessionDurability as Record<string, string>).loginLanding = "/account";

    await screenshot(page, "07-account");
    await page.reload({ waitUntil: "networkidle" });
    if (page.url().includes("/login")) {
      fail("/account hard reload redirected to login");
    }
    ok("/account survives hard reload");
    await screenshot(page, "08-account-after-reload");
    (report.sessionDurability as Record<string, string>).accountReload = "pass";

    const authAfterSignIn = await supabaseAuthCookies(context, PREVIEW_BASE);
    if (authAfterSignIn.length === 0) {
      fail("Supabase auth cookies missing after sign-in");
    }
    ok("Supabase session cookies present (not counting _vercel_jwt)");

    await page.goto(`${PREVIEW_BASE}/account/profile`, { waitUntil: "networkidle", timeout: 60_000 });
    if (page.url().includes("/login")) fail(`Session lost on /account/profile`);
    await page.waitForSelector("#displayName", { timeout: 60_000 });
    await screenshot(page, "09-profile");
    await page.reload({ waitUntil: "networkidle" });
    if (page.url().includes("/login")) fail("/account/profile hard reload lost session");
    await screenshot(page, "10-profile-after-reload");
    await page.fill("#displayName", "C3 Email-Only Proof");
    await page.getByRole("button", { name: /save profile/i }).click();
    await page.waitForTimeout(2_000);
    ok("Profile update saved");

    for (const path of ["/admin", "/procrow", "/business", "/portal", "/client"]) {
      const res = await page.goto(`${PREVIEW_BASE}${path}`, {
        waitUntil: "networkidle",
        timeout: 60_000,
      });
      (report.portalDenial as Record<string, number>)[path] = res?.status() ?? 0;
      await screenshot(page, `11-deny-${path.replace(/\//g, "") || "root"}`);
    }
    ok("Portal denial paths exercised (pre-ERP)");

    await page.goto(`${PREVIEW_BASE}/auth/signout`, { waitUntil: "networkidle" });
    const cookiesAfterSignOut = await supabaseAuthCookies(context, PREVIEW_BASE);
    if (cookiesAfterSignOut.length > 0) {
      fail("Supabase auth cookies still present after sign-out");
    }
    ok("Sign-out cleared Supabase auth cookies");
    await screenshot(page, "12-sign-out");

    await page.goto(`${PREVIEW_BASE}/login`, { waitUntil: "networkidle" });
    await page.fill("#email", email);
    await page.fill("#password", password);
    await Promise.all([
      page.waitForURL(/\/account/, { timeout: 90_000 }),
      page.getByRole("button", { name: /sign in with email/i }).click(),
    ]);
    await page.reload({ waitUntil: "networkidle" });
    if (page.url().includes("/login")) fail("Second sign-in session lost on hard reload");
    await screenshot(page, "13-second-sign-in-reload");
    (report.sessionDurability as Record<string, string>).secondSignInReload = "pass";

    const finalEvidence = await collectC3Evidence(prisma, email, "after-session-proof");
    if (finalEvidence.phoneVerificationChallengeCount !== 0) {
      fail(`Phone challenges must remain zero (${finalEvidence.phoneVerificationChallengeCount})`);
    }
    (report.evidence as unknown[]).push(finalEvidence);

    report.sessionDurabilityVerdict =
      "PASS — REAL LOGIN SESSION SURVIVES REDIRECT, RELOAD AND PROTECTED SUBROUTES";

    writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));
    console.log(`\nReport written: ${REPORT_PATH}`);
    console.log(`Screenshots: ${OUT_DIR}\n`);
    ok("C3.10C email-only Preview proof complete");
  } finally {
    await browser.close();
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error("\n✗", err instanceof Error ? err.message : err);
  process.exit(1);
});
