import type { PlatformAccountStatus } from "@prisma/client";

import { isOnboardingGenerationCurrent } from "@/lib/account/onboarding-generation";

export type TenantPlatformAccountSnapshot = {
  status: PlatformAccountStatus;
  onboardingGeneration: number;
};

export type TenantPlatformAuthorizationDenialReason =
  | "platform_account_missing"
  | "platform_account_blocked"
  | "platform_account_not_active"
  | "platform_account_generation_stale";

export type TenantPlatformAuthorizationInput = {
  supabaseUserId: string;
  account: TenantPlatformAccountSnapshot | null;
  requiredGeneration: number;
  registrationFeatureEnabled: boolean;
  /** When true, legacy auth-only bypass is not permitted. */
  hasTenantMembership: boolean;
};

export type TenantPlatformAuthorizationResult =
  | { authorized: true }
  | {
      authorized: false;
      reason: TenantPlatformAuthorizationDenialReason;
      message: string;
    };

const BLOCKED_STATUSES = new Set<PlatformAccountStatus>([
  "SUSPENDED",
  "LOCKED",
  "DEACTIVATED",
]);

function isBlockedPlatformAccountStatus(status: PlatformAccountStatus): boolean {
  return BLOCKED_STATUSES.has(status);
}

function isActivePlatformAccount(account: TenantPlatformAccountSnapshot): boolean {
  return (
    account.status === "ACTIVE" &&
    isOnboardingGenerationCurrent(account.onboardingGeneration)
  );
}

/**
 * C3.10A — tenant access requires an ACTIVE platform account when a row exists.
 * Legacy Auth-only users without a PlatformAccount row remain on the pre-C3 path until reset.
 */
export function evaluateTenantPlatformAccountAuthorization(
  input: TenantPlatformAuthorizationInput
): TenantPlatformAuthorizationResult {
  const { account, registrationFeatureEnabled, hasTenantMembership } = input;

  if (!account) {
    if (registrationFeatureEnabled || hasTenantMembership) {
      return {
        authorized: false,
        reason: "platform_account_missing",
        message: "A verified platform account is required for tenant workspace access.",
      };
    }
    return { authorized: true };
  }

  if (isBlockedPlatformAccountStatus(account.status)) {
    return {
      authorized: false,
      reason: "platform_account_blocked",
      message: "This platform account is blocked from tenant workspace access.",
    };
  }

  if (account.status !== "ACTIVE") {
    return {
      authorized: false,
      reason: "platform_account_not_active",
      message:
        "Platform account must be ACTIVE before tenant workspace access is permitted.",
    };
  }

  if (!isActivePlatformAccount(account)) {
    return {
      authorized: false,
      reason: "platform_account_generation_stale",
      message: "Platform account must complete the current onboarding generation.",
    };
  }

  return { authorized: true };
}

export async function resolveTenantPlatformAccountAuthorization(
  supabaseUserId: string,
  options: {
    requiredGeneration: number;
    registrationFeatureEnabled: boolean;
    hasTenantMembership: boolean;
  }
): Promise<TenantPlatformAuthorizationResult> {
  const { findPlatformAccountBySupabaseUserId } = await import(
    "@/lib/account/platform-account.service"
  );
  const account = await findPlatformAccountBySupabaseUserId(supabaseUserId);
  return evaluateTenantPlatformAccountAuthorization({
    supabaseUserId,
    account,
    requiredGeneration: options.requiredGeneration,
    registrationFeatureEnabled: options.registrationFeatureEnabled,
    hasTenantMembership: options.hasTenantMembership,
  });
}
