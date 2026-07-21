/**
 * GHURAVIA TECHNICAL SPIKE
 * NON-PRODUCT CODE
 * NOT APPROVED FOR RUNTIME OR PRODUCTION
 * Gate: GHV.ARCHITECTURE.1B
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import {
  assertEnvironmentIsolationPolicy,
  classifyEnvironments,
  readVercelGuard,
} from "../lib/env-isolation.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "../../../../..");

describe("SPK-ARC-021 deployment-environment isolation", () => {
  it("keeps feat/ghuravia-foundation deployment disabled", () => {
    const v = readVercelGuard();
    assert.equal(v.git.deploymentEnabled["feat/ghuravia-foundation"], false);
  });

  it("finds no git-tracked .env files at repo root", () => {
    const tracked = execSync(
      "git ls-files .env .env.local .env.production .env.preview .env.staging",
      { cwd: REPO_ROOT, encoding: "utf8" },
    ).trim();
    assert.equal(tracked, "");
  });

  it("asserts isolation policy and environment classifications", () => {
    const r = assertEnvironmentIsolationPolicy();
    assert.equal(r.deployGuardActive, true);
    assert.ok(!r.findings.includes("deploy_guard_missing"));
    const envs = classifyEnvironments();
    assert.equal(envs.length, 5);
    assert.equal(envs.find((e) => e.name === "Preview").data, "synthetic-only");
  });

  it("confirms no root package.json (docs-first / Product Code blocked)", () => {
    assert.equal(fs.existsSync(path.join(REPO_ROOT, "package.json")), false);
  });
});
