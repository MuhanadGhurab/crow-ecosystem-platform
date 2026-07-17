import Link from "next/link";
import { redirect } from "next/navigation";
import { PersistentBlueprintAdminActions } from "@/components/procrow/persistent-blueprint-admin-actions";
import { requireBlueprintPlatformAdmin } from "@/lib/auth/blueprint-engine-guard";
import { getBlueprintAdminDetail } from "@/lib/crow-core/blueprint-engine/blueprint-lifecycle-orchestrator";
import { routes } from "@/lib/routes";

export const dynamic = "force-dynamic";

export default async function AdminPersistentBlueprintReviewPage({
  params,
}: {
  params: Promise<{ blueprintId: string }>;
}) {
  const { blueprintId } = await params;
  await requireBlueprintPlatformAdmin(routes.admin.persistentBlueprintReview(blueprintId));
  const detail = await getBlueprintAdminDetail(blueprintId);
  if (!detail) redirect(routes.admin.blueprints);
  const current = detail.versions.find((v) => v.versionNumber === detail.root.currentVersionNumber);

  return (
    <div className="mx-auto max-w-3xl space-y-4 p-6">
      <h1 className="text-xl font-semibold text-white">Blueprint review workspace</h1>
      <PersistentBlueprintAdminActions
        blueprintId={blueprintId}
        lifecycleState={detail.root.lifecycleState}
        rowVersion={detail.root.rowVersion}
        versionNumber={current?.versionNumber ?? 1}
        contentHash={current?.snapshot.contentHash ?? ""}
      />
      <Link href={routes.admin.persistentBlueprint(blueprintId)} className="text-sm text-cyan-400 underline">
        ← Blueprint detail
      </Link>
    </div>
  );
}
