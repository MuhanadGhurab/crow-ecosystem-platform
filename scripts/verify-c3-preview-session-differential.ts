/**
 * C3.7C — Differential Preview session proof (controlled vs freshly activated user).
 *
 * Run: npm run c3-preview-session:differential
 */
import { execSync } from "node:child_process";
import { createHmac } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";
import { PrismaClient } from "@prisma/client";
import { chromium, type Browser, type BrowserContext, type Page } from "playwright";
import { normalizeEmail } from "../src/lib/account/email-normalize";
import { assertPreviewHost, previewBypassHeaders } from "./lib/c3-preview-host-guard";
import {
  captureBrowserSignInTrace,
  formatComparisonTable,
  type SessionFlowTrace,
} from "./lib/c3-preview-session-trace";

const PREVIEW_BASE =
  process.env.C3_PREVIEW_BASE_URL?.replace(/\/$/, "") ??
  "https://crow-ecosystem-platform-l5ngz2rty-muhanadghurabs-projects.vercel.app";

const OUT_DIR = join(process.cwd(), "docs/internal/c3-session-differential");
const REPORT_PATH = join(OUT_DIR, "session-differential-report.json");

function ok(msg: string) {
  console.log(`  ✓ ${msg}`);
}

function fail(msg: string): never {
  throw new Error(msg);
}

function getVercelBypassToken(baseUrl: string): string {
  const out = execSync(`npx vercel curl -v "${baseUrl}/api/health" 2>&1`, {
    encoding: "utf8",
    cwd: process.cwd(),
    timeout: 120_000,
    stdio: ["pipe", "pipe", "pipe"],
  });
  const match = out.match(/x-vercel-protection-bypass:\s*(\S+)/i);
  if (!match?.[1]) fail("Could not extract Vercel deployment-protection bypass token");
  return match[1];
}

function buildFreshTestEmail(): string {
  const base =
    process.env.C3_PROVIDER_TEST_EMAIL?.trim() ||
    process.env.NOTIFICATION_TEST_EMAIL?.trim();
  if (!base?.includes("@")) {
    fail("Set C3_PROVIDER_TEST_EMAIL or NOTIFICATION_TEST_EMAIL in .env.staging");
  }
  const [local, domain] = base.split("@");
  return `${local.split("+")[0]}@${domain}`;
}

function cleanupTestEmail(email: string) {
  process.env.C3_CLEANUP_EMAIL = email;
  execSync("npm run c3-preview-controlled:cleanup", {
    cwd: process.cwd(),
    stdio: "inherit",
    timeout: 120_000,
  });
}

function resolveControlledCredentials(): { email: string; password: string } {
  const emailRaw =
    process.env.C3_PREVIEW_SESSION_EMAIL?.trim() ||
    process.env.C3_PROVIDER_TEST_EMAIL?.trim() ||
    process.env.NOTIFICATION_TEST_EMAIL?.trim();
  if (!emailRaw?.includes("@")) {
    fail("Set C3_PREVIEW_SESSION_EMAIL or NOTIFICATION_TEST_EMAIL");
  }
  const [local, domain] = emailRaw.split("@");
  const email = normalizeEmail(`${local.split("+")[0]}@${domain}`);
  const password =
    process.env.C3_PREVIEW_SESSION_PASSWORD?.trim() ?? "CrowSessionPv!9Controlled";
  return { email, password };
}

async function ensureControlledPassword(supabaseUserId: string, password: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!supabaseUrl || !serviceKey) {
    fail("SUPABASE_SERVICE_ROLE_KEY required for controlled session user");
  }
  const admin = createClient(supabaseUrl, serviceKey, {
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

async function runFreshRegistration(
  browser: Browser,
  bypass: string,
  email: string,
  password: string,
  prisma: PrismaClient
): Promise<void> {
  const regContext = await browser.newContext({
    extraHTTPHeaders: previewBypassHeaders(bypass),
  });
  const regPage = await regContext.newPage();

  try {
    await regPage.goto(`${PREVIEW_BASE}/signup`, { waitUntil: "networkidle" });
    assertPreviewHost(regPage.url(), PREVIEW_BASE, "signup");

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
    ok("Fresh user registered, legal accepted, OTP activated");
  } finally {
    await regPage.close();
    await regContext.close();
  }
}

function assertTracePass(trace: SessionFlowTrace, label: string) {
  if (trace.signInPostStatus !== 303) {
    fail(`${label}: expected sign-in 303, got ${trace.signInPostStatus}`);
  }
  if (trace.signInSetCookieNames.length === 0) {
    fail(`${label}: missing Supabase Set-Cookie names on sign-in`);
  }
  if (!trace.sessionProofAfterFirstNav?.authenticated) {
    fail(`${label}: server-side auth false on first navigation`);
  }
  if (!trace.sessionProofAfterFirstNav?.platformAccountActive) {
    fail(`${label}: platform account not active on first navigation`);
  }
  if (trace.finalRoute?.includes("login")) {
    fail(`${label}: hard reload landed on login`);
  }
  if (!trace.sessionProofAfterReload?.authenticated) {
    fail(`${label}: server-side auth false after reload`);
  }
  if (trace.cookieNamesAfterFirstNav.length === 0) {
    fail(`${label}: browser jar missing auth cookies after sign-in`);
  }
  if (trace.reloadRequestCookieNames.length === 0) {
    fail(`${label}: browser jar missing auth cookies after reload`);
  }
}

async function runControlledContextA(
  browser: Browser,
  bypass: string,
  email: string,
  password: string
): Promise<SessionFlowTrace> {
  const context = await browser.newContext({
    extraHTTPHeaders: previewBypassHeaders(bypass),
  });
  const page = await context.newPage();
  try {
    const trace = await captureBrowserSignInTrace({
      page,
      context,
      previewBase: PREVIEW_BASE,
      label: "controlled",
      email,
      password,
      expectedLanding: /^\/(account|client)(\/|$)/,
    });
    assertTracePass(trace, "Controlled user");
    ok("Controlled user session trace passed");
    return trace;
  } finally {
    await page.close();
    await context.close();
  }
}

async function runFreshContextB(
  browser: Browser,
  bypass: string,
  email: string,
  password: string,
  prisma: PrismaClient
): Promise<SessionFlowTrace> {
  cleanupTestEmail(email);
  await runFreshRegistration(browser, bypass, email, password, prisma);

  const loginContext = await browser.newContext({
    extraHTTPHeaders: previewBypassHeaders(bypass),
  });
  const loginPage = await loginContext.newPage();

  try {
    const trace = await captureBrowserSignInTrace({
      page: loginPage,
      context: loginContext,
      previewBase: PREVIEW_BASE,
      label: "fresh",
      email,
      password,
      expectedLanding: /^\/account(\/|$)/,
      loginPath: "/login?verified=1",
    });

    await loginPage.goto(`${PREVIEW_BASE}/account/profile`, { waitUntil: "networkidle" });
    if (loginPage.url().includes("/login")) {
      fail("Fresh user: /account/profile redirected to login");
    }
    await loginPage.waitForSelector("#displayName", { timeout: 60_000 });
    ok("Fresh user: /account/profile loads");

    await loginPage.goto(`${PREVIEW_BASE}/auth/signout`, { waitUntil: "networkidle" });
    await loginPage.goto(`${PREVIEW_BASE}/login`, { waitUntil: "networkidle" });
    await loginPage.fill("#email", email);
    await loginPage.fill("#password", password);
    await Promise.all([
      loginPage.waitForURL((url) => url.pathname === "/account", { timeout: 90_000 }),
      loginPage.getByRole("button", { name: /sign in with email/i }).click(),
    ]);
    const secondJar = (await loginContext.cookies(PREVIEW_BASE))
      .filter((c) => c.name.includes("-auth-token"))
      .map((c) => c.name);
    if (secondJar.length === 0) fail("Fresh user: second sign-in did not restore cookies");
    ok("Fresh user: second sign-in restores session");

    assertTracePass(trace, "Fresh user");
    ok("Fresh user session trace passed");
    return trace;
  } finally {
    await loginPage.close();
    await loginContext.close();
  }
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  const bypass = getVercelBypassToken(PREVIEW_BASE);
  const prisma = new PrismaClient();
  const browser = await chromium.launch({ headless: true });

  console.log(`\n=== C3.7C session differential (${PREVIEW_BASE}) ===\n`);

  try {
    const controlled = resolveControlledCredentials();
    const controlledAccount = await prisma.platformAccount.findFirst({
      where: { emailNormalized: normalizeEmail(controlled.email) },
    });
    if (!controlledAccount || controlledAccount.status !== "ACTIVE") {
      fail("Controlled ACTIVE user required for context A");
    }
    await ensureControlledPassword(controlledAccount.supabaseUserId, controlled.password);
    ok("Controlled user ready");

    const freshEmail = buildFreshTestEmail();
    const freshPassword = `CrowPv-${Date.now().toString(36)}!9`;

    const traceA = await runControlledContextA(
      browser,
      bypass,
      controlled.email,
      controlled.password
    );
    const traceB = await runFreshContextB(
      browser,
      bypass,
      freshEmail,
      freshPassword,
      prisma
    );

    const table = formatComparisonTable(traceA, traceB);
    console.log("\n" + table + "\n");

    const report = {
      previewUrl: PREVIEW_BASE,
      comparisonTableMarkdown: table,
      controlled: traceA,
      fresh: traceB,
      capturedAt: new Date().toISOString(),
    };
    writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));
    ok(`Report: ${REPORT_PATH}`);

    console.log(
      "\nPASS — CONTROLLED AND FRESHLY ACTIVATED USERS RETAIN SSR SESSION ACROSS RELOAD\n"
    );
  } finally {
    await browser.close();
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error("\n✗", err instanceof Error ? err.message : err);
  process.exit(1);
});
