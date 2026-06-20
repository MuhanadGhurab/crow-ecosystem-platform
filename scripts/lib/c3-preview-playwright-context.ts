import type { Browser, BrowserContext } from "playwright";
import { automationBypassHeaders } from "./c3-preview-automation-bypass";

/** Fresh Playwright context with Vercel automation bypass headers (no storage state). */
export async function newBypassBrowserContext(browser: Browser): Promise<BrowserContext> {
  return browser.newContext({
    extraHTTPHeaders: automationBypassHeaders(),
  });
}
