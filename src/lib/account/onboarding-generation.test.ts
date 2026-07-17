import assert from "node:assert/strict";

import {
  getCurrentEnrollmentGeneration,
  getRequiredOnboardingGeneration,
  CROW_DUAL_CHANNEL_ENROLLMENT_GENERATION,
} from "@/lib/account/onboarding-generation";

{
  const prev = process.env.CROW_ONBOARDING_GENERATION_REQUIRED;
  process.env.CROW_ONBOARDING_GENERATION_REQUIRED = "1";
  assert.equal(getRequiredOnboardingGeneration(), 1);
  assert.equal(getCurrentEnrollmentGeneration(), CROW_DUAL_CHANNEL_ENROLLMENT_GENERATION);
  process.env.CROW_ONBOARDING_GENERATION_REQUIRED = prev;
}

{
  delete process.env.CROW_ONBOARDING_GENERATION_REQUIRED;
  assert.equal(getRequiredOnboardingGeneration(), 2);
  assert.equal(getCurrentEnrollmentGeneration(), 2);
}

console.log("onboarding-generation: passed");
