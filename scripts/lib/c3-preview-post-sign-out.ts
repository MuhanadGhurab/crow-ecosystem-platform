import type { Page } from "playwright";

/** Document-context sign-out via POST /auth/signout (GET must stay 405). */
export async function postDocumentSignOut(page: Page, previewBase: string): Promise<void> {
  const base = previewBase.replace(/\/$/, "");
  const response = await page.request.post(`${base}/auth/signout`, { maxRedirects: 0 });
  if (response.status() !== 303 && response.status() !== 302 && response.status() !== 307) {
    throw new Error(`POST /auth/signout expected redirect, got ${response.status()}`);
  }
  await page.goto(`${base}/login`, { waitUntil: "networkidle" });
}
