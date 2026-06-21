/**
 * C3.7D — A/B canary vs custom login differential (sanitized).
 *
 * Run: npm run c3-auth-canary:differential
 */
import { execSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";
import { PrismaClient } from "@prisma/client";
import { chromium, type BrowserContext, type Page } from "playwright";
import { normalizeEmail } from "../src/lib/account/email-normalize";
import { assertPreviewHost, previewBypassHeaders } from "./lib/c3-preview-host-guard";
import { listSupabaseAuthCookieNames } from "../src/lib/supabase/auth-cookie-names";

const PREVIEW_BASE =
  process.env.C3_PREVIEW_BASE_URL?.replace(/\/$/, "") ??
  "https://crow-ecosystem-platform-rfl94wv2j-muhanadghurabs-projects.vercel.app";

const OUT_DIR = join(process.cwd(), "docs/internal/c3-session-differential");
const REPORT_PATH = join(OUT_DIR, "AUTH_CANARY_DIFFERENTIAL.md");

export type AuthPathTrace = {
  label: string;
  signInSucceeded: boolean;
  setCookieNames: string[];
  cookieNamesAfterSignIn: string[];
  landingAuthYes: boolean;
  reloadAuthYes: boolean;
  finalPath: string;
};

function ok(msg: string) {
  console.log(`  ✓ ${msg}`);
}

function fail(msg: string): never {
  throw new Error(msg);
}

function getBypass(baseUrl: string) {
  const out = execSync(`npx vercel curl -v "${baseUrl}/api/health" 2>&1`, {
    encoding: "utf8",
    cwd: process.cwd(),
    timeout: 120_000,
  });
  const match = out.match(/x-vercel-protection-bypass:\s*(\S+)/i);
  if (!match?.[1]) fail("No deployment-protection bypass token");
  return match[1];
}

function resolveCredentials() {
  const emailRaw =
    process.env.C3_PREVIEW_SESSION_EMAIL?.trim() ||
    process.env.NOTIFICATION_TEST_EMAIL?.trim();
  if (!emailRaw?.includes("@")) fail("Set NOTIFICATION_TEST_EMAIL");
  const [local, domain] = emailRaw.split("@");
  return {
    email: normalizeEmail(`${local.split("+")[0]}@${domain}`),
    password: process.env.C3_PREVIEW_SESSION_PASSWORD?.trim() ?? "CrowSessionPv!9Controlled",
  };
}

async function landingShowsAuth(page: Page): Promise<boolean> {
  const html = await page.content();
  return /Authenticated<\/dt>[\s\S]*?>Yes<\/dd>/.test(html);
}

async function runCanaryPath(
  context: BrowserContext,
  email: string,
  password: string
): Promise<AuthPathTrace> {
  const page = await context.newPage();
  const trace: AuthPathTrace = {
    label: "canary-server-action",
    signInSucceeded: false,
    setCookieNames: [],
    cookieNamesAfterSignIn: [],
    landingAuthYes: false,
    reloadAuthYes: false,
    finalPath: "",
  };

  try {
    await page.goto(`${PREVIEW_BASE}/auth-canary`, { waitUntil: "networkidle" });
    await page.fill("#canary-email", email);
    await page.fill("#canary-password", password);
    await Promise.all([
      page.waitForURL((u) => u.pathname === "/auth-canary/landing", { timeout: 90_000 }),
      page.click('button[type="submit"]'),
    ]);
    trace.signInSucceeded = true;
    trace.cookieNamesAfterSignIn = listSupabaseAuthCookieNames(
      await context.cookies(PREVIEW_BASE)
    );
    trace.setCookieNames = trace.cookieNamesAfterSignIn;
    trace.landingAuthYes = await landingShowsAuth(page);
    await page.reload({ waitUntil: "networkidle" });
    trace.reloadAuthYes = await landingShowsAuth(page);
    trace.finalPath = new URL(page.url()).pathname;
    assertPreviewHost(page.url(), PREVIEW_BASE, "canary path");
    return trace;
  } finally {
    await page.close();
  }
}

async function runCustomLoginPath(
  context: BrowserContext,
  email: string,
  password: string
): Promise<AuthPathTrace> {
  const page = await context.newPage();
  const trace: AuthPathTrace = {
    label: "crow-login-submit",
    signInSucceeded: false,
    setCookieNames: [],
    cookieNamesAfterSignIn: [],
    landingAuthYes: false,
    reloadAuthYes: false,
    finalPath: "",
  };

  try {
    await page.goto(`${PREVIEW_BASE}/login`, { waitUntil: "networkidle" });
    await page.fill("#email", email);
    await page.fill("#password", password);

    const [response] = await Promise.all([
      page.waitForResponse(
        (r) =>
          r.request().method() === "POST" && new URL(r.url()).pathname === "/login/submit",
        { timeout: 90_000 }
      ),
      page.waitForURL((u) => u.pathname === "/account" || u.pathname === "/client", {
        timeout: 90_000,
      }),
      page.getByRole("button", { name: /sign in with email/i }).click(),
    ]);

    trace.signInSucceeded = response.status() === 303;
    trace.cookieNamesAfterSignIn = listSupabaseAuthCookieNames(
      await context.cookies(PREVIEW_BASE)
    );
    trace.setCookieNames = trace.cookieNamesAfterSignIn;
    const onAccount = new URL(page.url()).pathname;
    trace.landingAuthYes = onAccount === "/account" || onAccount === "/client";
    await page.reload({ waitUntil: "networkidle" });
    trace.reloadAuthYes = !page.url().includes("/login");
    trace.finalPath = new URL(page.url()).pathname;
    assertPreviewHost(page.url(), PREVIEW_BASE, "custom login path");
    return trace;
  } finally {
    await page.close();
  }
}

function formatReport(canary: AuthPathTrace, custom: AuthPathTrace): string {
  const row = (signal: string, a: string, b: string) => `| ${signal} | ${a} | ${b} |`;
  return [
    "# Auth Canary A/B Differential (C3.7D)",
    "",
    `Preview: ${PREVIEW_BASE}`,
    "",
    "| Signal | Path A — /auth-canary (Server Action) | Path B — /login/submit (Route Handler) |",
    "| --- | --- | --- |",
    row("Sign-in succeeded", String(canary.signInSucceeded), String(custom.signInSucceeded)),
    row("Cookie names after sign-in", canary.cookieNamesAfterSignIn.join(", ") || "—", custom.cookieNamesAfterSignIn.join(", ") || "—"),
    row("Cookie count", String(canary.cookieNamesAfterSignIn.length), String(custom.cookieNamesAfterSignIn.length)),
    row("Server identity / landing OK", String(canary.landingAuthYes), String(custom.landingAuthYes)),
    row("Hard reload OK", String(canary.reloadAuthYes), String(custom.reloadAuthYes)),
    row("Final path after reload", canary.finalPath, custom.finalPath),
    "",
    "## Classification",
    "",
    canary.reloadAuthYes && !custom.reloadAuthYes
      ? "**ROOT CAUSE — CROW CUSTOM ROUTE-HANDLER COOKIE LIFECYCLE**"
      : !canary.reloadAuthYes && !custom.reloadAuthYes
        ? "**ROOT CAUSE BELOW CROW LOGIN — SUPABASE SSR / NEXT PROXY / VERCEL**"
        : canary.reloadAuthYes && custom.reloadAuthYes
          ? "**Both paths pass — prior failure likely E2E isolation or deployment state**"
          : "**INCONCLUSIVE — canary failed, custom passed (unexpected)**",
    "",
  ].join("\n");
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  const bypass = getBypass(PREVIEW_BASE);
  const prisma = new PrismaClient();
  const { email, password } = resolveCredentials();

  console.log(`\n=== C3 Auth Canary A/B (${PREVIEW_BASE}) ===\n`);

  const account = await prisma.platformAccount.findFirst({
    where: { emailNormalized: email },
  });
  if (!account) fail("Controlled user required");

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
  await admin.auth.admin.updateUserById(account.supabaseUserId, { password });

  const browser = await chromium.launch({ headless: true });

  try {
    const canaryContext = await browser.newContext({
      extraHTTPHeaders: previewBypassHeaders(bypass),
    });
    const customContext = await browser.newContext({
      extraHTTPHeaders: previewBypassHeaders(bypass),
    });

    const canaryTrace = await runCanaryPath(canaryContext, email, password);
    ok(`Canary path: reload auth = ${canaryTrace.reloadAuthYes}`);
    const customTrace = await runCustomLoginPath(customContext, email, password);
    ok(`Custom path: reload auth = ${customTrace.reloadAuthYes}`);

    const report = formatReport(canaryTrace, customTrace);
    writeFileSync(REPORT_PATH, report);
    console.log("\n" + report);
    ok(`Report: ${REPORT_PATH}`);

    if (!canaryTrace.reloadAuthYes) {
      fail("Canary path did not survive reload — fix platform or canary before migrating login");
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
