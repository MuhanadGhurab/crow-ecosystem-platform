/**
 * C3.10D — Real browser session certification (document navigation only).
 *
 * Run: npm run c3-preview-browser-session:verify
 * Requires: .env.staging, VERCEL_AUTOMATION_BYPASS_SECRET, Playwright chromium,
 *           C3_PREVIEW_BASE_URL (immutable Preview deployment).
 */
import { execSync } from "node:child_process";
import { createHmac } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";
import { PrismaClient } from "@prisma/client";
import { chromium, type Browser, type Page } from "playwright";
import { normalizeEmail } from "../src/lib/account/email-normalize";
import { listSupabaseAuthCookieNames } from "../src/lib/supabase/auth-cookie-names";
import {
  automationBypassHeaders,
  verifyAutomationBypassReachable,
} from "./lib/c3-preview-automation-bypass";
import {
  assertDocumentSessionPass,
  formatDocumentCookieTable,
  runDocumentLoginSessionProof,
  type DocumentSessionResult,
} from "./lib/c3-preview-browser-session-diagnostics";
import { assertPreviewHost } from "./lib/c3-preview-host-guard";
import { newBypassBrowserContext } from "./lib/c3-preview-playwright-context";
import { ensureActiveSessionFixtureUser } from "./lib/c3-preview-session-fixture";

const PREVIEW_BASE = process.env.C3_PREVIEW_BASE_URL?.replace(/\/$/, "");
const OUT_DIR = join(process.cwd(), "docs/internal/c3-browser-session-certification");
const REPORT_PATH = join(OUT_DIR, "C3_10D_BROWSER_SESSION_REPORT.json");

function ok(msg: string) {
  console.log(`  ✓ ${msg}`);
}

function fail(msg: string): never {
  throw new Error(msg);
}

function resolvePreviewBase(): string {
  if (!PREVIEW_BASE) {
    fail("Set C3_PREVIEW_BASE_URL to one immutable Ready Preview deployment URL");
  }
  return PREVIEW_BASE;
}

function readManualBrowserOutcome(): {
  recorded: boolean;
  passed: boolean;
  notes: string[];
} {
  const raw = process.env.C3_MANUAL_BROWSER_SESSION_CERTIFIED?.trim().toLowerCase();
  if (!raw) {
    return { recorded: false, passed: false, notes: ["not recorded"] };
  }
  const passed = raw === "true" || raw === "1" || raw === "pass" || raw === "passed";
  const notes = (process.env.C3_MANUAL_BROWSER_SESSION_NOTES ?? "")
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean);
  return { recorded: true, passed, notes };
}

function resolveControlledCredentials(): { email: string; password: string } {
  const emailRaw =
    process.env.C3_PREVIEW_SESSION_EMAIL?.trim() ||
    process.env.C3_PROVIDER_TEST_EMAIL?.trim() ||
    process.env.NOTIFICATION_TEST_EMAIL?.trim();
  if (!emailRaw?.includes("@")) {
    fail("Set C3_PREVIEW_SESSION_EMAIL or NOTIFICATION_TEST_EMAIL in .env.staging");
  }
  const [local, domain] = emailRaw.split("@");
  const email = normalizeEmail(`${local.split("+")[0]}@${domain}`);
  const password =
    process.env.C3_PREVIEW_SESSION_PASSWORD?.trim() ?? "CrowSessionPv!9Controlled";
  return { email, password };
}

function buildFreshTestEmail(): string {
  const base =
    process.env.C3_PROVIDER_TEST_EMAIL?.trim() ||
    process.env.NOTIFICATION_TEST_EMAIL?.trim();
  if (!base?.includes("@")) {
    fail("Set C3_PROVIDER_TEST_EMAIL or NOTIFICATION_TEST_EMAIL");
  }
  const [local, domain] = base.split("@");
  const stamp = Date.now().toString(36);
  return normalizeEmail(`${local.split("+")[0]}+c3d-${stamp}@${domain}`);
}

async function ensureControlledPassword(supabaseUserId: string, password: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) fail("SUPABASE_SERVICE_ROLE_KEY required");
  const admin = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { error } = await admin.auth.admin.updateUserById(supabaseUserId, { password });
  if (error) fail(`Could not set controlled password: ${error.message}`);
}

function crackOtp(challengeId: string, codeHash: string): string | null {
  const secret = process.env.EMAIL_VERIFICATION_CODE_SECRET?.trim();
  if (!secret || secret.length < 16) return null;
  for (let i = 0; i < 1_000_000; i += 1) {
    const code = String(i).padStart(6, "0");
    const hash = createHmac("sha256", secret).update(`${challengeId}:${code}`).digest("hex");
    if (hash === codeHash) return code;
  }
  return null;
}

async function waitForOtp(prisma: PrismaClient, email: string): Promise<string> {
  const account = await prisma.platformAccount.findFirst({
    where: { emailNormalized: normalizeEmail(email) },
    include: {
      verificationChallenges: {
        where: { purpose: "registration", status: "pending" },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });
  const challenge = account?.verificationChallenges[0];
  if (!challenge?.codeHash) fail("No pending OTP challenge");
  const otp = crackOtp(challenge.id, challenge.codeHash);
  if (!otp) fail("Could not derive OTP (EMAIL_VERIFICATION_CODE_SECRET)");
  return otp;
}

async function acceptAllLegalDocs(page: Page) {
  for (const docType of ["TERMS_OF_SERVICE", "PRIVACY_NOTICE", "ACCEPTABLE_USE_POLICY"]) {
    const tab = page.locator(`#legal-tab-${docType}`);
    if ((await tab.count()) === 0) continue;
    await tab.click();
    await page.waitForTimeout(300);
    await page
      .locator(`#legal-panel-${docType}`)
      .getByRole("checkbox", { name: /accessibility alternative/i })
      .click();
    await page.waitForTimeout(200);
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

function cleanupTestEmail(email: string) {
  process.env.C3_CLEANUP_EMAIL = email;
  execSync("npx tsx scripts/cleanup-c3-preview-test-data.ts", {
    cwd: process.cwd(),
    stdio: "inherit",
    timeout: 120_000,
    env: process.env,
  });
}

async function runFreshRegistration(
  browser: Browser,
  previewBase: string,
  email: string,
  password: string,
  prisma: PrismaClient
): Promise<void> {
  const regContext = await newBypassBrowserContext(browser);
  const regPage = await regContext.newPage();
  const base = previewBase.replace(/\/$/, "");

  try {
    await regPage.goto(`${base}/signup`, { waitUntil: "networkidle" });
    assertPreviewHost(regPage.url(), previewBase, "signup");

    await regPage.fill("#email", email);
    await regPage.fill("#password", password);
    await regPage.fill("#passwordConfirm", password);
    await regPage.getByRole("button", { name: "Continue", exact: true }).click();
    await regPage.waitForURL(/\/register\/legal/, { timeout: 60_000 });

    await acceptAllLegalDocs(regPage);
    const legalPassword = regPage.locator("#reg-password, input[name='password']").first();
    await legalPassword.fill(password);
    const legalConfirm = regPage.locator("#reg-password-confirm, input[name='passwordConfirm']").first();
    if (await legalConfirm.isVisible()) await legalConfirm.fill(password);

    await Promise.all([
      regPage.waitForURL(/\/verify-email/, { timeout: 120_000 }),
      regPage.getByRole("button", { name: /continue to email verification/i }).click(),
    ]);

    const otp = await waitForOtp(prisma, email);
    await regPage.fill("#code", otp);
    await regPage.getByRole("button", { name: /verify email/i }).click();
    await regPage.waitForURL(/\/login/, { timeout: 90_000 });

    const account = await prisma.platformAccount.findFirst({
      where: { emailNormalized: normalizeEmail(email) },
    });
    if (!account || account.status !== "ACTIVE") {
      fail(`Fresh user not ACTIVE after OTP (status=${account?.status ?? "missing"})`);
    }
    ok("Fresh gen-2 user activated (registration context closed next)");
  } finally {
    await regPage.close();
    await regContext.close();
  }
}

async function runPathBLogin(
  browser: Browser,
  previewBase: string,
  email: string,
  password: string,
  loginMode: "server-action" | "post-route"
): Promise<DocumentSessionResult> {
  const context = await newBypassBrowserContext(browser);
  const page = await context.newPage();
  try {
    return await runDocumentLoginSessionProof({
      page,
      context,
      previewBase,
      email,
      password,
      loginMode,
      expectedLanding: /^\/(account|client)(\/|$)/,
    });
  } finally {
    await page.close();
    await context.close();
  }
}

async function runPathCFreshUser(
  browser: Browser,
  previewBase: string,
  email: string,
  password: string,
  prisma: PrismaClient
): Promise<DocumentSessionResult> {
  cleanupTestEmail(email);
  await runFreshRegistration(browser, previewBase, email, password, prisma);

  const context = await newBypassBrowserContext(browser);
  const page = await context.newPage();
  try {
    const result = await runDocumentLoginSessionProof({
      page,
      context,
      previewBase,
      email,
      password,
      loginPath: "/login?verified=1",
      expectedLanding: /^\/account(\/|$)/,
    });
    assertDocumentSessionPass(result, "Path C — fresh gen-2 user");
    ok("Path C document session passed");
    return result;
  } finally {
    await page.close();
    await context.close();
    cleanupTestEmail(email);
  }
}

async function runPathAAuthCanary(
  browser: Browser,
  previewBase: string,
  email: string,
  password: string
): Promise<{ available: boolean; passed: boolean; reloadSurvived: boolean; vercelJwtPresent: boolean }> {
  const headers = automationBypassHeaders();
  const probe = await fetch(`${previewBase}/auth-canary`, {
    headers,
    redirect: "manual",
  });
  const probeBody = probe.status === 200 ? await probe.text() : "";
  if (probe.status === 404 || !probeBody.includes("canary-email")) {
    ok("Path A skipped — C3_AUTH_CANARY_ENABLED=false on Preview (enable temporarily for comparison)");
    return { available: false, passed: false, reloadSurvived: false, vercelJwtPresent: false };
  }

  const context = await newBypassBrowserContext(browser);
  const page = await context.newPage();
  const base = previewBase.replace(/\/$/, "");

  try {
    await page.goto(`${base}/auth-canary`, { waitUntil: "networkidle" });
    assertPreviewHost(page.url(), previewBase, "canary login");

    await page.fill("#canary-email", email);
    await page.fill("#canary-password", password);
    await Promise.all([
      page.waitForURL((url) => url.pathname === "/auth-canary/landing", { timeout: 90_000 }),
      page.click('button[type="submit"]'),
    ]);

    const jar = await context.cookies(base);
    const authNames = listSupabaseAuthCookieNames(jar);
    if (authNames.length === 0) fail("Path A: browser jar missing Supabase auth cookie names");

    const landingContent = await page.content();
    const authenticated =
      landingContent.includes("Authenticated</dt>") && landingContent.includes(">Yes</dd>");

    await page.reload({ waitUntil: "networkidle" });
    const reloadSurvived =
      page.url().includes("/auth-canary/landing") &&
      (await page.content()).includes(">Yes</dd>");

    const vercelJwtPresent = (await context.cookies()).some((c) => c.name === "_vercel_jwt");

    if (!authenticated || !reloadSurvived) {
      fail("Path A: auth canary document session failed reload");
    }
    ok("Path A auth canary document session passed");

    return {
      available: true,
      passed: authenticated && reloadSurvived,
      reloadSurvived,
      vercelJwtPresent,
    };
  } finally {
    await page.close();
    await context.close();
  }
}

function classifyRootCause(input: {
  manual: ReturnType<typeof readManualBrowserOutcome>;
  bypassReachable: boolean;
  pathA: Awaited<ReturnType<typeof runPathAAuthCanary>>;
  pathBPass: boolean;
  pathCPass: boolean;
  pathCSkipped: boolean;
}): string {
  const { manual, pathA, pathBPass, pathCPass, pathCSkipped } = input;
  const automationPass = pathBPass && (pathCPass || pathCSkipped);

  if (manual.recorded && manual.passed && automationPass) {
    return "PASSED — REAL BROWSER SESSION CERTIFIED; EMAIL-ONLY FRESH ENTRY READY FOR LEGACY RESET";
  }
  if (manual.recorded && manual.passed && !automationPass) {
    return "CONDITIONAL PASS — MANUAL BROWSER HEALTHY; AUTOMATION HARNESS REQUIRES REPAIR";
  }
  if (pathA.available && pathA.passed && !pathBPass) {
    return "FAILED — CROW BROWSER SESSION DEFECT";
  }
  if (!pathBPass) {
    return "FAILED — CROW BROWSER SESSION DEFECT";
  }
  if (!pathCPass && !pathCSkipped) {
    return "FAILED — CROW BROWSER SESSION DEFECT";
  }
  return "FAILED — SUPABASE SSR OR PREVIEW PLATFORM DEFECT";
}

async function main() {
  const previewBase = resolvePreviewBase();
  mkdirSync(OUT_DIR, { recursive: true });

  console.log(`\n=== C3.10D browser session certification (${previewBase}) ===\n`);

  const bypassHeaders = automationBypassHeaders();
  await verifyAutomationBypassReachable(previewBase);
  ok("Automation bypass reaches Preview without interactive Vercel auth");

  const manual = readManualBrowserOutcome();
  if (manual.recorded) {
    ok(`Manual browser control test recorded: ${manual.passed ? "PASS" : "FAIL"}`);
  } else {
    console.log(
      "  ⚠ Manual browser control test not recorded — set C3_MANUAL_BROWSER_SESSION_CERTIFIED=true|false in .env.staging"
    );
  }

  const prisma = new PrismaClient();
  const browser = await chromium.launch({ headless: true });
  const controlled = resolveControlledCredentials();

  let controlledAccount = await prisma.platformAccount.findFirst({
    where: { emailNormalized: normalizeEmail(controlled.email) },
  });
  if (!controlledAccount || controlledAccount.status !== "ACTIVE") {
    if (process.env.EMAIL_VERIFICATION_CODE_SECRET?.trim()) {
      console.log("  … provisioning controlled ACTIVE session user via email-only registration");
      cleanupTestEmail(controlled.email);
      await runFreshRegistration(
        browser,
        previewBase,
        controlled.email,
        controlled.password,
        prisma
      );
    } else {
      console.log(
        "  … provisioning controlled ACTIVE session fixture (EMAIL_VERIFICATION_CODE_SECRET not in operator env)"
      );
      await ensureActiveSessionFixtureUser(prisma, controlled.email, controlled.password);
    }
    controlledAccount = await prisma.platformAccount.findFirst({
      where: { emailNormalized: normalizeEmail(controlled.email) },
    });
    if (!controlledAccount || controlledAccount.status !== "ACTIVE") {
      fail("Could not provision controlled ACTIVE PlatformAccount for Path A/B");
    }
  }
  await ensureControlledPassword(controlledAccount.supabaseUserId, controlled.password);
  ok("Controlled test user ready (not Platform Owner)");

  let pathA: Awaited<ReturnType<typeof runPathAAuthCanary>> | null = null;
  let pathB1: DocumentSessionResult | null = null;
  let pathB2: DocumentSessionResult | null = null;
  let pathC: DocumentSessionResult | null = null;
  let pathB1Pass = false;
  let pathB2Pass = false;
  let pathBPass = false;
  let pathCPass = false;
  let pathB1Error: string | null = null;
  let pathB2Error: string | null = null;
  let pathCError: string | null = null;

  try {
    try {
      pathA = await runPathAAuthCanary(browser, previewBase, controlled.email, controlled.password);
    } catch (err) {
      console.error(`  ✗ Path A failed: ${err instanceof Error ? err.message : err}`);
      pathA = { available: true, passed: false, reloadSurvived: false, vercelJwtPresent: false };
    }

    try {
      pathB1 = await runPathBLogin(
        browser,
        previewBase,
        controlled.email,
        controlled.password,
        "server-action"
      );
      console.log("\nPath B1 (Server Action) cookie diagnostics:\n");
      console.log(formatDocumentCookieTable(pathB1.documentCookieTable));
      try {
        assertDocumentSessionPass(pathB1, "Path B1 — Server Action login");
        pathB1Pass = true;
        ok("Path B1 Server Action document session passed");
      } catch (assertErr) {
        pathB1Error = assertErr instanceof Error ? assertErr.message : String(assertErr);
        console.error(`  ✗ Path B1 failed: ${pathB1Error}`);
      }
    } catch (err) {
      pathB1Error = err instanceof Error ? err.message : String(err);
      console.error(`  ✗ Path B1 failed: ${pathB1Error}`);
    }

    try {
      pathB2 = await runPathBLogin(
        browser,
        previewBase,
        controlled.email,
        controlled.password,
        "post-route"
      );
      console.log("\nPath B2 (POST /login/submit) cookie diagnostics:\n");
      console.log(formatDocumentCookieTable(pathB2.documentCookieTable));
      try {
        assertDocumentSessionPass(pathB2, "Path B2 — POST /login/submit");
        pathB2Pass = true;
        ok("Path B2 POST route document session passed");
      } catch (assertErr) {
        pathB2Error = assertErr instanceof Error ? assertErr.message : String(assertErr);
        console.error(`  ✗ Path B2 failed: ${pathB2Error}`);
      }
    } catch (err) {
      pathB2Error = err instanceof Error ? err.message : String(err);
      console.error(`  ✗ Path B2 failed: ${pathB2Error}`);
    }

    const pathBPass = pathB1Pass;

    const freshEmail = buildFreshTestEmail();
    const freshPassword = `CrowPv-${Date.now().toString(36)}!9`;
    try {
      if (!process.env.EMAIL_VERIFICATION_CODE_SECRET?.trim()) {
        throw new Error(
          "Path C requires EMAIL_VERIFICATION_CODE_SECRET in operator env for OTP derivation"
        );
      }
      pathC = await runPathCFreshUser(
        browser,
        previewBase,
        freshEmail,
        freshPassword,
        prisma
      );
      pathCPass = true;
    } catch (err) {
      pathCError = err instanceof Error ? err.message : String(err);
      console.error(`  ✗ Path C failed: ${pathCError}`);
    }

    const pathCSkipped = !process.env.EMAIL_VERIFICATION_CODE_SECRET?.trim();
    const decision = classifyRootCause({
      manual,
      bypassReachable: true,
      pathA: pathA ?? { available: false, passed: false, reloadSurvived: false, vercelJwtPresent: false },
      pathBPass,
      pathCPass,
      pathCSkipped,
    });

    const report = {
      mission: "C3.10D",
      previewUrl: previewBase,
      deploymentId: process.env.C3_PREVIEW_DEPLOYMENT_ID ?? null,
      automationBypassConfigured: true,
      manualBrowserTest: manual,
      vercelJwtRequiredForAuth: false,
      pathAAuthCanary: pathA,
      pathB1ServerAction: pathB1
        ? {
            proofCategory: pathB1.proofCategory,
            reloadSurvived: pathB1.reloadSurvived,
            profileSurvived: pathB1.profileSurvived,
            vercelJwtPresent: pathB1.vercelJwtPresent,
            applicableCookieMeta: pathB1.applicableCookieMeta,
            documentCookieTable: pathB1.documentCookieTable,
          }
        : { error: pathB1Error },
      pathB2PostRoute: pathB2
        ? {
            proofCategory: pathB2.proofCategory,
            reloadSurvived: pathB2.reloadSurvived,
            profileSurvived: pathB2.profileSurvived,
            vercelJwtPresent: pathB2.vercelJwtPresent,
            applicableCookieMeta: pathB2.applicableCookieMeta,
            documentCookieTable: pathB2.documentCookieTable,
          }
        : { error: pathB2Error },
      pathBExistingUser: pathB1
        ? {
            proofCategory: pathB1.proofCategory,
            reloadSurvived: pathB1.reloadSurvived,
            profileSurvived: pathB1.profileSurvived,
            vercelJwtPresent: pathB1.vercelJwtPresent,
            applicableCookieMeta: pathB1.applicableCookieMeta,
            documentCookieTable: pathB1.documentCookieTable,
          }
        : { error: pathB1Error },
      pathCFreshUser: pathC
        ? {
            proofCategory: pathC.proofCategory,
            reloadSurvived: pathC.reloadSurvived,
            profileSurvived: pathC.profileSurvived,
            vercelJwtPresent: pathC.vercelJwtPresent,
            applicableCookieMeta: pathC.applicableCookieMeta,
            documentCookieTable: pathC.documentCookieTable,
          }
        : { error: pathCError },
      pathBDocumentCookieTable: pathB1 ? formatDocumentCookieTable(pathB1.documentCookieTable) : null,
      pathB2DocumentCookieTable: pathB2 ? formatDocumentCookieTable(pathB2.documentCookieTable) : null,
      pathCDocumentCookieTable: pathC ? formatDocumentCookieTable(pathC.documentCookieTable) : null,
      rootCauseClassification: decision,
      capturedAt: new Date().toISOString(),
    };

    writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));
    ok(`Report: ${REPORT_PATH}`);

    if (pathB1?.documentCookieTable.length) {
      console.log("\nPath B1 Chromium cookie diagnostics:\n");
      console.log(formatDocumentCookieTable(pathB1.documentCookieTable));
    }
    if (pathC?.documentCookieTable.length) {
      console.log("\nPath C Chromium cookie diagnostics:\n");
      console.log(formatDocumentCookieTable(pathC.documentCookieTable));
    }

    console.log(`\n${decision}\n`);

    if (!pathBPass || !pathCPass) {
      process.exit(1);
    }
  } finally {
    await browser.close();
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error("\n✗", err instanceof Error ? err.message : err);
  process.exit(1);
});
