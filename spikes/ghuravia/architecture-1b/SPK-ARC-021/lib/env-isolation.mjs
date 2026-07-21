/**
 * GHURAVIA TECHNICAL SPIKE
 * NON-PRODUCT CODE
 * NOT APPROVED FOR RUNTIME OR PRODUCTION
 * Gate: GHV.ARCHITECTURE.1B
 * Spike: SPK-ARC-021 — deployment-environment isolation
 */

import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "../../../../..");

export function readVercelGuard() {
  const p = path.join(REPO_ROOT, "vercel.json");
  const raw = fs.readFileSync(p, "utf8");
  return JSON.parse(raw);
}

export function assertEnvironmentIsolationPolicy() {
  const findings = [];
  const vercel = readVercelGuard();
  const disabled =
    vercel?.git?.deploymentEnabled?.["feat/ghuravia-foundation"] === false;
  if (!disabled) {
    findings.push("deploy_guard_missing");
  }

  const tracked = execSync(
    "git ls-files .env .env.local .env.production .env.preview .env.staging",
    { cwd: REPO_ROOT, encoding: "utf8" },
  ).trim();
  if (tracked) {
    findings.push(`git_tracked_env:${tracked.replace(/\s+/g, ",")}`);
  }

  if (fs.existsSync(path.join(REPO_ROOT, "package.json"))) {
    findings.push("root_package_json_exists");
  }

  const blocking = findings.filter((f) => f !== "root_package_json_exists");
  return {
    ok: disabled && blocking.length === 0,
    deployGuardActive: disabled,
    findings,
    rules: {
      previewMustNotUseCustomerData: true,
      productionSecretsMustNotAppearInPreview: true,
      migrationsRequireReview: true,
      noExternalDbInSpikes: true,
      localEnvMayExistUntracked: true,
    },
  };
}

export function classifyEnvironments() {
  return [
    { name: "Local", data: "synthetic", secrets: "dev-only-untracked" },
    { name: "Test", data: "synthetic", secrets: "ci-injected" },
    { name: "Preview", data: "synthetic-only", secrets: "isolated" },
    { name: "Staging", data: "sanitized", secrets: "staging" },
    { name: "Production", data: "customer", secrets: "production" },
  ];
}
