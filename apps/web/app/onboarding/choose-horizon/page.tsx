import { requireOnboardingScreenAccess } from "../../../lib/server/onboarding-route-guard";
import { ChooseHorizonClient } from "./ChooseHorizonClient";

export default async function ChooseHorizonPage() {
  const { onboarding } = await requireOnboardingScreenAccess("ONB-007");
  if (!onboarding) return null;
  return <ChooseHorizonClient initialOnboarding={onboarding} />;
}
