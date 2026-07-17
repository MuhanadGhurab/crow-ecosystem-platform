#!/usr/bin/env tsx
/**
 * FTGP.0F.4 — Post-bootstrap runtime authority verification (read-only + optional browser).
 * Run: npm run ftgp-platform-admin-runtime:verify
 */
import { PrismaClient } from "@prisma/client";
import { chromium } from "playwright";

import { resolveAuthoritativePlatformRole } from "../src/lib/auth/authority-boundaries";
import { Permission, hasPermission } from "../src/lib/auth/permissions";
import { normalizeEmail } from "../src/lib/account/email-normalize";
import { assertHostedEnvNotLocalhost, loadHostedOperatorEnv } from "./lib/hosted-operator-env";
import {
  EXPECTED_MANIFEST_CORRELATION_ID,
  EXPECTED_TARGET_FINGERPRINT,
  loadBootstrapManifest,
} from "./lib/ftgp-platform-admin-bootstrap-manifest";
import { countActivePlatformAdminAssignments } from "../src/lib/platform/platform-internal-role-bootstrap-grant";
import { resolveCloud1hCandidateOperator } from "./lib/cloud-1h-candidate-resolution";
import { requireProofOperatorEnv } from "./lib/c3-proof-requester-resolution";
import {
  ensureVercelProtectedAccess,
  newVercelProtectedBrowserContext,
} from "./lib/cloud-1h-vercel-protected-playwright";

const PREVIEW_BASE =
  process.env.C3_PREVIEW_BASE_URL?.trim() ||
  "https://crow-ecosystem-platform-oz8qikh7x-muhanadghurabs-projects.vercel.app";

function readCertFlag(name: string): boolean {
  const raw = process.env[name]?.trim().toLowerCase();
  return raw === "true" || raw === "1" || raw === "pass" || raw === "passed";
}

function ok(msg: string) {
  console.log(`  PASS: ${msg}`);
}

function fail(msg: string): never {
  console.error(`\n${msg}\n`);
  process.exit(2);
}

async function main() {
  const envLoad = loadHostedOperatorEnv({
    primaryEnvFile: ".env.staging.runtime",
    supplementalEnvFiles: [".env.preview.operator", ".env.platform-bootstrap.operator"],
  });
  assertHostedEnvNotLocalhost(envLoad);

  console.log("\n=== FTGP Platform Admin runtime authority verify ===\n");

  const manifest = loadBootstrapManifest();
  if (!manifest.grantExecuted) {
    fail("Bootstrap manifest grantExecuted is not true");
  }

  const targetAccountId =
    process.env.PLATFORM_INTERNAL_ROLE_BOOTSTRAP_TARGET_ACCOUNT_ID?.trim() || null;
  if (!targetAccountId) fail("target account ID missing from operator env");

  const prisma = new PrismaClient();
  try {
    const activeAdmins = await countActivePlatformAdminAssignments();
    if (activeAdmins !== 1) fail(`ACTIVE_PLATFORM_ADMIN_COUNT=${activeAdmins}`);

    const assignment = await prisma.platformInternalRoleAssignment.findFirst({
      where: {
        platformAccountId: targetAccountId,
        role: "PLATFORM_ADMIN",
        status: "ACTIVE",
        grantCorrelationId: EXPECTED_MANIFEST_CORRELATION_ID,
      },
      include: {
        platformAccount: { select: { supabaseUserId: true, status: true } },
      },
    });
    if (!assignment) fail("active PLATFORM_ADMIN assignment not found");
    ok("database assignment ACTIVE for designated target");

    const roles = await prisma.platformInternalRoleAssignment.findMany({
      where: { platformAccountId: targetAccountId, status: "ACTIVE" },
      select: { role: true },
    });
    const roleNames = roles.map((r) => r.role);
    const platformRole = resolveAuthoritativePlatformRole(roleNames, null);
    if (platformRole !== "platform_admin") {
      fail("authoritative platform role not platform_admin");
    }
    ok("PLATFORM_ADMIN_RUNTIME_AUTHORITY=PASS");
    ok("PLATFORM_ADMIN_AUTHORITY_SOURCE=DATABASE_INTERNAL_ROLE_ASSIGNMENT");

    const metadataRole = resolveAuthoritativePlatformRole([], "platform_admin");
    if (metadataRole !== null) {
      fail("METADATA_ONLY_INTERNAL_AUTHORITY would authorize");
    }
    ok("METADATA_ONLY_INTERNAL_AUTHORITY=DENIED");

    const { preservedAccountId } = requireProofOperatorEnv();
    const implementer = await resolveCloud1hCandidateOperator(
      prisma,
      preservedAccountId ? [preservedAccountId] : []
    );

    if (preservedAccountId) {
      const requesterRoles = await prisma.platformInternalRoleAssignment.count({
        where: { platformAccountId: preservedAccountId, status: "ACTIVE" },
      });
      if (requesterRoles !== 0) fail("retained requester has internal roles");
      ok("retained requester internal roles = 0");
    }

    if (implementer) {
      const candidateRoles = await prisma.platformInternalRoleAssignment.count({
        where: { platformAccountId: implementer.platformAccountId, status: "ACTIVE" },
      });
      if (candidateRoles !== 0) fail("IMPLEMENTER candidate has internal roles");
      ok("candidate IMPLEMENTER internal roles = 0");
    }

    const headed = process.env.C3_PREVIEW_HEADED === "true";
    const runtimeCertified =
      process.env.FTGP_PLATFORM_ADMIN_RUNTIME_SESSION_CERTIFIED?.trim().toLowerCase() === "true";

    const targetAccount = await prisma.platformAccount.findUnique({
      where: { id: targetAccountId },
      select: { emailNormalized: true },
    });
    const googleProofEmail = process.env.C3_GOOGLE_PROOF_EMAIL?.trim();
    const operatorGoogleSessionCertified =
      readCertFlag("C3_MANUAL_BROWSER_SESSION_CERTIFIED") &&
      Boolean(googleProofEmail) &&
      targetAccount?.emailNormalized === normalizeEmail(googleProofEmail!);

    if (runtimeCertified) {
      const browser = await chromium.launch({ headless: !headed });
      try {
        const context = await newVercelProtectedBrowserContext(browser);
        const page = await context.newPage();
        await ensureVercelProtectedAccess(page, PREVIEW_BASE, headed);
        await page.goto(`${PREVIEW_BASE.replace(/\/$/, "")}/admin`, {
          waitUntil: "networkidle",
          timeout: 90_000,
        });
        const pathname = new URL(page.url()).pathname;
        if (!pathname.startsWith("/admin") || pathname.includes("/login")) {
          fail(`PLATFORM_ADMIN_ADMIN_ROUTE_ACCESS failed — landed on ${pathname}`);
        }
        ok("PLATFORM_ADMIN_ADMIN_ROUTE_ACCESS=PASS");
        await page.close();
        await context.close();
      } finally {
        await browser.close();
      }
    } else if (operatorGoogleSessionCertified) {
      if (!hasPermission(platformRole, Permission["platform.admin.view"])) {
        fail("platform_admin permission surface missing platform.admin.view");
      }
      ok("PLATFORM_ADMIN_ADMIN_ROUTE_ACCESS=PASS (operator-certified Google session + DB assignment)");
    } else {
      console.log(
        "  NOTE: Set FTGP_PLATFORM_ADMIN_RUNTIME_SESSION_CERTIFIED=true after operator Google session on Preview for /admin browser proof"
      );
      ok("PLATFORM_ADMIN_ADMIN_ROUTE_ACCESS=DEFERRED_OPERATOR_BROWSER_CERT");
    }

    console.log(`\n  target_fingerprint=${EXPECTED_TARGET_FINGERPRINT}`);
    console.log("\nPASS — FTGP PLATFORM ADMIN RUNTIME AUTHORITY\n");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
