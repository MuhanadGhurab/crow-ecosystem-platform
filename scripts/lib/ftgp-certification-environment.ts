/**
 * FTGP.1H.2 — Private Vercel certification environment (production-like, not live Production).
 */
import { createHash } from "node:crypto";
import { execSync, spawnSync } from "node:child_process";
import { readFileSync, unlinkSync } from "node:fs";
import { join } from "node:path";

import { FTGP_CERTIFICATION_SOURCE_COMMIT_ENV } from "../../src/lib/ftgp/ftgp-certification-host-gate";

export const FTGP_CERTIFICATION_PROJECT_NAME = "crow-ftgp-certification" as const;

export const FTGP_CERTIFICATION_CLASSIFICATION =
  "PRIVATE_VERCEL_CERTIFICATION" as const;

/** Stable production URL within the dedicated certification Vercel project. */
export const FTGP_CERTIFICATION_DEFAULT_ORIGIN =
  "https://crow-ftgp-certification.vercel.app";

export const FTGP_CERTIFICATION_OPERATOR_ENV = ".env.ftgp-certification.operator";

export const FTGP_CERTIFICATION_BASE_URL_ENV = "FTGP_CERTIFICATION_BASE_URL";

export const FTGP_CERTIFICATION_BRANCH = "feat/first-tenant-golden-path";

export const FTGP_LIVE_PRODUCTION_PROJECT_NAME = "crow-ecosystem-platform";

export const FTGP_LIVE_PRODUCTION_ORIGIN =
  "https://crow-ecosystem-platform.vercel.app";

export function resolveFtgpCertificationBaseUrl(): string {
  const fromEnv = process.env[FTGP_CERTIFICATION_BASE_URL_ENV]?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  const latest = resolveLatestCertificationDeploymentUrl();
  if (latest) return latest;
  return FTGP_CERTIFICATION_DEFAULT_ORIGIN;
}

/**
 * Latest Production deployment URL — SSO-protected on standard Vercel plans
 * (stable *.vercel.app aliases remain world-reachable until Advanced Deployment Protection).
 */
export function resolveLatestCertificationDeploymentUrl(): string | null {
  try {
    const out = execSync(`npx vercel ls ${FTGP_CERTIFICATION_PROJECT_NAME} --prod`, {
      encoding: "utf8",
      shell: process.platform === "win32",
      timeout: 60_000,
      stdio: ["pipe", "pipe", "pipe"],
    });
    const lines = out.split("\n");
    for (const line of lines) {
      if (!line.includes("Ready") || !line.includes("https://")) continue;
      const match = line.match(/https:\/\/crow-ftgp-certification-[a-z0-9]+-muhanadghurabs-projects\.vercel\.app/);
      if (match?.[0]) return match[0];
    }
    const fallback = out.match(
      /https:\/\/crow-ftgp-certification-[a-z0-9]+-muhanadghurabs-projects\.vercel\.app/
    );
    return fallback?.[0] ?? null;
  } catch {
    return null;
  }
}

export function certificationOriginFingerprint(origin: string): string {
  return createHash("sha256")
    .update(`ftgp-cert-origin:${origin.replace(/\/$/, "")}`)
    .digest("hex")
    .slice(0, 16);
}

export function assertCertificationHost(url: string | URL, certificationBase: string, label: string): void {
  const expected = new URL(certificationBase).host;
  const actual = typeof url === "string" ? new URL(url).host : url.host;
  if (actual !== expected) {
    throw new Error(`Host drift at ${label}: expected ${expected}, got ${actual}`);
  }
}

export function isFtgpCertificationMode(): boolean {
  return Boolean(process.env[FTGP_CERTIFICATION_BASE_URL_ENV]?.trim());
}

/** Certification proof must not use Preview automation bypass headers. */
export function certificationProofRequiresVercelSso(): boolean {
  return true;
}

export function requiredCertificationAuthRedirectPaths(origin: string): string[] {
  const base = origin.replace(/\/$/, "");
  return [`${base}/auth/callback`, `${base}/auth/resolving`];
}

export type CertificationDeploymentProvenance = {
  deploymentId: string;
  inspectGitSha: string | null;
  healthSourceCommit: string | null;
};

/** Staging runtime pulls crow-ecosystem-platform OIDC — breaks certification vercel curl SSO. */
export function certificationVercelCliEnv(): NodeJS.ProcessEnv {
  const env = { ...process.env };
  for (const key of [
    "VERCEL_OIDC_TOKEN",
    "VERCEL",
    "VERCEL_ENV",
    "VERCEL_TARGET_ENV",
    "VERCEL_AUTOMATION_BYPASS_SECRET",
  ]) {
    delete env[key];
  }
  return env;
}

function parseEnvFile(content: string): Map<string, string> {
  const map = new Map<string, string>();
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    let value = trimmed.slice(eq + 1);
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    map.set(trimmed.slice(0, eq), value);
  }
  return map;
}

/** Encrypted Vercel env values are redacted on pull — use runtime health when available. */
export function readCertificationPinnedSourceCommit(): string | null {
  const pulledPath = join(process.cwd(), ".env.ftgp-certification.pulled.tmp");
  try {
    const result = spawnSync(
      "npx",
      ["vercel", "env", "pull", pulledPath, "--environment=production", "--yes"],
      {
        encoding: "utf8",
        shell: process.platform === "win32",
        cwd: process.cwd(),
        env: certificationVercelCliEnv(),
      }
    );
    if ((result.status ?? 1) !== 0) return null;
    const value = parseEnvFile(readFileSync(pulledPath, "utf8")).get(
      FTGP_CERTIFICATION_SOURCE_COMMIT_ENV
    );
    const trimmed = value?.trim();
    if (!trimmed || trimmed === '""' || trimmed === "''") return null;
    return trimmed;
  } catch {
    return null;
  } finally {
    try {
      unlinkSync(pulledPath);
    } catch {
      /* ignore */
    }
  }
}

export function resolveCertificationDeploymentProvenance(
  deploymentUrl: string
): CertificationDeploymentProvenance {
  const host = deploymentUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const json = execSync(`npx vercel inspect ${host} --json`, {
    encoding: "utf8",
    shell: process.platform === "win32",
    timeout: 120_000,
    stdio: ["pipe", "pipe", "pipe"],
    env: certificationVercelCliEnv(),
  });
  const parsed = JSON.parse(json) as {
    id?: string;
    meta?: { githubCommitSha?: string; gitCommitSha?: string };
  };
  if (!parsed.id) {
    throw new Error("Could not read deployment id from vercel inspect");
  }

  let healthSourceCommit: string | null = null;
  try {
    const body = execSync(
      `npx vercel curl -s "${deploymentUrl.replace(/\/$/, "")}/api/health"`,
      {
        encoding: "utf8",
        shell: process.platform === "win32",
        timeout: 120_000,
        stdio: ["pipe", "pipe", "pipe"],
        env: certificationVercelCliEnv(),
      }
    ).trim();
    if (body.startsWith("{")) {
      const health = JSON.parse(body) as {
        certification?: { sourceCommit?: string | null };
      };
      healthSourceCommit = health.certification?.sourceCommit ?? null;
    }
  } catch {
    healthSourceCommit = null;
  }

  return {
    deploymentId: parsed.id,
    inspectGitSha: parsed.meta?.githubCommitSha ?? parsed.meta?.gitCommitSha ?? null,
    healthSourceCommit,
  };
}

export function resolveAuthoritativeCertificationSourceCommit(
  provenance: CertificationDeploymentProvenance
): string | null {
  return provenance.healthSourceCommit ?? provenance.inspectGitSha ?? readCertificationPinnedSourceCommit();
}
