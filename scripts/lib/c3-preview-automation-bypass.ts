/**
 * Vercel Deployment Protection — automation bypass for Playwright (C3.10D).
 * Requires VERCEL_AUTOMATION_BYPASS_SECRET (project-level; never commit or log).
 */
import { previewBypassHeaders } from "./c3-preview-host-guard";

export function resolveAutomationBypassSecret(): string {
  const secret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET?.trim();
  if (!secret || secret.length < 8) {
    throw new Error(
      "Set VERCEL_AUTOMATION_BYPASS_SECRET in operator .env.staging (Vercel → Deployment Protection → Protection Bypass for Automation). Do not commit or log the value."
    );
  }
  return secret;
}

export function automationBypassHeaders(): Record<string, string> {
  return previewBypassHeaders(resolveAutomationBypassSecret());
}

/** Confirm Preview is reachable without interactive Vercel team auth. */
export async function verifyAutomationBypassReachable(previewBase: string): Promise<void> {
  const base = previewBase.replace(/\/$/, "");
  const response = await fetch(`${base}/api/health`, {
    headers: automationBypassHeaders(),
    redirect: "manual",
  });
  if (response.status === 401 || response.status === 403) {
    throw new Error(
      `Automation bypass rejected (${response.status}) — check VERCEL_AUTOMATION_BYPASS_SECRET and Preview protection settings`
    );
  }
  if (response.status >= 500) {
    throw new Error(`Preview health check failed (${response.status})`);
  }
}
