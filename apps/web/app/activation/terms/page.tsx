import { requireActivationScreenAccess } from "../../../lib/server/activation-route-guard";
import { TermsClient } from "./TermsClient";

export default async function TermsPage() {
  const { resource } = await requireActivationScreenAccess("ACT-005");
  return <TermsClient initialResource={resource} />;
}
