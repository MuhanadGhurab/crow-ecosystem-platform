/**
 * FTGP.1H.4a — Operator-wait state machine for private certification Vercel SSO.
 */
import {
  FTGP_CERTIFICATION_PUBLIC_ALIAS_HOST,
  isProtectedCertificationDeploymentHost,
} from "../../src/lib/ftgp/ftgp-certification-host-gate";

import { FTGP_LIVE_PRODUCTION_ORIGIN } from "./ftgp-certification-environment";

export const VERCEL_OPERATOR_AUTH_WAIT_MS = 180_000;

export type VercelProtectedAccessPhase =
  | "crow_login_ready"
  | "crow_application_ready"
  | "vercel_sso_redirect"
  | "unauthorized_host";

const OLD_PREVIEW_HOST_PATTERN =
  /^crow-ecosystem-platform-[a-z0-9]+-muhanadghurabs-projects\.vercel\.app$/;

export function isVercelAuthenticationHostname(hostname: string): boolean {
  const host = hostname.toLowerCase();
  return host === "vercel.com" || host.endsWith(".vercel.com");
}

export function isApprovedCertificationProofHost(hostname: string, protectedBase: string): boolean {
  const host = hostname.toLowerCase();
  const expected = new URL(protectedBase).hostname.toLowerCase();
  if (host === expected) return true;
  return isProtectedCertificationDeploymentHost(host);
}

/** Hosts that must never be accepted as the post-SSO Crow application origin. */
export function isUnauthorizedProofReturnHost(hostname: string, protectedBase: string): boolean {
  const host = hostname.toLowerCase();
  if (isVercelAuthenticationHostname(host)) return false;
  if (isApprovedCertificationProofHost(host, protectedBase)) return false;
  return true;
}

export function classifyProtectedPageLocation(
  currentUrl: string,
  protectedBase: string
): VercelProtectedAccessPhase {
  let parsed: URL;
  try {
    parsed = new URL(currentUrl);
  } catch {
    return "unauthorized_host";
  }

  if (isVercelAuthenticationHostname(parsed.hostname)) {
    return "vercel_sso_redirect";
  }

  if (isUnauthorizedProofReturnHost(parsed.hostname, protectedBase)) {
    return "unauthorized_host";
  }

  const { pathname } = parsed;
  if (pathname === "/login" || pathname.startsWith("/login/")) {
    return "crow_login_ready";
  }
  if (pathname === "/account" || pathname.startsWith("/account/")) {
    return "crow_application_ready";
  }

  return "crow_login_ready";
}

export function classifyInitialHttpGateStatus(httpStatus: number): VercelProtectedAccessPhase | null {
  if (httpStatus === 401 || httpStatus === 403 || httpStatus === 302 || httpStatus === 307 || httpStatus === 308) {
    return "vercel_sso_redirect";
  }
  return null;
}

export function requiresVercelOperatorWait(phase: VercelProtectedAccessPhase): boolean {
  return phase === "vercel_sso_redirect";
}

export function isCrowApplicationReadyPhase(phase: VercelProtectedAccessPhase): boolean {
  return phase === "crow_login_ready" || phase === "crow_application_ready";
}

export function assertApprovedProofReturnUrl(url: string, protectedBase: string): void {
  const host = new URL(url).hostname;
  if (isUnauthorizedProofReturnHost(host, protectedBase)) {
    throw new Error(`Unauthorized proof return host: ${host}`);
  }
}

export function printVercelSsoOperatorInstructions(
  variant: "ftgp_client_owner" | "procrow_owner_admin" = "ftgp_client_owner"
): void {
  console.log("  Complete Vercel Authentication in the opened browser.");
  if (variant === "procrow_owner_admin") {
    console.log("  After Crow /login appears, continue with the designated personal owner Google account.");
    console.log("  Do not use the former bootstrap admin, Candidate 07 owner, or retained C3 requester.");
    return;
  }
  console.log("  After Crow /login appears, continue with the Candidate 07 owner Google account.");
  console.log("  Do not use PLATFORM_ADMIN, IMPLEMENTER, or the retained C3 requester.");
}

export function isDeniedProofHostForTests(hostname: string): boolean {
  const host = hostname.toLowerCase();
  if (host === FTGP_CERTIFICATION_PUBLIC_ALIAS_HOST) return true;
  if (host === new URL(FTGP_LIVE_PRODUCTION_ORIGIN).hostname.toLowerCase()) return true;
  if (OLD_PREVIEW_HOST_PATTERN.test(host)) return true;
  if (host === "localhost" || host === "127.0.0.1") return true;
  return false;
}
