import { requireOnboardingScreenAccess } from "../../../lib/server/onboarding-route-guard";
import { NestAssessmentClient } from "./NestAssessmentClient";

export default async function NestAssessmentPage() {
  const { onboarding } = await requireOnboardingScreenAccess("ONB-004");
  if (!onboarding) return null;
  return <NestAssessmentClient initialOnboarding={onboarding} />;
}
