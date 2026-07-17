import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import type { Page } from "playwright";
import type { PrismaClient } from "@prisma/client";
import { normalizeEmail } from "../../src/lib/account/email-normalize";
import { collectC3Evidence, type C3EvidenceSnapshot } from "./c3-preview-e2e-evidence";
import { isOperatorAssistedOtpEnabled } from "./c3-preview-operator-otp";

function readManualCertFromStaging(): string | null {
  const path = join(process.cwd(), ".env.staging");
  if (!existsSync(path)) return process.env.C3_MANUAL_BROWSER_SESSION_CERTIFIED?.trim() ?? null;
  try {
    for (const line of readFileSync(path, "utf8").replace(/\r/g, "").split("\n")) {
      const match = line.match(/^C3_MANUAL_BROWSER_SESSION_CERTIFIED=(.*)$/);
      if (!match?.[1]) continue;
      return match[1].trim().replace(/^["']|["']$/g, "");
    }
  } catch {
    /* ignore */
  }
  return process.env.C3_MANUAL_BROWSER_SESSION_CERTIFIED?.trim() ?? null;
}

export async function assertLegalReviewReached(page: Page): Promise<void> {
  const pathname = new URL(page.url()).pathname;
  if (pathname.includes("/verify-email")) {
    throw new Error(
      `LEGAL_GATE_BYPASS: signup reached /verify-email before legal review (redirect chain ends at ${pathname})`
    );
  }
  if (!pathname.includes("/register/legal")) {
    throw new Error(
      `LEGAL_GATE_BYPASS: expected /register/legal after signup, got ${pathname}`
    );
  }
}

export async function reportLegalGateFailure(
  page: Page,
  prisma: PrismaClient,
  email: string
): Promise<never> {
  let snapshot: C3EvidenceSnapshot | null = null;
  try {
    snapshot = await collectC3Evidence(prisma, email, "legal-gate-failure");
  } catch {
    /* best effort */
  }
  const chain = page.url();
  throw new Error(
    `LEGAL_GATE_FAILURE: legal review skipped or legal≠3 before OTP. ` +
      `finalUrl=${chain} legalCount=${snapshot?.mandatoryLegalAcceptanceCount ?? "?"} ` +
      `accountStatus=${snapshot?.platformAccountStatus ?? "?"} gen=${snapshot?.onboardingGeneration ?? "?"}`
  );
}

export async function pauseForOperatorOtpEntry(page: Page): Promise<void> {
  if (!isOperatorAssistedOtpEnabled()) return;

  console.log("\n=== OPERATOR CHECKPOINT 1 — Email OTP ===");
  console.log("Enter the real OTP from your controlled inbox in the browser window.");
  console.log("Submit verification; automation resumes after redirect to /login.");
  console.log("Do not paste OTP into this terminal.\n");

  await page.pause();
}

export async function waitForOperatorManualBrowserCertification(
  previewBase: string
): Promise<void> {
  console.log("\n=== OPERATOR CHECKPOINT 2 — Manual Chrome/Edge session ===");
  console.log(`Use normal Chrome or Edge against Preview: ${previewBase}`);
  console.log("Flow: /login → /account → hard reload → /account/profile → hard reload → SignOutButton → re-login → hard reload");
  console.log("Record C3_MANUAL_BROWSER_SESSION_CERTIFIED=true in .env.staging when complete.");
  console.log("Automation polls every 10s (max 2h). Set false to abort.\n");

  const deadline = Date.now() + 2 * 60 * 60 * 1000;
  while (Date.now() < deadline) {
    const raw = readManualCertFromStaging()?.toLowerCase();
    if (raw === "true" || raw === "1" || raw === "pass" || raw === "passed") {
      console.log("  ✓ C3_MANUAL_BROWSER_SESSION_CERTIFIED=true recorded — continuing automated suite\n");
      return;
    }
    if (raw === "false" || raw === "0" || raw === "fail" || raw === "failed") {
      throw new Error("C3_MANUAL_BROWSER_SESSION_CERTIFIED=false — manual browser session failed");
    }
    await new Promise((r) => setTimeout(r, 10_000));
  }
  throw new Error("Timed out waiting for C3_MANUAL_BROWSER_SESSION_CERTIFIED=true");
}

export function assertEmailNormalizedForProof(email: string): void {
  normalizeEmail(email);
}
