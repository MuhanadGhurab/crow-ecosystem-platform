import { requireActivationScreenAccess } from "../../../lib/server/activation-route-guard";
import { MobileOptionalClient } from "./MobileOptionalClient";

export default async function MobileOptionalPage() {
  const { resource } = await requireActivationScreenAccess("ACT-007");
  return <MobileOptionalClient initialResource={resource} />;
}
