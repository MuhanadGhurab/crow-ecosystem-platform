#!/usr/bin/env tsx
/**
 * Record the latest SSO-protected certification deployment URL in operator env
 * and sync NEXT_PUBLIC_SITE_URL on the certification Vercel project.
 */
import { spawnSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { join } from "node:path";

import {
  FTGP_CERTIFICATION_DEFAULT_ORIGIN,
  FTGP_CERTIFICATION_OPERATOR_ENV,
  FTGP_CERTIFICATION_BASE_URL_ENV,
  FTGP_CERTIFICATION_PROJECT_NAME,
  resolveLatestCertificationDeploymentUrl,
} from "./lib/ftgp-certification-environment";

function addEnv(name: string, value: string): void {
  spawnSync(`npx vercel env add ${name} production --force --yes`, {
    encoding: "utf8",
    shell: process.platform === "win32",
    input: value,
    stdio: ["pipe", "pipe", "pipe"],
  });
}

function main() {
  const deploymentUrl = resolveLatestCertificationDeploymentUrl();
  if (!deploymentUrl) {
    console.error("Could not resolve latest certification deployment URL");
    process.exit(1);
  }

  spawnSync(`npx vercel link --project ${FTGP_CERTIFICATION_PROJECT_NAME} --yes`, {
    shell: process.platform === "win32",
    stdio: "inherit",
  });

  addEnv("NEXT_PUBLIC_SITE_URL", deploymentUrl);
  addEnv("FTGP_CERTIFICATION_ALLOWED_HOST", new URL(deploymentUrl).host);
  addEnv("FTGP_CERTIFICATION_MODE", "true");
  console.log("  synced NEXT_PUBLIC_SITE_URL and FTGP_CERTIFICATION_ALLOWED_HOST");

  writeFileSync(
    join(process.cwd(), FTGP_CERTIFICATION_OPERATOR_ENV),
    [
      "# FTGP.1H.2 — private certification deployment (gitignored)",
      `# stable alias (may be public on current Vercel plan): ${FTGP_CERTIFICATION_DEFAULT_ORIGIN}`,
      `${FTGP_CERTIFICATION_BASE_URL_ENV}=${deploymentUrl}`,
      "",
    ].join("\n"),
    "utf8"
  );

  console.log(`\nPASS — certification operator env updated`);
  console.log(`  protectedDeploymentHost=${new URL(deploymentUrl).host}`);
  console.log("  redeploy certification production after minting when SITE_URL changed");
}

main();
