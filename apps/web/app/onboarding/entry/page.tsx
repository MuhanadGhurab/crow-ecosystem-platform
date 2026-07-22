import { requireActivationScreenAccess } from "../../../lib/server/activation-route-guard";
import { OnboardingEntryClient } from "./OnboardingEntryClient";

export default async function OnboardingEntryPage() {
  const { resource } = await requireActivationScreenAccess("ONB-001");
  return <OnboardingEntryClient initialResource={resource} />;
}
