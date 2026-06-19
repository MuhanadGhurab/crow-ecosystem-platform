/**
 * C3.7B — Preview session micro-proof (password sign-in cookie persistence).
 *
 * Run: npm run c3-preview-session:verify
 * Requires: .env.staging, Playwright, Vercel CLI (deployment-protection bypass).
 */
import { execSync } from "node:child_process";
import { PrismaClient } from "@prisma/client";
import { chromium } from "playwright";
import { normalizeEmail } from "../src/lib/account/email-normalize";

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

function getVercelBypassToken(baseUrl: string): string {
  const out = execSync(`npx vercel curl -v "${baseUrl}/api/health" 2>&1`, {
    encoding: "utf8",
    cwd: process.cwd(),
    timeout: 120_000,
    stdio: ["pipe", "pipe", "pipe"],
  });
  const match = out.match(/x-vercel-protection-bypass:\s*(\S+)/i);
  if (!match?.[1]) {
    fail("Could not extract Vercel deployment-protection bypass token");
  }
  return match[1];
}

function resolveSessionCredentials(): { email: string; password: string } {
  const emailRaw =
    process.env.C3_PREVIEW_SESSION_EMAIL?.trim() ||
    process.env.C3_PROVIDER_TEST_EMAIL?.trim() ||
    process.env.NOTIFICATION_TEST_EMAIL?.trim();
  const password = process.env.C3_PREVIEW_SESSION_PASSWORD?.trim();

  if (!emailRaw?.includes("@")) {
    fail("Set C3_PREVIEW_SESSION_EMAIL or NOTIFICATION_TEST_EMAIL in .env.staging");
  }
  if (!password) {
    fail("Set C3_PREVIEW_SESSION_PASSWORD in .env.staging (active controlled test user)");
  }

  const [local, domain] = emailRaw.split("@");
  return {
    email: normalizeEmail(`${local.split("+")[0]}@${domain}`),
    password,
  };
}

function isSupabaseAuthCookieName(name: string): boolean {
  return name.startsWith(supabaseAuthCookiePrefix());
}

async function main() {
  const prisma = new PrismaClient();
  const { email, password } = resolveSessionCredentials();
  const bypass = getVercelBypassToken(PREVIEW_BASE);

  console.log(`\n=== C3 Preview session verify (${PREVIEW_BASE}) ===\n`);

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

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    extraHTTPHeaders: {
      "x-vercel-protection-bypass": bypass,
      "x-vercel-set-bypass-cookie": "true",
    },
  });
  const page = await context.newPage();

  try {
    await page.goto(`${PREVIEW_BASE}/login`, { waitUntil: "networkidle" });
    await page.fill("#email", email);
    await page.fill("#password", password);

    const signInResponsePromise = page.waitForResponse(
      (response) =>
        response.url().includes("/login/submit") && response.request().method() === "POST",
      { timeout: 90_000 }
    );

    await page.getByRole("button", { name: /sign in with email/i }).click();
    const signInResponse = await signInResponsePromise;

    if (signInResponse.status() !== 303) {
      fail(`POST /login/submit expected 303, got ${signInResponse.status()}`);
    }
    ok("POST /login/submit returns 303");

    const location = signInResponse.headers()["location"] ?? "";
    const locationUrl = new URL(location, PREVIEW_BASE);
    const previewOrigin = new URL(PREVIEW_BASE);
    if (locationUrl.host !== previewOrigin.host) {
      fail(`Location host mismatch: ${locationUrl.host} vs ${previewOrigin.host}`);
    }
    if (locationUrl.pathname !== "/account" && !locationUrl.pathname.startsWith("/account")) {
      fail(`Expected same-origin /account redirect, got ${locationUrl.pathname}`);
    }
    ok(`Location is same-origin ${locationUrl.pathname}`);

    const responseHeaderNames = signInResponse
      .headersArray()
      .filter((header) => header.name.toLowerCase() === "set-cookie")
      .flatMap((header) => {
        const nameMatch = header.value.match(/^([^=]+)=/);
        return nameMatch?.[1] ? [nameMatch[1]] : [];
      });
    const supabaseSetCookieNames = responseHeaderNames.filter(isSupabaseAuthCookieName);
    if (supabaseSetCookieNames.length === 0) {
      fail("Response Set-Cookie headers missing Supabase auth cookie names");
    }
    ok(`Response Set-Cookie includes Supabase auth names: ${supabaseSetCookieNames.join(", ")}`);

    await page.waitForURL((url) => url.pathname === "/account", { timeout: 90_000 });
    if (page.url().includes("/login")) {
      fail("Browser did not land on /account after sign-in");
    }

    const jarAfterSignIn = await context.cookies();
    const authJarNames = jarAfterSignIn
      .filter((cookie) => isSupabaseAuthCookieName(cookie.name))
      .map((cookie) => cookie.name);
    if (authJarNames.length === 0) {
      fail("Browser cookie jar missing Supabase auth cookie names after sign-in");
    }
    ok(`Browser jar has Supabase auth cookie names: ${authJarNames.join(", ")}`);

    const vercelJwtOnly =
      jarAfterSignIn.length > 0 &&
      jarAfterSignIn.every((cookie) => cookie.name === "_vercel_jwt" || cookie.name.startsWith("_vercel"));
    if (vercelJwtOnly) {
      fail("_vercel_jwt present but Supabase application session cookies are absent");
    }
    ok("_vercel_jwt is not mistaken for application session");

    await page.reload({ waitUntil: "networkidle" });
    if (page.url().includes("/login")) {
      fail("/account reload redirected to login — session not persistent");
    }
    ok("/account survives hard reload");

    await page.goto(`${PREVIEW_BASE}/account/profile`, { waitUntil: "networkidle" });
    if (page.url().includes("/login")) {
      fail("/account/profile redirected to login");
    }
    await page.waitForSelector("#displayName", { timeout: 60_000 });
    ok("/account/profile loads with authenticated session");

    const profileResponse = await page.request.get(`${PREVIEW_BASE}/account/profile`, {
      headers: {
        "x-vercel-protection-bypass": bypass,
        "x-vercel-set-bypass-cookie": "true",
      },
    });
    if (profileResponse.status() !== 200) {
      fail(`Fresh GET /account/profile expected 200, got ${profileResponse.status()}`);
    }
    ok("Second fresh request to /account/profile succeeds");

    await page.goto(`${PREVIEW_BASE}/auth/signout`, { waitUntil: "networkidle" });
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
      page.waitForURL((url) => url.pathname === "/account", { timeout: 90_000 }),
      page.getByRole("button", { name: /sign in with email/i }).click(),
    ]);
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
