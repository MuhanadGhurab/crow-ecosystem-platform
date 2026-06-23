import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const FTGP_CERTIFICATION_MODE_ENV = "FTGP_CERTIFICATION_MODE";
export const FTGP_CERTIFICATION_ALLOWED_HOST_ENV = "FTGP_CERTIFICATION_ALLOWED_HOST";
export const FTGP_CERTIFICATION_SOURCE_COMMIT_ENV = "FTGP_CERTIFICATION_SOURCE_COMMIT";

export const FTGP_CERTIFICATION_PUBLIC_ALIAS_HOST = "crow-ftgp-certification.vercel.app";

const DENIED_CERTIFICATION_ALIAS_HOSTS = new Set([
  FTGP_CERTIFICATION_PUBLIC_ALIAS_HOST,
  "crow-ftgp-certification-muhanadghurabs-projects.vercel.app",
  "crow-ftgp-certification-muhanadghurab-muhanadghurabs-projects.vercel.app",
]);

const PROTECTED_DEPLOYMENT_HOST_PATTERN =
  /^crow-ftgp-certification-[a-z0-9]+-muhanadghurabs-projects\.vercel\.app$/;

export type FtgpCertificationHostGateDecision = "inactive" | "allow" | "deny";

/** Normalize Host header: lowercase, strip default ports, reject multi-value. */
export function normalizeRequestHost(raw: string | null | undefined): string | null {
  if (!raw?.trim()) return null;
  if (raw.includes(",")) return null;

  let host = raw.trim().toLowerCase();
  if (host.startsWith("[")) {
    const end = host.indexOf("]");
    if (end === -1) return null;
    return host.slice(1, end) || null;
  }

  const colon = host.lastIndexOf(":");
  if (colon > -1) {
    const port = host.slice(colon + 1);
    if (port === "443" || port === "80") {
      host = host.slice(0, colon);
    }
  }

  if (!/^[a-z0-9.-]+$/.test(host)) return null;
  return host;
}

export function normalizeAllowedHost(raw: string | null | undefined): string | null {
  const normalized = normalizeRequestHost(raw ?? null);
  if (!normalized) return null;
  if (DENIED_CERTIFICATION_ALIAS_HOSTS.has(normalized)) return null;
  if (!isProtectedCertificationDeploymentHost(normalized)) return null;
  return normalized;
}

export function isProtectedCertificationDeploymentHost(host: string): boolean {
  const normalized = normalizeRequestHost(host);
  if (!normalized || DENIED_CERTIFICATION_ALIAS_HOSTS.has(normalized)) {
    return false;
  }
  return PROTECTED_DEPLOYMENT_HOST_PATTERN.test(normalized);
}

export function isFtgpCertificationHostGateEnabled(): boolean {
  return process.env[FTGP_CERTIFICATION_MODE_ENV]?.trim().toLowerCase() === "true";
}

export function resolveFtgpCertificationAllowedHost(): string | null {
  return normalizeAllowedHost(process.env[FTGP_CERTIFICATION_ALLOWED_HOST_ENV]);
}

export function evaluateFtgpCertificationHostGate(
  requestHost: string | null | undefined
): FtgpCertificationHostGateDecision {
  if (!isFtgpCertificationHostGateEnabled()) {
    return "inactive";
  }

  const host = normalizeRequestHost(requestHost);
  if (!host) {
    return "deny";
  }

  const pinned = resolveFtgpCertificationAllowedHost();
  if (pinned && host === pinned) {
    return "allow";
  }

  if (isProtectedCertificationDeploymentHost(host)) {
    return "allow";
  }

  return "deny";
}

export function certificationHostDeniedResponse(): NextResponse {
  return new NextResponse("Not Found", {
    status: 404,
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}

export function applyFtgpCertificationHostGate(request: NextRequest): NextResponse | null {
  const decision = evaluateFtgpCertificationHostGate(request.headers.get("host"));
  if (decision === "inactive" || decision === "allow") {
    return null;
  }
  return certificationHostDeniedResponse();
}

export function resolveFtgpCertificationSourceCommit(): string | null {
  const pinned = process.env[FTGP_CERTIFICATION_SOURCE_COMMIT_ENV]?.trim();
  if (pinned) return pinned;
  const vercelGit = process.env.VERCEL_GIT_COMMIT_SHA?.trim();
  return vercelGit || null;
}
