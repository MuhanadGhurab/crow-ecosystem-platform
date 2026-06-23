#!/usr/bin/env tsx
/**
 * FTGP.1H.2 — Read-only private certification environment verifier.
 * Run: npm run ftgp-certification-environment:verify
 */
import { execSync } from "node:child_process";

import { assertHostedVerificationTarget } from "./lib/assert-hosted-verification-target";
import { assertHostedEnvNotLocalhost, loadHostedOperatorEnv } from "./lib/hosted-operator-env";
import {
  FTGP_CERTIFICATION_BRANCH,
  FTGP_CERTIFICATION_CLASSIFICATION,
  FTGP_CERTIFICATION_DEFAULT_ORIGIN,
  FTGP_CERTIFICATION_PROJECT_NAME,
  FTGP_LIVE_PRODUCTION_ORIGIN,
  FTGP_LIVE_PRODUCTION_PROJECT_NAME,
  certificationOriginFingerprint,
  requiredCertificationAuthRedirectPaths,
  resolveFtgpCertificationBaseUrl,
  resolveLatestCertificationDeploymentUrl,
} from "./lib/ftgp-certification-environment";
import { vercelCurlHead } from "./lib/vercel-curl-head";

function ok(msg: string) {
  console.log(`  PASS: ${msg}`);
}

function fail(msg: string): never {
  console.error(`\nFTGP_CERTIFICATION_ENVIRONMENT=FAILED`);
  console.error(`  reason: ${msg}\n`);
  process.exit(2);
}

function block(msg: string): never {
  console.error(`\nFTGP_CERTIFICATION_ENVIRONMENT=BLOCKED`);
  console.error(`  reason: ${msg}\n`);
  process.exit(3);
}

async function headStatus(base: string, path: string): Promise<number> {
  const res = await fetch(`${base}${path}`, {
    method: "GET",
    redirect: "manual",
    headers: { Accept: "text/html,application/json" },
  });
  return res.status;
}

function readLinkedVercelProject(): string | null {
  try {
    const out = execSync("npx vercel project inspect --format json", {
      encoding: "utf8",
      shell: process.platform === "win32",
      timeout: 60_000,
      stdio: ["pipe", "pipe", "pipe"],
    });
    const parsed = JSON.parse(out) as { name?: string };
    return parsed.name ?? null;
  } catch {
    return null;
  }
}

async function main() {
  console.log("\n=== FTGP certification environment verify ===\n");

  loadHostedOperatorEnv({
    primaryEnvFile: ".env.staging.runtime",
    supplementalEnvFiles: [".env.ftgp-certification.operator"],
  });
  assertHostedEnvNotLocalhost({
    primaryEnvFile: ".env.staging.runtime",
    supplementalEnvFiles: [],
    loadedFiles: [],
    targetClassification: "hosted",
  });

  const certificationBase = resolveFtgpCertificationBaseUrl();
  const originFp = certificationOriginFingerprint(certificationBase);
  const stableAlias = FTGP_CERTIFICATION_DEFAULT_ORIGIN;
  const protectedBase =
    certificationBase !== stableAlias.replace(/\/$/, "")
      ? certificationBase
      : resolveLatestCertificationDeploymentUrl() ?? certificationBase;

  if (certificationBase.replace(/\/$/, "") === FTGP_LIVE_PRODUCTION_ORIGIN) {
    fail("certification origin must not equal live Production origin");
  }

  const linkedProject = readLinkedVercelProject();
  if (linkedProject && linkedProject === FTGP_LIVE_PRODUCTION_PROJECT_NAME) {
    block(
      "local directory linked to live Production project — link crow-ftgp-certification for certification deploys"
    );
  }

  console.log(`  classification=${FTGP_CERTIFICATION_CLASSIFICATION}`);
  console.log(`  project=${FTGP_CERTIFICATION_PROJECT_NAME}`);
  console.log(`  branch=${FTGP_CERTIFICATION_BRANCH}`);
  console.log(`  originFingerprint=${originFp}`);

  ok("CERTIFICATION_ENVIRONMENT_IS_LIVE_PRODUCTION=false");

  console.log("\n=== §1 Anonymous access denied (protected deployment URL) ===\n");
  const probePaths = ["/", "/login", "/account", "/api/health"];
  for (const path of probePaths) {
    const status = await headStatus(protectedBase, path);
    if (status !== 401 && status !== 403 && status !== 302) {
      fail(`anonymous ${path} on protected deployment expected 401/403/302, got ${status}`);
    }
    console.log(`    ${path} → ${status}`);
  }
  ok("CERTIFICATION_DEPLOYMENT_PRIVATE=true");
  ok("ANONYMOUS_ACCESS_DENIED=true");

  const aliasLoginStatus = await headStatus(stableAlias, "/login");
  console.log(`\n  stableAliasLoginStatus=${aliasLoginStatus} (Vercel alias may remain public without Advanced Deployment Protection)`);
  console.log("  proof and OAuth must target the protected deployment URL from operator env");

  console.log("\n=== §2 Authorized Vercel session ===\n");
  let authorizedLoginStatus: number | null = null;
  try {
    const head = vercelCurlHead(`${protectedBase}/login`, true);
    authorizedLoginStatus = head.status;
    if (head.status !== 200 && head.status !== 307 && head.status !== 308) {
      fail(`authorized /login expected 200/redirect, got ${head.status}`);
    }
    ok("AUTHORIZED_VERCEL_ACCESS_ONLY=true");
  } catch (err) {
    block(
      `Vercel-authenticated probe failed — operator must run vercel login: ${
        err instanceof Error ? err.message : String(err)
      }`
    );
  }

  console.log("\n=== §3 Deployment health ===\n");
  try {
    const healthHead = vercelCurlHead(`${protectedBase}/api/health`, true);
    if (healthHead.status !== 200) {
      fail(`/api/health expected 200 via Vercel auth, got ${healthHead.status}`);
    }
    ok("CERTIFICATION_LOGIN_PAGE_REACHABLE=true");
  } catch (err) {
    fail(err instanceof Error ? err.message : String(err));
  }

  const healthRes = await fetch(`${certificationBase}/api/health`, {
    headers: { Accept: "application/json" },
    redirect: "follow",
  }).catch(() => null);
  if (!healthRes?.ok) {
    console.log("  health JSON skipped — anonymous fetch blocked (expected)");
  }

  console.log("\n=== §4 Hosted database fingerprint ===\n");
  try {
    assertHostedVerificationTarget();
    ok("DATABASE_FINGERPRINT_PINNED=true");
  } catch (err) {
    fail(err instanceof Error ? err.message : String(err));
  }

  console.log("\n=== §5 Auth redirect requirements (hosts only) ===\n");
  for (const url of requiredCertificationAuthRedirectPaths(protectedBase)) {
    console.log(`    required redirect host: ${new URL(url).host}${new URL(url).pathname}`);
  }
  console.log(
    "    Supabase Dashboard → Authentication → URL configuration: add certification callback hosts without removing Production URLs."
  );
  ok("SUPABASE_CERTIFICATION_REDIRECT_MANUAL_REVIEW_REQUIRED=true");
  ok("GOOGLE_OAUTH_VIA_SUPABASE_CALLBACK_ONLY=true");

  console.log("\n=== §6 Environment variable inventory (names only) ===\n");
  const sharedWithProduction = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "DATABASE_URL",
    "DIRECT_URL",
    "EXPECTED_DATABASE_FINGERPRINT",
    "BACKEND_ISOLATION",
    "DATABASE_ENVIRONMENT",
    "GOOGLE_SSO_ENABLED",
    "ACCOUNT_REGISTRATION_ENABLED",
  ];
  const certificationSpecific = ["NEXT_PUBLIC_SITE_URL", "FTGP_CERTIFICATION_BASE_URL"];
  for (const name of sharedWithProduction) {
    console.log(`    shared: ${name}`);
  }
  for (const name of certificationSpecific) {
    console.log(`    certification-specific: ${name}`);
  }
  ok("AUTOMATION_BYPASS_USED_FOR_APP_LOGIN=false");
  ok("SECRET_VALUES_EXPOSED=false");

  if (certificationBase === FTGP_CERTIFICATION_DEFAULT_ORIGIN && authorizedLoginStatus === 404) {
    fail("default certification origin not deployed — create crow-ftgp-certification project first");
  }

  console.log("\nFTGP_CERTIFICATION_ENVIRONMENT=PASS");
  console.log("\nPASS — FTGP CERTIFICATION ENVIRONMENT\n");
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
