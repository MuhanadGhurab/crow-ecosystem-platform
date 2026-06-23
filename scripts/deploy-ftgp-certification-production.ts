#!/usr/bin/env tsx
/**
 * Reproducible certification production deploy from a clean committed tree.
 * Run: npm run ftgp-certification-production:deploy
 */
import { execSync, spawnSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { join } from "node:path";

import { FTGP_CERTIFICATION_SOURCE_COMMIT_ENV } from "../src/lib/ftgp/ftgp-certification-host-gate";
import {
  FTGP_CERTIFICATION_BRANCH,
  FTGP_CERTIFICATION_OPERATOR_ENV,
  FTGP_CERTIFICATION_BASE_URL_ENV,
  FTGP_CERTIFICATION_PROJECT_NAME,
  resolveLatestCertificationDeploymentUrl,
} from "./lib/ftgp-certification-environment";

function run(cmd: string): string {
  return execSync(cmd, {
    encoding: "utf8",
    shell: process.platform === "win32",
    stdio: ["pipe", "pipe", "pipe"],
  }).trim();
}

function addEnv(name: string, value: string): void {
  spawnSync(`npx vercel env add ${name} production --force --yes`, {
    encoding: "utf8",
    shell: process.platform === "win32",
    input: value,
    stdio: ["pipe", "pipe", "pipe"],
  });
}

function main() {
  console.log("\n=== FTGP certification production deploy ===\n");

  const status = run("git status --porcelain");
  if (status) {
    console.error("Working tree is not clean — commit or stash before deploy");
    process.exit(1);
  }

  const branch = run("git rev-parse --abbrev-ref HEAD");
  if (branch !== FTGP_CERTIFICATION_BRANCH) {
    console.error(`Expected branch ${FTGP_CERTIFICATION_BRANCH}, got ${branch}`);
    process.exit(1);
  }

  const commit = run("git rev-parse HEAD");
  const short = commit.slice(0, 7);
  console.log(`  branch=${branch}`);
  console.log(`  commit=${short}`);

  run(`npx vercel link --project ${FTGP_CERTIFICATION_PROJECT_NAME} --yes`);
  addEnv(FTGP_CERTIFICATION_SOURCE_COMMIT_ENV, commit);
  addEnv("FTGP_CERTIFICATION_MODE", "true");
  console.log(`  pinned ${FTGP_CERTIFICATION_SOURCE_COMMIT_ENV}=${short}`);

  run("npx vercel deploy --prod --yes");

  const deploymentUrl = resolveLatestCertificationDeploymentUrl();
  if (!deploymentUrl) {
    console.error("Could not resolve deployment URL after deploy");
    process.exit(1);
  }

  const allowedHost = new URL(deploymentUrl).host;
  addEnv("FTGP_CERTIFICATION_ALLOWED_HOST", allowedHost);
  addEnv("NEXT_PUBLIC_SITE_URL", deploymentUrl);
  console.log(`  allowedHost=${allowedHost}`);

  console.log("  redeploying once to apply host/origin env...");
  run("npx vercel deploy --prod --yes");

  const finalUrl = resolveLatestCertificationDeploymentUrl() ?? deploymentUrl;
  writeFileSync(
    join(process.cwd(), FTGP_CERTIFICATION_OPERATOR_ENV),
    [
      "# FTGP.1H.3 — private certification deployment (gitignored)",
      `${FTGP_CERTIFICATION_BASE_URL_ENV}=${finalUrl}`,
      "",
    ].join("\n"),
    "utf8"
  );

  console.log(`\nPASS — certification deployed from commit ${short}\n`);
}

main();
