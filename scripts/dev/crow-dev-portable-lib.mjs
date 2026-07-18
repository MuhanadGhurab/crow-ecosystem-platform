/**
 * Shared portable Alpha Development checks.
 * Never prints secret values. Never connects to DB. Never runs migrations.
 */

import { existsSync, readFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { join } from "node:path";

export const EXPECTED_NODE_MAJOR = 24;
export const DEFAULT_FEATURE_BRANCH = "feat/first-tenant-golden-path";
export const EXPECTED_REMOTE_HINT = "crow-ecosystem-platform";

const UNSAFE_LOCAL_FLAGS = [
  { key: "CROW_ALLOW_REAL_CUSTOMER_DATA", bad: ["true", "1", "yes"] },
  { key: "CROW_ALLOW_DISCOVERY_BLUEPRINT_COMPLETE", bad: ["1", "true", "yes"] },
  { key: "CROW_RUNTIME_MODE", bad: ["commercial_production"] },
];

export function getNodeMajor(version = process.version) {
  const m = String(version).match(/^v?(\d+)/);
  return m ? Number(m[1]) : null;
}

export function pathExists(repoRoot, relativePath) {
  return existsSync(join(repoRoot, relativePath));
}

export function requiredRepoFiles() {
  return [
    "package.json",
    "AGENTS.md",
    "docs/crow/START-HERE.md",
    "docs/crow/development/PORTABLE-ALPHA-DEVELOPMENT-WORKFLOW.md",
    ".env.alpha.example",
    ".env.local.example",
  ];
}

/** Parse KEY=VALUE lines; never return secret values to callers that print them. */
export function parseEnvKeys(content) {
  const map = new Map();
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    map.set(key, value);
  }
  return map;
}

export function detectUnsafeEnvFlags(envMap) {
  const hits = [];
  for (const rule of UNSAFE_LOCAL_FLAGS) {
    const raw = envMap.get(rule.key);
    if (raw === undefined) continue;
    if (rule.bad.includes(raw.trim().toLowerCase())) {
      hits.push(rule.key);
    }
  }
  return hits;
}

export function runGit(command, repoRoot) {
  try {
    return execSync(command, {
      cwd: repoRoot,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    }).trim();
  } catch {
    return null;
  }
}

/**
 * @returns {{ ok: boolean, warnings: string[], errors: string[], status: object }}
 */
export function collectPortableDevStatus(repoRoot, options = {}) {
  const requireFeatureBranch = options.requireFeatureBranch === true;
  const requireEnvLocal = options.requireEnvLocal === true;
  const warnings = [];
  const errors = [];

  const nodeMajor = getNodeMajor();
  if (nodeMajor !== EXPECTED_NODE_MAJOR) {
    errors.push(
      `Node major must be ${EXPECTED_NODE_MAJOR}.x (found ${process.version}).`,
    );
  }

  let npmOk = false;
  try {
    execSync("npm --version", { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
    npmOk = true;
  } catch {
    errors.push("npm is not available on PATH.");
  }

  const missingFiles = [];
  for (const rel of requiredRepoFiles()) {
    if (!pathExists(repoRoot, rel)) missingFiles.push(rel);
  }
  if (missingFiles.length > 0) {
    errors.push(`Missing required files: ${missingFiles.join(", ")}`);
  }

  const branch = runGit("git rev-parse --abbrev-ref HEAD", repoRoot);
  const head = runGit("git rev-parse --short HEAD", repoRoot);
  const remote = runGit("git remote get-url origin", repoRoot);
  const porcelain = runGit("git status --porcelain", repoRoot);

  if (!branch) errors.push("Unable to read git branch (is this a git checkout?).");
  if (!remote) errors.push("Git remote `origin` is missing.");
  else if (!remote.includes(EXPECTED_REMOTE_HINT)) {
    warnings.push(
      `origin URL does not look like ${EXPECTED_REMOTE_HINT} (redacted check only).`,
    );
  }

  if (branch && branch !== DEFAULT_FEATURE_BRANCH) {
    const msg = `Current branch is \`${branch}\` (expected \`${DEFAULT_FEATURE_BRANCH}\` for Alpha FTGP work).`;
    if (requireFeatureBranch) errors.push(msg);
    else warnings.push(msg);
  }

  if (porcelain && porcelain.length > 0) {
    warnings.push(
      "Working tree has local changes. Push or stash before switching devices.",
    );
  }

  const envLocalPath = join(repoRoot, ".env.local");
  const envLocalExists = existsSync(envLocalPath);
  let unsafeFlags = [];
  if (!envLocalExists) {
    const msg =
      ".env.local is missing. Copy `.env.alpha.example` or `.env.local.example` to `.env.local` (placeholders only; never commit).";
    if (requireEnvLocal) errors.push(msg);
    else warnings.push(msg);
  } else {
    try {
      const content = readFileSync(envLocalPath, "utf8");
      const map = parseEnvKeys(content);
      unsafeFlags = detectUnsafeEnvFlags(map);
      if (unsafeFlags.length > 0) {
        errors.push(
          `Unsafe Alpha flags set in .env.local (names only): ${unsafeFlags.join(", ")}. Real customer / commercial Production / Blueprint complete are blocked in Alpha Mode.`,
        );
      }
      if (!map.has("CROW_RUNTIME_MODE")) {
        warnings.push(
          "CROW_RUNTIME_MODE not set in .env.local — app defaults to alpha_development.",
        );
      }
      if (!map.has("CROW_DATA_CLASSIFICATION")) {
        warnings.push(
          "CROW_DATA_CLASSIFICATION not set in .env.local — app defaults to demo_only.",
        );
      }
    } catch {
      warnings.push("Could not read .env.local (permissions?). Values were not printed.");
    }
  }

  const ok = errors.length === 0;
  return {
    ok,
    warnings,
    errors,
    status: {
      nodeVersion: process.version,
      nodeMajor,
      npmOk,
      branch,
      head,
      hasOrigin: Boolean(remote),
      workingTreeClean: !porcelain || porcelain.length === 0,
      envLocalExists,
      unsafeFlagNames: unsafeFlags,
      repoRootLabel: "repo-root", // never print absolute path with secrets
    },
  };
}

export function printStatusReport(title, result) {
  console.log(title);
  console.log("---");
  const s = result.status;
  console.log(`Node: ${s.nodeVersion} (major ${s.nodeMajor})`);
  console.log(`npm: ${s.npmOk ? "available" : "MISSING"}`);
  console.log(`Branch: ${s.branch ?? "unknown"}`);
  console.log(`HEAD: ${s.head ?? "unknown"}`);
  console.log(`origin: ${s.hasOrigin ? "present" : "MISSING"}`);
  console.log(`Working tree clean: ${s.workingTreeClean ? "yes" : "no"}`);
  console.log(`.env.local: ${s.envLocalExists ? "present" : "missing"}`);
  if (s.unsafeFlagNames.length > 0) {
    console.log(`Unsafe flag names detected: ${s.unsafeFlagNames.join(", ")}`);
  }
  for (const w of result.warnings) console.log(`WARN: ${w}`);
  for (const e of result.errors) console.log(`ERROR: ${e}`);
  console.log(result.ok ? "STATUS: PASS" : "STATUS: FAIL");
}
