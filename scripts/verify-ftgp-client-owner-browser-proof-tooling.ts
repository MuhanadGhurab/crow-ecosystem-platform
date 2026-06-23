#!/usr/bin/env tsx
/**
 * FTGP.1H.4a — Zero-credential owner-proof tooling dry run.
 * Run: npm run ftgp-client-owner-browser-proof:tooling-test
 */
import { existsSync } from "node:fs";
import { join } from "node:path";

import {
  assertCertificationOwnerProofBypassPolicy,
  isAutomationBypassActivelyUsed,
  shouldUsePreviewAutomationBypassContext,
} from "./lib/ftgp-owner-browser-proof-bypass";
import {
  FTGP_CLIENT_OWNER_BROWSER_PROOF_ARTIFACT,
} from "./lib/ftgp-client-owner-browser-proof-artifact";
import {
  FTGP_CERTIFICATION_CLASSIFICATION,
  isFtgpCertificationMode,
  resolveFtgpCertificationBaseUrl,
} from "./lib/ftgp-certification-environment";
import {
  classifyInitialHttpGateStatus,
  classifyProtectedPageLocation,
  requiresVercelOperatorWait,
} from "./lib/ftgp-vercel-sso-state-machine";
import { loadHostedOperatorEnv } from "./lib/hosted-operator-env";

function ok(msg: string) {
  console.log(`  PASS: ${msg}`);
}

function fail(msg: string): never {
  console.error(`\nFTGP_OWNER_BROWSER_PROOF_TOOLING=FAILED`);
  console.error(`  reason: ${msg}\n`);
  process.exit(2);
}

function main() {
  console.log("\n=== FTGP client owner browser proof tooling ===\n");

  loadHostedOperatorEnv({
    primaryEnvFile: ".env.staging.runtime",
    supplementalEnvFiles: [
      ".env.ftgp-certification.operator",
      ".env.preview.operator",
      ".env.ftgp-first-request.operator",
      ".env.ftgp-first-client.operator",
    ],
  });

  const certificationMode = isFtgpCertificationMode();
  if (!certificationMode) {
    fail("FTGP_CERTIFICATION_BASE_URL must be configured for certification tooling test");
  }

  const proofBase = resolveFtgpCertificationBaseUrl();
  const bypassSecretPresent = Boolean(process.env.VERCEL_AUTOMATION_BYPASS_SECRET?.trim());

  console.log(`  ownerProofEnvironment=${FTGP_CERTIFICATION_CLASSIFICATION}`);
  console.log(`  protectedOrigin=${proofBase}`);

  assertCertificationOwnerProofBypassPolicy({
    certificationMode: true,
    bypassSecretPresent,
    activeBypassUsage: false,
  });
  ok("CERTIFICATION_UNUSED_BYPASS_SECRET_HANDLING=PASS");

  if (
    isAutomationBypassActivelyUsed({
      useBypassBrowserContext: shouldUsePreviewAutomationBypassContext(true, bypassSecretPresent),
    })
  ) {
    fail("certification mode must not use bypass browser context");
  }
  ok("CERTIFICATION_BROWSER_REQUEST_BYPASS_USAGE=false");

  if (shouldUsePreviewAutomationBypassContext(false, true) !== true) {
    fail("preview automation bypass context regression");
  }
  ok("OLD_PREVIEW_BYPASS_TOOLING_REGRESSION=false");

  const loginPhase = classifyProtectedPageLocation(`${proofBase}/login`, proofBase);
  if (loginPhase !== "crow_login_ready") {
    fail(`expected crow_login_ready, got ${loginPhase}`);
  }
  ok("CROW_LOGIN_READINESS_DETECTION=PASS");

  const ssoPhase = classifyProtectedPageLocation("https://vercel.com/sso-api", proofBase);
  if (!requiresVercelOperatorWait(ssoPhase)) {
    fail("302/SSO state must require operator wait");
  }
  ok("VERCEL_SSO_302_RECOGNIZED=true");

  if (classifyInitialHttpGateStatus(302) !== "vercel_sso_redirect") {
    fail("HTTP 302 must map to vercel_sso_redirect");
  }
  ok("EXECUTOR_VERCEL_SSO_WAIT_STATE=PASS");

  if (existsSync(join(process.cwd(), FTGP_CLIENT_OWNER_BROWSER_PROOF_ARTIFACT))) {
    fail("proof artifact must not exist during tooling dry run");
  }
  ok("PROOF_ARTIFACT_CREATED=false");

  console.log("\nFTGP_OWNER_BROWSER_PROOF_TOOLING=PASS");
  console.log("\nPASS — FTGP OWNER BROWSER PROOF TOOLING\n");
}

main();
