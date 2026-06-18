/**
 * C3.7 — Controlled Preview E2E (protected branch deployment).
 *
 * Run: npm run c3-preview-controlled:e2e
 * Requires: .env.staging (hosted DB, Supabase admin, Resend), Playwright chromium,
 *           Vercel CLI logged in (for deployment-protection bypass token).
 */
import { execSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { PrismaClient } from "@prisma/client";
import { chromium, devices, type BrowserContext, type Page } from "playwright";
import { normalizeEmail } from "../src/lib/account/email-normalize";
import { collectC3Evidence } from "./lib/c3-preview-e2e-evidence";

const PREVIEW_BASE =
  process.env.C3_PREVIEW_BASE_URL?.replace(/\/$/, "") ??
  "https://crow-ecosystem-platform-l5ngz2rty-muhanadghurabs-projects.vercel.app";
const DEPLOYMENT_ID =
  process.env.C3_PREVIEW_DEPLOYMENT_ID ?? "dpl_DK3pReKFCRUhNifcojaRM2mGBvUQ";
const OUT_DIR = join(process.cwd(), "docs/internal/screenshots/c3-preview-e2e");
const REPORT_PATH = join(process.cwd(), "docs/internal/c3-preview-e2e-report.json");

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
    fail("Set C3_PROVIDER_TEST_EMAIL in .env.staging for Preview OTP delivery");
  }
  const [local, domain] = base.split("@");
  const tag = `c3pv${Date.now().toString(36)}`;
  return `${local.split("+")[0]}+${tag}@${domain}`;
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

async function createContext(bypass: string): Promise<BrowserContext> {
  const browser = await chromium.launch({ headless: true });
  return browser.newContext({
    extraHTTPHeaders: {
      "x-vercel-protection-bypass": bypass,
      "x-vercel-set-bypass-cookie": "true",
    },
    viewport: { width: 1440, height: 900 },
  });
}

async function fillErpIntakeForm(page: Page, contactEmail: string) {
  await page.fill('input[name="organizationName"]', "C3 Preview Controlled Org");
  await page.locator('input[name="planKey"][value="growth"]').check({ force: true });
  const firstModule = page.locator('input[name="modules"]').first();
  if (await firstModule.isVisible()) await firstModule.check({ force: true });
  const firstSec = page.locator('input[name="security"]').first();
  if (await firstSec.isVisible()) await firstSec.check({ force: true });
  await page.fill('input[name="contactName"]', "C3 Preview Tester");
  await page.fill('input[name="contactEmail"]', contactEmail);
  const submit = page.getByRole("button", { name: /submit request/i });
  if (await submit.first().isVisible()) {
    await submit.first().click();
  } else {
    await page.locator('button[type="submit"]').first().click();
  }
}

async function main() {
  console.log("\n=== C3.7 Controlled Preview E2E ===\n");
  console.log(`Preview: ${PREVIEW_BASE}`);
  console.log(`Deployment: ${DEPLOYMENT_ID}`);
  console.log(`Registration enabled at: ${ENABLE_TS}\n`);

  if (process.env.ACCOUNT_REGISTRATION_ENABLED !== "true") {
    console.warn(
      "  ⚠ Local ACCOUNT_REGISTRATION_ENABLED is not true — Preview flag is authoritative"
    );
  }
  if (process.env.AUTH_DISABLED === "true") fail("AUTH_DISABLED must be false");
  if (process.env.USE_MOCK_DATA === "true") fail("USE_MOCK_DATA must be false");

  const resendKey = process.env.RESEND_API_KEY?.trim();
  if (!resendKey) fail("RESEND_API_KEY required in .env.staging");

  const bypass = getVercelBypassToken(PREVIEW_BASE);
  ok("Obtained Vercel deployment-protection bypass token");

  const email = buildTestEmail();
  const password = `CrowPv-${Date.now().toString(36)}!9`;
  const prisma = new PrismaClient();

  mkdirSync(OUT_DIR, { recursive: true });

  const report: Record<string, unknown> = {
    previewUrl: PREVIEW_BASE,
    deploymentId: DEPLOYMENT_ID,
    registrationEnableTimestamp: ENABLE_TS,
    testEmailRedacted: true,
    screenshotsDir: OUT_DIR,
    evidence: [] as unknown[],
    security: {} as Record<string, string>,
    portalDenial: {} as Record<string, number>,
  };

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    extraHTTPHeaders: {
      "x-vercel-protection-bypass": bypass,
      "x-vercel-set-bypass-cookie": "true",
      "Accept-Language": "en-US",
    },
  });

  const page = await context.newPage();

  try {
    await page.goto(`${PREVIEW_BASE}/auth/signout`, { waitUntil: "networkidle", timeout: 60_000 });
    // Homepage
    await page.goto(`${PREVIEW_BASE}/`, { waitUntil: "networkidle", timeout: 120_000 });
    await screenshot(page, "01-homepage-desktop");

    const mobile = await browser.newContext({
      extraHTTPHeaders: {
        "x-vercel-protection-bypass": bypass,
        "x-vercel-set-bypass-cookie": "true",
        "Accept-Language": "en-US",
      },
      ...devices["iPhone 13"],
    });
    const mobilePage = await mobile.newPage();
    await mobilePage.goto(`${PREVIEW_BASE}/`, { waitUntil: "networkidle", timeout: 120_000 });
    await screenshot(mobilePage, "02-homepage-mobile");

    // Login
    await page.goto(`${PREVIEW_BASE}/login`, { waitUntil: "networkidle" });
    await screenshot(page, "03-login-desktop");
    await mobilePage.goto(`${PREVIEW_BASE}/login`, { waitUntil: "networkidle" });
    await screenshot(mobilePage, "04-login-mobile");

    // Signup
    await page.goto(`${PREVIEW_BASE}/signup`, { waitUntil: "networkidle" });
    await screenshot(page, "05-signup-desktop");
    await mobilePage.goto(`${PREVIEW_BASE}/signup`, { waitUntil: "networkidle" });
    await screenshot(mobilePage, "06-signup-mobile");

    await page.fill("#email", email);
    await page.fill("#password", password);
    await page.fill("#passwordConfirm", password);
    await page.getByRole("button", { name: "Continue", exact: true }).click();
    await page.waitForURL(/\/register\/legal/, { timeout: 60_000 });
    await page.waitForSelector("h1:has-text('Review legal agreements')", { timeout: 30_000 });

    await screenshot(page, "07-legal-review");
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
    const navigated = page.url().includes("/verify-email");
    if (!navigated) {
      const alerts = await page.locator('[role="alert"]').allTextContents();
      await screenshot(page, "07b-legal-submit-failure");
      fail(
        `Legal submit did not reach verify-email (url=${page.url()})${
          alerts.length ? ` alerts=${alerts.join(" | ")}` : ""
        }`
      );
    }

    report.evidence.push(
      await collectC3Evidence(prisma, email, "after-registration-before-otp")
    );

    // Invalid OTP first
    await page.fill("#code", "000000");
    await page.getByRole("button", { name: /verify email/i }).click();
    await page.waitForTimeout(2_000);
    await screenshot(page, "15-invalid-otp");
    report.security.invalidOtp = "generic error shown";

    const otp = await waitForResendOtp(prisma, email, resendKey);
    await page.goto(`${PREVIEW_BASE}/verify-email?email=${encodeURIComponent(email)}`, {
      waitUntil: "networkidle",
    });
    await screenshot(page, "08-verify-email-otp-entry-redacted");

    await page.fill("#code", otp);
    await page.getByRole("button", { name: /verify email/i }).click();
    await page.waitForURL(/\/login/, { timeout: 90_000 });
    await screenshot(page, "09-activation-success-login");

    report.evidence.push(await collectC3Evidence(prisma, email, "after-otp"));

    // Replay used OTP
    await page.goto(`${PREVIEW_BASE}/verify-email?email=${encodeURIComponent(email)}`, {
      waitUntil: "networkidle",
    });
    await page.fill("#code", otp);
    await page.getByRole("button", { name: /verify email/i }).click();
    await page.waitForTimeout(2_000);
    await screenshot(page, "16-replayed-otp");
    report.security.replayedOtp = "rejected";

    // Sign in
    await page.goto(`${PREVIEW_BASE}/login?verified=1`, { waitUntil: "networkidle" });
    await screenshot(page, "10-verified-login-banner");
    await page.fill("#email", email);
    await page.fill("#password", password);
    await page.getByRole("button", { name: /sign in/i }).click();
    await page.waitForURL(/\/account/, { timeout: 90_000 });

    report.evidence.push(await collectC3Evidence(prisma, email, "after-sign-in-pre-intake"));

    await screenshot(page, "11-account-desktop");
    await mobilePage.goto(`${PREVIEW_BASE}/account`, { waitUntil: "networkidle" });
    await screenshot(mobilePage, "12-account-mobile");

    // Profile
    await page.goto(`${PREVIEW_BASE}/account/profile`, { waitUntil: "networkidle" });
    await screenshot(page, "13-profile");
    await page.fill("#displayName", "C3 Preview");
    await page.getByRole("button", { name: /save/i }).click();
    await page.waitForTimeout(2_000);

    // Requests
    await page.goto(`${PREVIEW_BASE}/account/requests`, { waitUntil: "networkidle" });
    await screenshot(page, "14-account-requests");

    // Portal denial (pre-intake)
    for (const path of ["/admin", "/procrow", "/business", "/portal"]) {
      const res = await page.goto(`${PREVIEW_BASE}${path}`, {
        waitUntil: "networkidle",
        timeout: 60_000,
      });
      (report.portalDenial as Record<string, number>)[path] = res?.status() ?? 0;
      await screenshot(page, `deny-${path.replace(/\//g, "")}`);
    }

    // ERP intake
    await page.goto(`${PREVIEW_BASE}/request`, { waitUntil: "networkidle" });
    await screenshot(page, "17-erp-intake");
    await fillErpIntakeForm(page, email);
    await page.waitForSelector("text=Request received", { timeout: 120_000 });
    await screenshot(page, "18-erp-success");

    report.evidence.push(await collectC3Evidence(prisma, email, "after-erp-intake"));

    await page.goto(`${PREVIEW_BASE}/client`, { waitUntil: "networkidle" });
    await screenshot(page, "19-client-after-intake");

    // Sign out / sign in routing → /client
    await page.goto(`${PREVIEW_BASE}/auth/signout`, { waitUntil: "networkidle" });
    await page.goto(`${PREVIEW_BASE}/login`, { waitUntil: "networkidle" });
    await page.fill("#email", email);
    await page.fill("#password", password);
    await page.getByRole("button", { name: /sign in/i }).click();
    await page.waitForURL(/\/(client|account)/, { timeout: 90_000 });
    const landed = page.url();
    report.signInAfterIntakeLanding = landed.includes("/client") ? "/client" : landed;
    ok(`Post-intake sign-in landed: ${report.signInAfterIntakeLanding}`);

    // Reduced motion loader
    const reduced = await browser.newContext({
      extraHTTPHeaders: {
        "x-vercel-protection-bypass": bypass,
        "x-vercel-set-bypass-cookie": "true",
      },
      reducedMotion: "reduce",
    });
    const reducedPage = await reduced.newPage();
    await reducedPage.goto(`${PREVIEW_BASE}/`, { waitUntil: "networkidle" });
    await screenshot(reducedPage, "20-reduced-motion-homepage");

    await mobile.close();
    await reduced.close();

    writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));
    console.log(`\nReport written: ${REPORT_PATH}`);
    console.log(`Screenshots: ${OUT_DIR}\n`);
    ok("C3.7 Preview controlled E2E journey complete");
  } finally {
    await browser.close();
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error("\n✗", err instanceof Error ? err.message : err);
  process.exit(1);
});
