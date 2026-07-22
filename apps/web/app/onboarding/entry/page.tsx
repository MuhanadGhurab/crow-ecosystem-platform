import { requireOnboardingScreenAccess } from "../../../lib/server/onboarding-route-guard";
import { OnboardingEntryClient } from "./OnboardingEntryClient";

export default async function OnboardingEntryPage() {
  const { activation, onboarding } =
    await requireOnboardingScreenAccess("ONB-001");
  return (
    <OnboardingEntryClient
      activation={activation}
      initialOnboarding={onboarding}
    />
  );
}
