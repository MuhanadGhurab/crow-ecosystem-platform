import type { Browser, BrowserContext, Page } from "playwright";

const VERCEL_AUTH_WAIT_MS = 180_000;

/** Playwright context without automation bypass — requires Vercel Authentication. */
export async function newVercelProtectedBrowserContext(
  browser: Browser
): Promise<BrowserContext> {
  return browser.newContext();
}

/**
 * Navigate to Preview origin; wait for operator Vercel SSO when headed, or fail fast when headless.
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

  if (status === 401 || status === 403) {
    if (!headed) {
      throw new Error(
        "Vercel Authentication blocked headless access — set C3_PREVIEW_HEADED=true for operator browser SSO"
      );
    }
    await page.waitForURL(
      (url) => {
        const host = url.hostname;
        return host.includes("vercel.app") && !url.pathname.startsWith("/login");
      },
      { timeout: VERCEL_AUTH_WAIT_MS }
    ).catch(() => {
      throw new Error("Timed out waiting for operator Vercel Authentication on Preview");
    });
    await page.goto(`${base}/login`, { waitUntil: "networkidle", timeout: 60_000 });
  }

  const finalStatus = await page.evaluate(() => document.title.length);
  if (finalStatus === 0 && page.url().includes("vercel.com")) {
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
