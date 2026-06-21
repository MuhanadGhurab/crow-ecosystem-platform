import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import type { PlatformAccount } from "@prisma/client";

import {
  isPhoneVerificationRequired,
  isPhoneVerificationRequiredForAccount,
} from "@/lib/account/phone-verification-policy";
import {
  CROW_EMAIL_ONLY_ONBOARDING_GENERATION,
  CROW_PHONE_ONBOARDING_GENERATION,
} from "@/lib/account/onboarding-generation";

function mockAccount(
  partial: Partial<PlatformAccount> & Pick<PlatformAccount, "onboardingGeneration">
): PlatformAccount {
  return {
    id: "acct-test",
    supabaseUserId: "user-test",
    email: "test@example.com",
    emailNormalized: "test@example.com",
    publicAccountId: "pub-test",
    status: "PENDING_EMAIL_VERIFICATION",
    registrationSource: "email_password",
    emailVerifiedAt: null,
    emailVerificationSource: null,
    phoneNormalized: null,
    phoneMasked: null,
    phoneVerifiedAt: null,
    phoneVerificationSource: null,
    activatedAt: null,
    lastVerifiedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...partial,
  } as PlatformAccount;
}

const prevPhonePolicy = process.env.CROW_PHONE_VERIFICATION_REQUIRED;

function withPhonePolicy(value: string | undefined, fn: () => void) {
  if (value === undefined) {
    delete process.env.CROW_PHONE_VERIFICATION_REQUIRED;
  } else {
    process.env.CROW_PHONE_VERIFICATION_REQUIRED = value;
  }
  try {
    fn();
  } finally {
    if (prevPhonePolicy === undefined) {
      delete process.env.CROW_PHONE_VERIFICATION_REQUIRED;
    } else {
      process.env.CROW_PHONE_VERIFICATION_REQUIRED = prevPhonePolicy;
    }
  }
}

withPhonePolicy(undefined, () => {
  assert.equal(isPhoneVerificationRequired(), false, "default policy is deferred");
});

withPhonePolicy("false", () => {
  assert.equal(isPhoneVerificationRequired(), false);
});

withPhonePolicy("true", () => {
  assert.equal(isPhoneVerificationRequired(), true);
  const gen2 = mockAccount({ onboardingGeneration: CROW_EMAIL_ONLY_ONBOARDING_GENERATION });
  assert.equal(
    isPhoneVerificationRequiredForAccount(gen2),
    false,
    "generation 2 semantics unchanged when policy on"
  );
  const gen3 = mockAccount({ onboardingGeneration: CROW_PHONE_ONBOARDING_GENERATION });
  assert.equal(
    isPhoneVerificationRequiredForAccount(gen3),
    true,
    "generation 3 requires phone when policy on"
  );
});

withPhonePolicy(undefined, () => {
  const gen2VerifiedEmail = mockAccount({
    onboardingGeneration: CROW_EMAIL_ONLY_ONBOARDING_GENERATION,
    status: "PENDING_PHONE_VERIFICATION",
    emailVerifiedAt: new Date(),
    phoneVerifiedAt: null,
  });
  assert.equal(
    isPhoneVerificationRequiredForAccount(gen2VerifiedEmail),
    false,
    "gen 2 never requires phone while policy off"
  );
  const platformSvc = readFileSync(
    join(process.cwd(), "src/lib/account/platform-account.service.ts"),
    "utf8"
  );
  assert(
    platformSvc.includes("!isPhoneVerificationRequiredForAccount(account)"),
    "isPendingPhoneVerification ignores stale status when policy off"
  );

  const activation = readFileSync(
    join(process.cwd(), "src/lib/account/platform-account-activation.ts"),
    "utf8"
  );
  assert(
    activation.includes("phoneVerified = !phoneRequired || account.phoneVerifiedAt"),
    "activation treats phone as satisfied when policy off"
  );
});

console.log("c3-email-only-onboarding.unit: passed");
