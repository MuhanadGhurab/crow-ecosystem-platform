import assert from "node:assert/strict";

import type { PlatformAccountStatus } from "@prisma/client";

import {
  evaluateTenantPlatformAccountAuthorization,
  type TenantPlatformAuthorizationInput,
} from "@/lib/account/tenant-platform-account-authorization";

type TestAccount = NonNullable<TenantPlatformAuthorizationInput["account"]> & {
  id?: string;
  supabaseUserId?: string;
};

function account(overrides: Partial<TestAccount> = {}): TestAccount {
  return {
    status: "ACTIVE",
    onboardingGeneration: 1,
    ...overrides,
  };
}

function evaluate(
  partial: Partial<TenantPlatformAuthorizationInput>
): ReturnType<typeof evaluateTenantPlatformAccountAuthorization> {
  return evaluateTenantPlatformAccountAuthorization({
    supabaseUserId: "auth_test",
    account: null,
    requiredGeneration: 1,
    registrationFeatureEnabled: false,
    hasTenantMembership: false,
    ...partial,
  });
}

assert.equal(
  evaluate({
    account: account({ status: "PENDING_EMAIL_VERIFICATION", onboardingGeneration: 2 }),
    hasTenantMembership: true,
  }).authorized,
  false,
  "pending platform account denies tenant access even with membership row"
);

assert.equal(
  evaluate({
    account: null,
    hasTenantMembership: true,
  }).authorized,
  false,
  "legacy auth user with membership but no platform account is denied"
);

assert.equal(
  evaluate({
    account: account({ status: "ACTIVE", onboardingGeneration: 2 }),
  }).authorized,
  true,
  "ACTIVE generation-2 account authorized when required generation defaults to 2"
);

assert.equal(
  evaluate({
    account: account({ status: "ACTIVE", onboardingGeneration: 1 }),
  }).authorized,
  false,
  "generation-1 account denied when required generation is 2 (default)"
);

assert.equal(
  evaluate({
    account: null,
    registrationFeatureEnabled: true,
  }).authorized,
  false,
  "registration enabled requires platform account row"
);

assert.equal(
  evaluate({ account: null, registrationFeatureEnabled: false }).authorized,
  true,
  "legacy auth-only path allowed when registration disabled and no platform row"
);

console.log("tenant-platform-account-authorization: passed");
