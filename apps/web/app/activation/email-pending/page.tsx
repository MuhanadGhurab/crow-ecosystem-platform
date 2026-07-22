import { loadActivationEntryScreen } from "../../../lib/server/activation-route-guard";
import { EmailPendingClient } from "./EmailPendingClient";

export default async function EmailPendingPage() {
  const { resource } = await loadActivationEntryScreen("ACT-003");
  return <EmailPendingClient initialResource={resource} />;
}
