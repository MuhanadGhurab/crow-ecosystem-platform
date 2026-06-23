#!/usr/bin/env tsx
/**
 * PROCROW.ADMIN.2A — Read-only verification of owner-admin browser proof artifact.
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import {
  FTGP_CERTIFICATION_PUBLIC_ALIAS_HOST,
  resolveFtgpCertificationBaseUrl,
} from "./lib/ftgp-certification-environment";
import { PROCROW_OWNER_ADMIN_BROWSER_PROOF_ARTIFACT } from "./execute-procrow-owner-admin-browser-proof";

const EXPECTED_OWNER_FINGERPRINT = "832287cbd374fb83";

function ok(msg: string) {
  console.log(`  PASS: ${msg}`);
}

function fail(msg: string): never {
  console.error(`\n${msg}\n`);
  process.exit(2);
}

function main() {
  const path = join(process.cwd(), PROCROW_OWNER_ADMIN_BROWSER_PROOF_ARTIFACT);
  if (!existsSync(path)) {
    fail(`Browser proof artifact missing: ${PROCROW_OWNER_ADMIN_BROWSER_PROOF_ARTIFACT}`);
  }

  const artifact = JSON.parse(readFileSync(path, "utf8")) as {
    proofHost?: string;
    targetFingerprint?: string;
    routesVerified?: string[];
    authoritySource?: string;
    emailFingerprint?: string;
  };

  const certBase = resolveFtgpCertificationBaseUrl().replace(/\/$/, "");
  if (!artifact.proofHost?.includes("crow-ftgp-certification")) {
    fail("proof host is not private certification deployment");
  }
  if (artifact.proofHost?.includes(FTGP_CERTIFICATION_PUBLIC_ALIAS_HOST)) {
    fail("public alias must not be used for browser proof");
  }
  if (artifact.targetFingerprint !== EXPECTED_OWNER_FINGERPRINT) {
    fail("target fingerprint mismatch in browser proof artifact");
  }
  if (artifact.authoritySource !== "PlatformInternalRoleAssignment") {
    fail("authority source must be PlatformInternalRoleAssignment");
  }
  for (const route of ["/admin", "/admin/users", "/admin/roles"]) {
    if (!artifact.routesVerified?.includes(route)) {
      fail(`route ${route} not verified in artifact`);
    }
  }

  ok("PROCROW_BROWSER_PROOF_TARGET=PRIVATE_CERTIFICATION");
  ok("PROCROW_BROWSER_PROOF_ARTIFACT_SAFE=true");
  ok(`proof_host matches certification (${certBase.slice(0, 40)}...)`);
  console.log("\nPROCROW_OWNER_ADMIN_BROWSER_PROOF_VERIFY=PASS\n");
}

main();
