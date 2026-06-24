import { BlueprintStudioPersistencePanel } from "@/components/procrow/blueprint-studio-persistence-panel";
import { listPersistableRequestsForStudio } from "@/lib/actions/persistent-blueprint";
import { requireBlueprintPlatformAdmin } from "@/lib/auth/blueprint-engine-guard";
import { BlueprintStudioContent } from "@/components/procrow/blueprint-studio-content";
import { routes } from "@/lib/routes";

export const dynamic = "force-dynamic";

/** ProCrow Blueprint Studio — PLATFORM_ADMIN only; compile preview and optional internal draft persistence. */
export default async function AdminBlueprintStudioPage() {
  await requireBlueprintPlatformAdmin(routes.admin.blueprintStudio);
  const persistRequests = await listPersistableRequestsForStudio();
  return <BlueprintStudioContent persistRequests={persistRequests} />;
}
