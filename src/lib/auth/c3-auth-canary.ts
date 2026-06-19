import "server-only";

import { notFound } from "next/navigation";

/** Preview-only official Supabase SSR auth canary (C3.7D). */
export function isC3AuthCanaryEnabled(): boolean {
  return (
    process.env.VERCEL_ENV === "preview" &&
    process.env.C3_AUTH_CANARY_ENABLED === "true"
  );
}

export function isAuthCanaryPath(pathname: string): boolean {
  return pathname === "/auth-canary" || pathname.startsWith("/auth-canary/");
}

/** Canary subroutes that should receive middleware session refresh (not the login form). */
export function isAuthCanarySessionRefreshPath(pathname: string): boolean {
  return pathname.startsWith("/auth-canary/") && pathname !== "/auth-canary";
}

export function assertAuthCanaryRouteEnabled(): void {
  if (!isC3AuthCanaryEnabled()) {
    notFound();
  }
}
