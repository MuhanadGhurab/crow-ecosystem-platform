import Link from "next/link";
import { redirect } from "next/navigation";
import { PersistentBlueprintAdminActions } from "@/components/procrow/persistent-blueprint-admin-actions";
import { requireBlueprintPlatformAdmin } from "@/lib/auth/blueprint-engine-guard";
import { getBlueprintAdminDetail } from "@/lib/crow-core/blueprint-engine/blueprint-lifecycle-orchestrator";
import { routes } from "@/lib/routes";

export const dynamic = "force-dynamic";

export default async function AdminPersistentBlueprintPage({
  params,
}: {
  params: Promise<{ blueprintId: string }>;
}) {
  const { blueprintId } = await params;
  await requireBlueprintPlatformAdmin(routes.admin.persistentBlueprint(blueprintId));
  const detail = await getBlueprintAdminDetail(blueprintId);
  if (!detail) redirect(routes.admin.blueprints);

  const { root, versions, cycles, actions, traces } = detail;
  const current = versions.find((v) => v.versionNumber === root.currentVersionNumber);

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6 text-slate-200">
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-500">Persistent Blueprint</p>
        <h1 className="text-2xl font-semibold text-white">Blueprint {blueprintId.slice(0, 8)}…</h1>
        <p className="text-sm text-slate-400">
          Lifecycle: <span className="text-cyan-300">{root.lifecycleState}</span> · Visibility:{" "}
          {root.clientVisibility} · Row v{root.rowVersion}
        </p>
      </div>

      {current && (
        <section className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
          <h2 className="text-sm font-medium text-white">Current version {current.versionNumber}</h2>
          <p className="font-mono text-xs text-cyan-300">{current.snapshot.contentHash}</p>
          <Link
            href={routes.admin.persistentBlueprintVersion(blueprintId, current.versionNumber)}
            className="text-sm text-cyan-400 underline"
          >
            View version →
          </Link>
        </section>
      )}

      <PersistentBlueprintAdminActions
        blueprintId={blueprintId}
        lifecycleState={root.lifecycleState}
        rowVersion={root.rowVersion}
        versionNumber={current?.versionNumber ?? 1}
        contentHash={current?.snapshot.contentHash ?? ""}
      />

      <section className="space-y-2">
        <h2 className="text-sm font-medium">Version history</h2>
        <ul className="space-y-1 text-sm">
          {versions.map((v) => (
            <li key={v.id}>
              <Link
                href={routes.admin.persistentBlueprintVersion(blueprintId, v.versionNumber)}
                className="text-cyan-400 underline"
              >
                v{v.versionNumber}
              </Link>{" "}
              <span className="font-mono text-xs text-slate-500">{v.snapshot.contentHash.slice(0, 12)}…</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-medium">Review cycles</h2>
        <pre className="overflow-auto rounded bg-slate-950 p-3 text-xs">{JSON.stringify(cycles, null, 2)}</pre>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-medium">Trace evidence</h2>
        <pre className="overflow-auto rounded bg-slate-950 p-3 text-xs">{JSON.stringify(traces.slice(0, 10), null, 2)}</pre>
      </section>

      <Link href={routes.admin.persistentBlueprintReview(blueprintId)} className="cc-btn-secondary inline-block text-sm">
        Open review workspace →
      </Link>
    </div>
  );
}
