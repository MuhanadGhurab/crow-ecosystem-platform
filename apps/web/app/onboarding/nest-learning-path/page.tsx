import { requireOnboardingScreenAccess } from "../../../lib/server/onboarding-route-guard";
import { NestLearningPathClient } from "./NestLearningPathClient";

export default async function NestLearningPathPage() {
  const { onboarding } = await requireOnboardingScreenAccess("ONB-006");
  if (!onboarding) return null;
  return <NestLearningPathClient initialOnboarding={onboarding} />;
}
