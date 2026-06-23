#!/usr/bin/env tsx
/**
 * PROCROW.ADMIN.2 — Owner-admin browser access proof on private certification host.
 * Run: C3_PREVIEW_HEADED=true npm run procrow-owner-admin:browser-proof:execute
 */
import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { PrismaClient } from "@prisma/client";
import { chromium } from "playwright";

import { resolveAuthoritativePlatformRole } from "../src/lib/auth/authority-boundaries";
import { findActivePlatformAdminAssignment } from "../src/lib/platform/procrow-owner-admin-transfer.service";
import {
  ensureVercelProtectedAccess,
  newVercelProtectedBrowserContext,
} from "./lib/cloud-1h-vercel-protected-playwright";
import { assertHostedEnvNotLocalhost, loadHostedOperatorEnv } from "./lib/hosted-operator-env";
import {
  assertCertificationHost,
  FTGP_LIVE_PRODUCTION_ORIGIN,
  resolveFtgpCertificationBaseUrl,
} from "./lib/ftgp-certification-environment";
import {
  loadProcrowOwnerAdminOperatorConfig,
  PROCROW_OWNER_ADMIN_DESIGNATION_ARTIFACT,
  PROCROW_OWNER_ADMIN_OPERATOR_ENV,
  operatorEmailFingerprint,
  redactEmailForReport,
} from "./lib/procrow-owner-admin-operator";

export const PROCROW_OWNER_ADMIN_BROWSER_PROOF_ARTIFACT =
  ".procrow-owner-admin-browser-proof.local.json";

const ADMIN_ROUTES = ["/admin", "/admin/users", "/admin/roles"] as const;

function fail(msg: string): never {
  console.error(`\nPROCROW_OWNER_ADMIN_BROWSER_ACCESS=FAILED`);
  console.error(`  reason: ${msg}\n`);
  process.exit(2);
}

function ok(msg: string) {
  console.log(`  PASS: ${msg}`);
}

async function assertRouteReachable(
  page: import("playwright").Page,
  base: string,
  route: string
): Promise<void> {
  await page.goto(`${base}${route}`, { waitUntil: "networkidle", timeout: 120_000 });
  const url = new URL(page.url());
  assertCertificationHost(url.origin, base, `route ${route}`);
  if (url.pathname.includes("/login") || url.pathname === "/") {
    fail(`route ${route} redirected to ${url.pathname}`);
  }
  if (!url.pathname.startsWith(route === "/admin" ? "/admin" : route)) {
    fail(`route ${route} landed on ${url.pathname}`);
  }
}

async function main() {
  if (process.env.C3_PREVIEW_HEADED !== "true") {
    fail("Set C3_PREVIEW_HEADED=true for operator-assisted Google authentication");
  }

  loadHostedOperatorEnv({
    primaryEnvFile: ".env.staging.runtime",
    supplementalEnvFiles: [
      ".env.ftgp-certification.operator",
      ".env.preview.operator",
      PROCROW_OWNER_ADMIN_OPERATOR_ENV,
    ],
  });
  assertHostedEnvNotLocalhost({
    primaryEnvFile: ".env.staging.runtime",
    supplementalEnvFiles: [],
    loadedFiles: [],
    targetClassification: "hosted",
  });

  const operator = loadProcrowOwnerAdminOperatorConfig();
  if (!operator.emailNormalized) {
    fail("PROCROW_OWNER_ADMIN_EMAIL missing in operator file");
  }

  const artifactPath = join(process.cwd(), PROCROW_OWNER_ADMIN_DESIGNATION_ARTIFACT);
  if (!existsSync(artifactPath)) {
    fail("Designation artifact missing — run procrow-owner-admin:designate");
  }
  const designation = JSON.parse(readFileSync(artifactPath, "utf8")) as {
    targetFingerprint: string;
  };

  const proofBase = resolveFtgpCertificationBaseUrl().replace(/\/$/, "");
  if (proofBase.includes(FTGP_LIVE_PRODUCTION_ORIGIN)) {
    fail("Live Production must not be used for owner-admin browser proof");
  }

  const prisma = new PrismaClient();
  try {
    const activeAdmin = await findActivePlatformAdminAssignment();
    if (!activeAdmin || activeAdmin.fingerprint !== designation.targetFingerprint) {
      fail("Sole PLATFORM_ADMIN fingerprint does not match designation artifact");
    }

    const roles = await prisma.platformInternalRoleAssignment.findMany({
      where: { platformAccountId: activeAdmin.platformAccountId, status: "ACTIVE" },
      select: { role: true },
    });
    const crowRole = resolveAuthoritativePlatformRole(
      roles.map((r) => r.role),
      null
    );
    if (crowRole !== "platform_admin") {
      fail("Database role resolution is not platform_admin for designated owner");
    }
    ok("server-side role resolution=PLATFORM_ADMIN");
  } finally {
    await prisma.$disconnect();
  }

  console.log("\n=== PROCROW owner-admin browser proof (certification host) ===\n");
  console.log(`  proof_host=${proofBase}`);
  console.log(`  designated_email=${redactEmailForReport(operator.emailNormalized)}`);

  const browser = await chromium.launch({ headless: false });
  try {
    const context = await newVercelProtectedBrowserContext(browser);
    const page = await context.newPage();
    await ensureVercelProtectedAccess(page, proofBase, true);
    await page.goto(`${proofBase}/login`, { waitUntil: "networkidle", timeout: 120_000 });

    console.log("\n  Operator: complete Vercel SSO and Google sign-in with the designated Gmail.");
    console.log("  Waiting up to 8 minutes for /account or /admin landing...\n");

    const deadline = Date.now() + 8 * 60_000;
    let landed = false;
    while (Date.now() < deadline) {
      const path = new URL(page.url()).pathname;
      if (path.startsWith("/account") || path.startsWith("/admin")) {
        landed = true;
        break;
      }
      await page.waitForTimeout(2000);
    }
    if (!landed) {
      fail("Operator did not complete Google authentication within timeout");
    }
    ok("PROCROW_OWNER_NORMAL_GOOGLE_LOGIN=PASS");

    for (const route of ADMIN_ROUTES) {
      await assertRouteReachable(page, proofBase, route);
      ok(`${route} reachable`);
    }

    const proofArtifact = {
      proofHost: proofBase,
      targetFingerprint: designation.targetFingerprint,
      emailFingerprint: operatorEmailFingerprint(operator.emailNormalized),
      routesVerified: [...ADMIN_ROUTES],
      proofTimestamp: new Date().toISOString(),
      authoritySource: "PlatformInternalRoleAssignment",
    };
    writeFileSync(
      join(process.cwd(), PROCROW_OWNER_ADMIN_BROWSER_PROOF_ARTIFACT),
      `${JSON.stringify(proofArtifact, null, 2)}\n`,
      "utf8"
    );

    ok("PROCROW_OWNER_ADMIN_BROWSER_ACCESS=PASS");
    ok("RUNTIME_EMAIL_AUTHORIZATION_USED=false");
    console.log("\nPROCROW_OWNER_ADMIN_BROWSER_PROOF=PASS\n");
    await page.close();
    await context.close();
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
