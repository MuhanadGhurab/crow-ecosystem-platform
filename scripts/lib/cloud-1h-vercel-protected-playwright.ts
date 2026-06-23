import type { Browser, BrowserContext, Page } from "playwright";

import {
  VERCEL_OPERATOR_AUTH_WAIT_MS,
  assertApprovedProofReturnUrl,
  classifyInitialHttpGateStatus,
  classifyProtectedPageLocation,
  isCrowApplicationReadyPhase,
  printVercelSsoOperatorInstructions,
  requiresVercelOperatorWait,
} from "./ftgp-vercel-sso-state-machine";

/** Playwright context without automation bypass — requires Vercel Authentication. */
export async function newVercelProtectedBrowserContext(
  browser: Browser
): Promise<BrowserContext> {
  return browser.newContext();
}

async function waitForOperatorVercelAuthentication(
  page: Page,
  protectedBase: string
): Promise<void> {
  printVercelSsoOperatorInstructions();
  console.log(`  vercelOperatorWaitMs=${VERCEL_OPERATOR_AUTH_WAIT_MS}`);

  await page
    .waitForURL(
      (url) => {
        const phase = classifyProtectedPageLocation(url.toString(), protectedBase);
        return isCrowApplicationReadyPhase(phase);
      },
      { timeout: VERCEL_OPERATOR_AUTH_WAIT_MS }
    )
    .catch(() => {
      throw new Error("Timed out waiting for operator Vercel Authentication on protected deployment");
    });

  const phase = classifyProtectedPageLocation(page.url(), protectedBase);
  if (phase === "unauthorized_host") {
    throw new Error(
      `Operator returned to unauthorized host after Vercel SSO: ${new URL(page.url()).hostname}`
    );
  }
}

/**
 * Navigate to protected origin; wait for operator Vercel SSO when headed, or fail fast when headless.
 */
export async function ensureVercelProtectedAccess(
  page: Page,
  previewBase: string,
  headed: boolean
): Promise<void> {
  const base = previewBase.replace(/\/$/, "");
  const response = await page.goto(`${base}/login`, {
    waitUntil: "domcontentloaded",
    timeout: 60_000,
  });
  const status = response?.status() ?? 0;

  let phase = classifyProtectedPageLocation(page.url(), previewBase);
  const statusPhase = classifyInitialHttpGateStatus(status);
  if (phase === "crow_login_ready" && statusPhase === "vercel_sso_redirect") {
    phase = "vercel_sso_redirect";
  }

  if (phase === "unauthorized_host") {
    throw new Error(`Unauthorized proof host: ${new URL(page.url()).hostname}`);
  }

  if (requiresVercelOperatorWait(phase)) {
    if (!headed) {
      throw new Error(
        "Vercel Authentication blocked headless access — set C3_PREVIEW_HEADED=true for operator browser SSO"
      );
    }
    await waitForOperatorVercelAuthentication(page, previewBase);
    phase = classifyProtectedPageLocation(page.url(), previewBase);
  }

  if (phase === "crow_application_ready") {
    assertApprovedProofReturnUrl(page.url(), previewBase);
    return;
  }

  if (!isCrowApplicationReadyPhase(phase)) {
    await page.goto(`${base}/login`, { waitUntil: "domcontentloaded", timeout: 60_000 });
    phase = classifyProtectedPageLocation(page.url(), previewBase);
  }

  if (requiresVercelOperatorWait(phase)) {
    if (!headed) {
      throw new Error(
        "Vercel Authentication blocked headless access — set C3_PREVIEW_HEADED=true for operator browser SSO"
      );
    }
    await waitForOperatorVercelAuthentication(page, previewBase);
  }

  assertApprovedProofReturnUrl(page.url(), previewBase);

  const finalPhase = classifyProtectedPageLocation(page.url(), previewBase);
  if (finalPhase === "unauthorized_host") {
    throw new Error(`Unauthorized proof host after Vercel gate: ${new URL(page.url()).hostname}`);
  }
  if (requiresVercelOperatorWait(finalPhase)) {
    throw new Error("Still on Vercel SSO — operator Vercel Authentication incomplete");
  }
}

export async function assertRouteDenied(
  page: Page,
  previewBase: string,
  path: string
): Promise<void> {
  const base = previewBase.replace(/\/$/, "");
  await page.goto(`${base}${path}`, { waitUntil: "networkidle", timeout: 60_000 });
  const pathname = new URL(page.url()).pathname;
  if (pathname.startsWith("/admin") && !pathname.includes("/login")) {
    throw new Error(`${path} was not denied — landed on ${pathname}`);
  }
  if (path === "/admin" && !pathname.includes("/login") && !pathname.startsWith("/admin")) {
    return;
  }
  if (path === "/admin" && pathname.startsWith("/admin")) {
    throw new Error("/admin accessible without internal authority");
  }
  if ((path === "/client" || path === "/account") && pathname.includes("/login")) {
    return;
  }
}

export async function clearCrowSession(context: BrowserContext, previewBase: string): Promise<void> {
  const base = previewBase.replace(/\/$/, "");
  const cookies = await context.cookies();
  const authCookies = cookies.filter(
    (c) => c.name.includes("sb-") || c.name.includes("supabase")
  );
  if (authCookies.length > 0) {
    await context.clearCookies();
  }
  const page = await context.newPage();
  try {
    await page.goto(`${base}/login`, { waitUntil: "networkidle" });
  } finally {
    await page.close();
  }
}
