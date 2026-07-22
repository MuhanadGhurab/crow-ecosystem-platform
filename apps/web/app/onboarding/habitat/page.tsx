import { requireOnboardingScreenAccess } from "../../../lib/server/onboarding-route-guard";
import { HabitatClient } from "./HabitatClient";

export default async function HabitatPage() {
  const { onboarding } = await requireOnboardingScreenAccess("IDN-002");
  if (!onboarding) return null;
  return <HabitatClient initialOnboarding={onboarding} />;
}
