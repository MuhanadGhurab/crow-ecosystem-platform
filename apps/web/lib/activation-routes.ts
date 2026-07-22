/**
 * Governed activation / onboarding-entry routes (screen IDs from Master Registry).
 */
export const ACTIVATION_ROUTES = {
  "ACT-003": "/activation/email-pending",
  "ACT-011": "/activation/email-result",
  "ACT-005": "/activation/terms",
  "ACT-013": "/activation/account-risk",
  "ACT-012": "/activation/recovery",
  "ACT-006": "/activation/complete",
  "ACT-007": "/activation/mobile-optional",
  "ONB-001": "/onboarding/entry",
} as const;

export type GovernedScreenId = keyof typeof ACTIVATION_ROUTES;

export const ALLOWED_RETURN_TO = new Set<string>([
  ...Object.values(ACTIVATION_ROUTES),
  // Onboarding / identity screens (composed with onboarding-routes)
  "/onboarding/entry",
  "/onboarding/crow",
  "/onboarding/habitat",
  "/onboarding/character",
  "/onboarding/origin",
  "/onboarding/nest-intro",
]);

export function isAllowedReturnTo(path: string | null | undefined): boolean {
  if (!path) return false;
  try {
    if (path.startsWith("http://") || path.startsWith("https://")) return false;
    const normalized = path.split("?")[0] ?? path;
    return ALLOWED_RETURN_TO.has(normalized);
  } catch {
    return false;
  }
}

export type ActivationGatesLike = {
  emailVerified: boolean;
  termsAccepted: boolean;
  accountRiskAcceptable: boolean;
};

export type ActivationResourceLike = {
  state: string;
  gates: ActivationGatesLike;
  recoveryAvailable: boolean;
};

/**
 * ACT-012 is for governed recovery/terminal review states only.
 * Do not treat Explainable Lock `recoveryAvailable` (self-remediation of
 * normal gates) as ACT-012 eligibility — those locks are true whenever
 * email/terms/risk remain unsatisfied.
 */
export function isGovernedRecoveryState(state: string): boolean {
  return (
    state === "ACTIVATION_RECOVERY_REQUIRED" ||
    state === "RISK_REVIEW_REQUIRED" ||
    state === "SUSPENDED" ||
    state === "CLOSED"
  );
}

/** Server-authoritative next screen for navigation helpers. */
export function resolveAuthorizedScreen(
  resource: ActivationResourceLike,
): GovernedScreenId {
  if (isGovernedRecoveryState(resource.state)) {
    return "ACT-012";
  }
  if (resource.state === "ACTIVATED") {
    return "ACT-006";
  }
  if (!resource.gates.emailVerified) {
    return "ACT-003";
  }
  if (!resource.gates.termsAccepted) return "ACT-005";
  if (!resource.gates.accountRiskAcceptable) return "ACT-013";
  return "ACT-006";
}

export function canAccessScreen(
  screenId: GovernedScreenId,
  resource: ActivationResourceLike | null,
): { allowed: boolean; redirectTo?: GovernedScreenId } {
  if (!resource) {
    // Unauthenticated: allow session bootstrap on entry screens only.
    // Do not redirect until a resource is loaded (avoids flash races).
    return {
      allowed: screenId === "ACT-003" || screenId === "ACT-011",
      redirectTo: "ACT-003",
    };
  }
  const { gates, state } = resource;
  const activated = state === "ACTIVATED";

  switch (screenId) {
    case "ACT-003":
    case "ACT-011":
      return { allowed: true };
    case "ACT-005":
      if (!gates.emailVerified) {
        return { allowed: false, redirectTo: "ACT-003" };
      }
      return { allowed: true };
    case "ACT-013":
      if (!gates.emailVerified) {
        return { allowed: false, redirectTo: "ACT-003" };
      }
      if (!gates.termsAccepted) {
        return { allowed: false, redirectTo: "ACT-005" };
      }
      return { allowed: true };
    case "ACT-012": {
      if (!isGovernedRecoveryState(state)) {
        return {
          allowed: false,
          redirectTo: resolveAuthorizedScreen(resource),
        };
      }
      return { allowed: true };
    }
    case "ACT-006":
      if (!activated) {
        return {
          allowed: false,
          redirectTo: resolveAuthorizedScreen(resource),
        };
      }
      return { allowed: true };
    case "ACT-007":
    case "ONB-001":
      if (!activated) {
        return {
          allowed: false,
          redirectTo: resolveAuthorizedScreen(resource),
        };
      }
      return { allowed: true };
    default: {
      const _never: never = screenId;
      return _never;
    }
  }
}

export function routeFor(screenId: GovernedScreenId): string {
  return ACTIVATION_ROUTES[screenId];
}
