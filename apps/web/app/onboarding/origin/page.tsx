import { requireOnboardingScreenAccess } from "../../../lib/server/onboarding-route-guard";
import { OriginClient } from "./OriginClient";

export default async function OriginPage() {
  const { onboarding } = await requireOnboardingScreenAccess("ONB-002");
  if (!onboarding) return null;
  return <OriginClient initialOnboarding={onboarding} />;
}
