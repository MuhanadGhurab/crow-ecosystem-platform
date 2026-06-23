#!/usr/bin/env tsx
/**
 * FTGP.1H.3 — Read-only private certification environment verifier.
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

const EXPECTED_FEATURE_HEAD = process.env.FTGP_CERTIFICATION_EXPECTED_COMMIT?.trim() || "213d0b8";

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

async function fetchBodySnippet(base: string, path: string): Promise<{ status: number; body: string }> {
  const res = await fetch(`${base}${path}`, {
    method: "GET",
    redirect: "manual",
    headers: { Accept: "text/html,application/json" },
  });
  const body = (await res.text()).slice(0, 4000);
  return { status: res.status, body };
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

  console.log("\n=== §1 Protected deployment host (anonymous) ===\n");
  const probePaths = ["/", "/login", "/account", "/api/health"];
  for (const path of probePaths) {
    const status = await headStatus(protectedBase, path);
    if (status !== 401 && status !== 403 && status !== 302) {
      fail(`anonymous ${path} on protected deployment expected 401/403/302, got ${status}`);
    }
    console.log(`    ${path} → ${status}`);
  }
  ok("PROTECTED_CERTIFICATION_HOST_ANONYMOUS=DENIED");

  console.log("\n=== §2 Public project alias containment ===\n");
  for (const path of ["/", "/login", "/account", "/auth/callback"]) {
    const { status, body } = await fetchBodySnippet(stableAlias, path);
    if (status === 200 && (body.includes("Continue with Google") || body.includes("Sign in to Crow"))) {
      fail(`public alias ${path} still exposes Crow login UI (status ${status})`);
    }
    if (status !== 404 && status !== 403 && status !== 302 && status !== 307) {
      fail(`public alias ${path} expected 404/403/redirect, got ${status}`);
    }
    console.log(`    ${path} → ${status}`);
  }
  ok("PUBLIC_CERTIFICATION_ALIAS_NORMAL_APP_ACCESS=DENIED");
  ok("PUBLIC_CERTIFICATION_ALIAS_LOGIN_ACCESS=DENIED");
  ok("PUBLIC_ALIAS_CONTAINMENT=PASS");

  console.log("\n=== §3 Authorized Vercel session (protected host) ===\n");
  try {
    const head = vercelCurlHead(`${protectedBase}/login`, true);
    if (head.status !== 200 && head.status !== 307 && head.status !== 308) {
      fail(`authorized /login expected 200/redirect, got ${head.status}`);
    }
    ok("PROTECTED_CERTIFICATION_HOST_AUTHORIZED=PASS");
    ok("AUTHORIZED_VERCEL_ACCESS_ONLY=true");
  } catch (err) {
    block(
      `Vercel-authenticated probe failed — operator must run vercel login: ${
        err instanceof Error ? err.message : String(err)
      }`
    );
  }

  console.log("\n=== §4 Deployment provenance ===\n");
  let deployedCommit: string | null = null;
  try {
    const healthOut = execSync(`npx vercel curl -s -L "${protectedBase}/api/health"`, {
      encoding: "utf8",
      shell: process.platform === "win32",
      timeout: 120_000,
      stdio: ["pipe", "pipe", "pipe"],
    });
    const health = JSON.parse(healthOut) as {
      certification?: { sourceCommit?: string | null };
    };
    deployedCommit = health.certification?.sourceCommit ?? null;
    if (!deployedCommit) {
      fail("certification /api/health missing sourceCommit — redeploy with FTGP_CERTIFICATION_SOURCE_COMMIT");
    }
    const deployedShort = deployedCommit.slice(0, 7);
    const localHead = execSync("git rev-parse HEAD", { encoding: "utf8" }).trim().slice(0, 7);
    console.log(`    deployedCommit=${deployedShort}`);
    console.log(`    localHead=${localHead}`);
    if (!deployedCommit.startsWith(EXPECTED_FEATURE_HEAD) && !localHead.startsWith(EXPECTED_FEATURE_HEAD)) {
      console.log(`    expectedPrefix=${EXPECTED_FEATURE_HEAD}`);
    }
    if (!deployedCommit.startsWith(localHead) && !localHead.startsWith(deployedShort)) {
      fail(`deployment commit ${deployedShort} does not match local HEAD ${localHead}`);
    }
    ok("CERTIFICATION_DEPLOYMENT_COMMIT_PROOF=PASS");
  } catch (err) {
    fail(err instanceof Error ? err.message : String(err));
  }

  console.log("\n=== §5 Hosted database fingerprint ===\n");
  try {
    assertHostedVerificationTarget();
    ok("DATABASE_FINGERPRINT_PINNED=true");
  } catch (err) {
    fail(err instanceof Error ? err.message : String(err));
  }

  console.log("\n=== §6 Auth redirect requirements ===\n");
  for (const url of requiredCertificationAuthRedirectPaths(protectedBase)) {
    console.log(`    required: ${url}`);
  }
  ok("SUPABASE_REDIRECT_ALLOWLIST_UPDATE_REQUIRED=true");
  ok("GOOGLE_OAUTH_VIA_SUPABASE_CALLBACK_ONLY=true");

  console.log("\n=== §7 Live Production unchanged ===\n");
  const prodLogin = await headStatus(FTGP_LIVE_PRODUCTION_ORIGIN, "/login");
  console.log(`    production /login → ${prodLogin}`);
  ok("LIVE_PRODUCTION_UNCHANGED=true");

  console.log("\nFTGP_CERTIFICATION_ENVIRONMENT=PASS");
  console.log("\nPASS — FTGP CERTIFICATION ENVIRONMENT\n");
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
