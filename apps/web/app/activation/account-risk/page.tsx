import { requireActivationScreenAccess } from "../../../lib/server/activation-route-guard";
import { AccountRiskClient } from "./AccountRiskClient";

export default async function AccountRiskPage() {
  const { resource } = await requireActivationScreenAccess("ACT-013");
  return <AccountRiskClient initialResource={resource} />;
}
