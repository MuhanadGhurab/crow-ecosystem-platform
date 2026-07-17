import { redirect } from "next/navigation";
import { requireBlueprintPlatformAdmin } from "@/lib/auth/blueprint-engine-guard";
import { prismaBlueprintVersionRepository } from "@/lib/crow-core/blueprint-engine/persistence/prisma-version.repository";
import { routes } from "@/lib/routes";

export const dynamic = "force-dynamic";

export default async function AdminPersistentBlueprintVersionPage({
  params,
}: {
  params: Promise<{ blueprintId: string; versionNumber: string }>;
}) {
  const { blueprintId, versionNumber: vn } = await params;
  const versionNumber = Number(vn);
  await requireBlueprintPlatformAdmin(routes.admin.persistentBlueprintVersion(blueprintId, versionNumber));
  const version = await prismaBlueprintVersionRepository.getVersion(blueprintId, versionNumber);
  if (!version) redirect(routes.admin.persistentBlueprint(blueprintId));

  return (
    <div className="mx-auto max-w-5xl space-y-4 p-6 text-slate-200">
      <h1 className="text-xl font-semibold text-white">
        Blueprint version {versionNumber}
      </h1>
      <p className="font-mono text-sm text-cyan-300">{version.snapshot.contentHash}</p>
      <pre className="max-h-[70vh] overflow-auto rounded bg-slate-950 p-4 text-xs">
        {JSON.stringify(version.snapshot.contentJson.executiveSummary, null, 2)}
      </pre>
    </div>
  );
}
