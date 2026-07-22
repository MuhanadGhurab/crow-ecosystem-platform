import { requireOnboardingScreenAccess } from "../../../lib/server/onboarding-route-guard";
import { NestResultClient } from "./NestResultClient";

export default async function NestResultPage() {
  const { onboarding } = await requireOnboardingScreenAccess("ONB-005");
  if (!onboarding) return null;
  return <NestResultClient initialOnboarding={onboarding} />;
}
