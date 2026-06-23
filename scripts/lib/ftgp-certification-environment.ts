/**
 * FTGP.1H.2 — Private Vercel certification environment (production-like, not live Production).
 */
import { createHash } from "node:crypto";
import { execSync } from "node:child_process";

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
