import { requireOnboardingScreenAccess } from "../../../lib/server/onboarding-route-guard";
import { CrowPersonalizeClient } from "./CrowPersonalizeClient";

export default async function CrowPage() {
  const { onboarding } = await requireOnboardingScreenAccess("IDN-001");
  if (!onboarding) {
    // Guard should redirect; defensive
    return null;
  }
  return <CrowPersonalizeClient initialOnboarding={onboarding} />;
}
