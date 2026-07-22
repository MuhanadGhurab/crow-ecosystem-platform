import { requireOnboardingScreenAccess } from "../../../lib/server/onboarding-route-guard";
import { CharacterClient } from "./CharacterClient";

export default async function CharacterPage() {
  const { onboarding } = await requireOnboardingScreenAccess("IDN-003");
  if (!onboarding) return null;
  return <CharacterClient initialOnboarding={onboarding} />;
}
