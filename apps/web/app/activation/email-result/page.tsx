import { loadActivationEntryScreen } from "../../../lib/server/activation-route-guard";
import { EmailResultClient } from "./EmailResultClient";

export default async function EmailResultPage() {
  const { resource } = await loadActivationEntryScreen("ACT-011");
  return <EmailResultClient initialResource={resource} />;
}
