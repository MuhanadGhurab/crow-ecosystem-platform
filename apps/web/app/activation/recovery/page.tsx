import { requireActivationScreenAccess } from "../../../lib/server/activation-route-guard";
import { RecoveryClient } from "./RecoveryClient";

export default async function RecoveryPage() {
  const { resource } = await requireActivationScreenAccess("ACT-012");
  return <RecoveryClient initialResource={resource} />;
}
