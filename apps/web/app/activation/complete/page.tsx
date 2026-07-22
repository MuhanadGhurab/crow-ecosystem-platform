import { requireActivationScreenAccess } from "../../../lib/server/activation-route-guard";
import { CompleteClient } from "./CompleteClient";

export default async function CompletePage() {
  const { resource } = await requireActivationScreenAccess("ACT-006");
  return <CompleteClient initialResource={resource} />;
}
