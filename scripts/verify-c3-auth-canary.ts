/**
 * C3.7D — Official Supabase SSR auth canary verification.
 *
 * Run: npm run c3-auth-canary:verify
 * Requires: C3_AUTH_CANARY_ENABLED=true on Preview, Playwright, .env.staging
 */
import { createClient } from "@supabase/supabase-js";
import { PrismaClient } from "@prisma/client";
import { chromium } from "playwright";
import { normalizeEmail } from "../src/lib/account/email-normalize";
import { assertPreviewHost } from "./lib/c3-preview-host-guard";
import { listSupabaseAuthCookieNames } from "../src/lib/supabase/auth-cookie-names";
import {
  automationBypassHeaders,
  verifyAutomationBypassReachable,
} from "./lib/c3-preview-automation-bypass";
import { newBypassBrowserContext } from "./lib/c3-preview-playwright-context";

const PREVIEW_BASE =
  process.env.C3_PREVIEW_BASE_URL?.replace(/\/$/, "") ??
  "https://crow-ecosystem-platform-rfl94wv2j-muhanadghurabs-projects.vercel.app";

const PRODUCTION_BASE =
  process.env.C3_PRODUCTION_BASE_URL?.replace(/\/$/, "") ??
  "https://crow-ecosystem-platform.vercel.app";

function ok(msg: string) {
  console.log(`  ✓ ${msg}`);
}

function fail(msg: string): never {
  throw new Error(msg);
}

function resolveCredentials(): { email: string; password: string } {
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

async function ensurePassword(supabaseUserId: string, password: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) fail("SUPABASE_SERVICE_ROLE_KEY required");
  const admin = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { error } = await admin.auth.admin.updateUserById(supabaseUserId, { password });
  if (error) fail(`Could not set canary test password: ${error.message}`);
}

async function assertLandingAuthenticated(page: import("playwright").Page) {
  const content = await page.content();
  if (!content.includes("Authenticated</dt>") || !content.includes(">Yes</dd>")) {
    fail("Canary landing did not show server-authenticated state");
  }
  if (!content.includes("Server identity validated</dt>")) {
    fail("Canary landing missing identity proof");
  }
}

async function main() {
  const prisma = new PrismaClient();
  const { email, password } = resolveCredentials();

  console.log(`\n=== C3 Auth Canary verify (${PREVIEW_BASE}) ===\n`);

  await verifyAutomationBypassReachable(PREVIEW_BASE);
  ok("Automation bypass reaches Preview");

  const prodResponse = await fetch(`${PRODUCTION_BASE}/auth-canary`, { redirect: "follow" });
  const prodBody = await prodResponse.text();
  if (prodResponse.status === 200 && prodBody.includes("Official Supabase SSR canary")) {
    fail("Production exposes auth canary surface");
  }
  ok("Production does not expose auth canary (not 200 with canary UI)");

  const previewDisabled = await fetch(`${PREVIEW_BASE}/auth-canary`, {
    headers: automationBypassHeaders(),
    redirect: "manual",
  });
  if (previewDisabled.status === 404) {
    fail(
      "Preview /auth-canary returned 404 — set C3_AUTH_CANARY_ENABLED=true and redeploy"
    );
  }
  ok("Preview canary route is available");

  const account = await prisma.platformAccount.findFirst({
    where: { emailNormalized: normalizeEmail(email) },
  });
  if (!account || account.status !== "ACTIVE") {
    fail("Controlled ACTIVE Supabase test user required");
  }
  await ensurePassword(account.supabaseUserId, password);
  ok("Controlled test user ready");

  const browser = await chromium.launch({ headless: true });
  const context = await newBypassBrowserContext(browser);
  const page = await context.newPage();

  try {
    await page.goto(`${PREVIEW_BASE}/auth-canary`, { waitUntil: "networkidle" });
    assertPreviewHost(page.url(), PREVIEW_BASE, "canary login");
    ok("Canary login page loads");

    await page.fill("#canary-email", email);
    await page.fill("#canary-password", password);
    await Promise.all([
      page.waitForURL((url) => url.pathname === "/auth-canary/landing", { timeout: 90_000 }),
      page.click('button[type="submit"]'),
    ]);
    assertPreviewHost(page.url(), PREVIEW_BASE, "post canary sign-in");
    ok("Server Action sign-in redirected to landing");

    const jar = await context.cookies(PREVIEW_BASE);
    const authNames = listSupabaseAuthCookieNames(jar);
    if (authNames.length === 0) fail("Browser jar missing Supabase auth cookie names");
    ok(`Browser received Supabase cookie names: ${authNames.join(", ")}`);

    await assertLandingAuthenticated(page);
    ok("Landing validates user server-side");

    await page.reload({ waitUntil: "networkidle" });
    assertPreviewHost(page.url(), PREVIEW_BASE, "landing reload");
    if (page.url().includes("/auth-canary") && !page.url().includes("/landing")) {
      fail("Landing hard reload lost session (redirected to login form)");
    }
    await assertLandingAuthenticated(page);
    ok("Landing survives hard reload");

    await page.goto(`${PREVIEW_BASE}/auth-canary/secondary`, { waitUntil: "networkidle" });
    assertPreviewHost(page.url(), PREVIEW_BASE, "secondary");
    const secondaryContent = await page.content();
    if (!secondaryContent.includes(">Yes</dd>")) {
      fail("Secondary page did not validate authenticated user");
    }
    ok("Secondary page validates independently");

    await page.reload({ waitUntil: "networkidle" });
    const secondaryReload = await page.content();
    if (!secondaryReload.includes(">Yes</dd>")) {
      fail("Secondary hard reload lost session");
    }
    ok("Secondary survives hard reload");

    await page.goto(`${PREVIEW_BASE}/auth-canary/landing`, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: /sign out/i }).click();
    await page.waitForURL((url) => url.pathname === "/auth-canary", { timeout: 60_000 });
    const afterSignOut = await context.cookies(PREVIEW_BASE);
    if (listSupabaseAuthCookieNames(afterSignOut).length > 0) {
      fail("Sign-out left Supabase auth cookies in jar");
    }
    ok("Sign-out clears session");

    await page.goto(`${PREVIEW_BASE}/auth-canary/landing`, { waitUntil: "networkidle" });
    const deniedBody = await page.content();
    if (
      deniedBody.includes("Server identity validated</dt>") &&
      deniedBody.match(/Server identity validated[\s\S]*?>Yes<\/dd>/)
    ) {
      fail("Landing still shows authenticated after sign-out");
    }
    ok("Landing denies after sign-out");

    await page.goto(`${PREVIEW_BASE}/auth-canary`, { waitUntil: "networkidle" });
    await page.fill("#canary-email", email);
    await page.fill("#canary-password", password);
    await Promise.all([
      page.waitForURL((url) => url.pathname === "/auth-canary/landing", { timeout: 90_000 }),
      page.click('button[type="submit"]'),
    ]);
    await assertLandingAuthenticated(page);
    ok("Second sign-in restores session");

    console.log("\nPASS — OFFICIAL SUPABASE SSR CANARY SESSION SURVIVES RELOAD\n");
  } finally {
    await browser.close();
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error("\n✗", err instanceof Error ? err.message : err);
  process.exit(1);
});
