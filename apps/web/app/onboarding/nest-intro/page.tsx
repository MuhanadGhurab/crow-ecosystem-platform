import { requireOnboardingScreenAccess } from "../../../lib/server/onboarding-route-guard";
import { NestIntroClient } from "./NestIntroClient";

export default async function NestIntroPage() {
  const { onboarding } = await requireOnboardingScreenAccess("ONB-003");
  if (!onboarding) return null;
  return <NestIntroClient initialOnboarding={onboarding} />;
}
