/**
 * C3.7B — Preview session micro-proof (password sign-in cookie persistence).
 *
 * Run: npm run c3-preview-session:verify
 * Requires: .env.staging, Playwright, VERCEL_AUTOMATION_BYPASS_SECRET.
 */
import { createClient } from "@supabase/supabase-js";
import { PrismaClient } from "@prisma/client";
import { chromium, request } from "playwright";
import { normalizeEmail } from "../src/lib/account/email-normalize";
import {
  automationBypassHeaders,
  verifyAutomationBypassReachable,
} from "./lib/c3-preview-automation-bypass";
import { newBypassBrowserContext } from "./lib/c3-preview-playwright-context";
import { postDocumentSignOut } from "./lib/c3-preview-post-sign-out";
import {
  assertFixtureLanding,
  ensureSessionFixturePassword,
  expectedLandingPattern,
  resolveSessionFixtureCredentials,
  validateSessionFixtureAccount,
} from "./lib/c3-preview-session-fixtures";

const PREVIEW_BASE =
  process.env.C3_PREVIEW_BASE_URL?.replace(/\/$/, "") ??
  "https://crow-ecosystem-platform-l5ngz2rty-muhanadghurabs-projects.vercel.app";

function ok(msg: string) {
  console.log(`  ✓ ${msg}`);
}

function fail(msg: string): never {
  throw new Error(msg);
}

function supabaseAuthCookiePrefix(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const match = url.match(/https?:\/\/([^.]+)\./);
  return `sb-${match?.[1] ?? "project"}-auth-token`;
}

function resolveSessionCredentials(): { email: string; password: string } {
  const fixture = resolveSessionFixtureCredentials("requester");
  return { email: fixture.email, password: fixture.password };
}

function isSupabaseAuthCookieName(name: string): boolean {
  return name.startsWith(supabaseAuthCookiePrefix());
}

/** ISOLATED_API_SESSION — does not share browser cookies. */
async function probeSignInResponseHeaders(
  baseUrl: string,
  email: string,
  password: string
): Promise<{ location: string; supabaseSetCookieNames: string[]; status: number }> {
  const api = await request.newContext({
    extraHTTPHeaders: automationBypassHeaders(),
  });

  try {
    await api.get(`${baseUrl}/login`);
    const response = await api.post(`${baseUrl}/login/submit`, {
      form: { email, password },
      maxRedirects: 0,
    });

    const location = response.headers()["location"] ?? "";
    const supabaseSetCookieNames = response
      .headersArray()
      .filter((header) => header.name.toLowerCase() === "set-cookie")
      .map((header) => header.value.match(/^([^=]+)=/)?.[1] ?? "")
      .filter((name) => name.length > 0 && isSupabaseAuthCookieName(name));

    return { location, supabaseSetCookieNames, status: response.status() };
  } finally {
    await api.dispose();
  }
}

async function main() {
  const prisma = new PrismaClient();
  const { email, password } = resolveSessionCredentials();

  console.log(`\n=== C3 Preview session verify (${PREVIEW_BASE}) ===\n`);

  await verifyAutomationBypassReachable(PREVIEW_BASE);
  ok("Automation bypass reaches Preview");

  const account = await prisma.platformAccount.findFirst({
    where: { emailNormalized: normalizeEmail(email) },
  });
  if (!account) {
    fail(`No PlatformAccount for controlled test email (${email})`);
  }
  if (account.status !== "ACTIVE") {
    fail(`PlatformAccount must be ACTIVE (got ${account.status})`);
  }
  ok(`Controlled active test user exists (status=ACTIVE)`);

  await validateSessionFixtureAccount(prisma, resolveSessionFixtureCredentials("requester"));
  ok("SESSION_REQUESTER_FIXTURE validated (no client crow_role)");

  await ensureSessionFixturePassword(account.supabaseUserId, password);
  ok("SESSION_REQUESTER_FIXTURE password provisioned");

  const { location, supabaseSetCookieNames, status } = await probeSignInResponseHeaders(
    PREVIEW_BASE,
    email,
    password
  );
  ok("ISOLATED_API_SESSION: POST /login/submit probe completed");

  if (status !== 303) {
    fail(`POST /login/submit expected 303, got ${status}`);
  }
  ok("POST /login/submit returns 303");

  const locationUrl = new URL(location, PREVIEW_BASE);
  const previewOrigin = new URL(PREVIEW_BASE);
  if (locationUrl.host !== previewOrigin.host) {
    fail(`Location host mismatch: ${locationUrl.host} vs ${previewOrigin.host}`);
  }
  const authenticatedDestinations = ["/account"];
  if (
    !authenticatedDestinations.some(
      (path) =>
        locationUrl.pathname === path || locationUrl.pathname.startsWith(`${path}/`)
    )
  ) {
    fail(
      `SESSION_REQUESTER_FIXTURE: expected /account redirect from POST /login/submit probe, got ${locationUrl.pathname}`
    );
  }
  ok(`Location is same-origin ${locationUrl.pathname}`);

  if (supabaseSetCookieNames.length === 0) {
    fail("Response Set-Cookie headers missing Supabase auth cookie names");
  }
  ok(`Response Set-Cookie includes Supabase auth names: ${supabaseSetCookieNames.join(", ")}`);

  const browser = await chromium.launch({ headless: true });
  const context = await newBypassBrowserContext(browser);
  const page = await context.newPage();

  try {
    await page.goto(`${PREVIEW_BASE}/login`, { waitUntil: "networkidle" });
    await page.fill("#email", email);
    await page.fill("#password", password);
    await Promise.all([
      page.waitForURL((url) => expectedLandingPattern("requester").test(url.pathname), {
        timeout: 90_000,
      }),
      page.getByRole("button", { name: /sign in with email/i }).click(),
    ]);
    await assertFixtureLanding(page.url(), "requester");
    if (page.url().includes("/login")) {
      fail("BROWSER_DOCUMENT_SESSION: form sign-in did not reach an authenticated route");
    }

    const jarAfterSignIn = await context.cookies(PREVIEW_BASE);
    const authJarNames = jarAfterSignIn
      .filter((cookie) => isSupabaseAuthCookieName(cookie.name))
      .map((cookie) => cookie.name);
    if (authJarNames.length === 0) {
      fail("Browser cookie jar missing Supabase auth cookie names after sign-in");
    }
    ok(`Browser jar has Supabase auth cookie names: ${authJarNames.join(", ")}`);

    const vercelJwtOnly =
      jarAfterSignIn.length > 0 &&
      jarAfterSignIn.every(
        (cookie) => cookie.name === "_vercel_jwt" || cookie.name.startsWith("_vercel")
      );
    if (vercelJwtOnly) {
      fail("_vercel_jwt present but Supabase application session cookies are absent");
    }
    ok("_vercel_jwt is not mistaken for application session");

    const reloadPath = new URL(page.url()).pathname;
    await page.reload({ waitUntil: "networkidle" });
    if (page.url().includes("/login")) {
      fail(`${reloadPath} reload redirected to login — session not persistent`);
    }
    ok(`${reloadPath} survives hard reload`);

    await page.goto(`${PREVIEW_BASE}/account/profile`, { waitUntil: "networkidle" });
    if (page.url().includes("/login")) {
      fail("/account/profile redirected to login");
    }
    await page.waitForSelector("#displayName", { timeout: 60_000 });
    ok("/account/profile loads with authenticated session");

    await postDocumentSignOut(page, PREVIEW_BASE);
    const jarAfterSignOut = await context.cookies();
    const authAfterSignOut = jarAfterSignOut.filter((cookie) =>
      isSupabaseAuthCookieName(cookie.name)
    );
    if (authAfterSignOut.length > 0) {
      fail("Supabase auth cookies remain after sign-out");
    }
    ok("Sign-out removes Supabase auth cookies");

    await page.goto(`${PREVIEW_BASE}/login`, { waitUntil: "networkidle" });
    await page.fill("#email", email);
    await page.fill("#password", password);
    await Promise.all([
      page.waitForURL((url) => expectedLandingPattern("requester").test(url.pathname), {
        timeout: 90_000,
      }),
      page.getByRole("button", { name: /sign in with email/i }).click(),
    ]);
    await assertFixtureLanding(page.url(), "requester");
    const jarAfterSecondSignIn = await context.cookies();
    if (!jarAfterSecondSignIn.some((cookie) => isSupabaseAuthCookieName(cookie.name))) {
      fail("Second sign-in did not restore Supabase auth cookies");
    }
    ok("Second sign-in restores Supabase auth cookies");

    console.log(
      "\nPASS — SUPABASE SESSION PERSISTS ACROSS REDIRECT, RELOAD, AND PROTECTED SUBROUTE\n"
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
