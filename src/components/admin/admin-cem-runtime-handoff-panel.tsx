import Link from "next/link";
import type { CemRuntimeHandoffSnapshot } from "@/lib/cem/cem-runtime-handoff-contract";
import { CEM_CYBERCROW_SAREA_RELATIONSHIP_COPY } from "@/lib/cem/cem-runtime-handoff-contract";
import { routes } from "@/lib/routes";

type Props = {
  snapshot: CemRuntimeHandoffSnapshot;
};

const STATUS_CLASS: Record<string, string> = {
  not_started: "border-slate-600/50 text-slate-300",
  needs_tenant: "border-slate-600/50 text-slate-300",
  needs_modules: "border-amber-500/40 text-amber-200",
  needs_users_roles: "border-amber-500/40 text-amber-200",
  needs_workflows: "border-amber-500/40 text-amber-200",
  needs_cybercrow: "border-violet-500/40 text-violet-200",
  needs_sarea: "border-rose-500/40 text-rose-200",
  ready_for_staging_handoff: "border-teal-500/40 text-teal-200",
  blocked: "border-rose-500/40 text-rose-200",
};

const AREA_STATUS_CLASS: Record<string, string> = {
  ready: "text-teal-300",
  warning: "text-amber-300",
  thin: "text-slate-400",
  blocked: "text-rose-300",
  not_applicable: "text-slate-600",
};

export function AdminCemRuntimeHandoffPanel({ snapshot }: Props) {
  const statusClass = STATUS_CLASS[snapshot.status] ?? STATUS_CLASS.needs_modules;
  const stagingReady = snapshot.status === "ready_for_staging_handoff";

  return (
    <section className="rounded-xl border border-cyan-500/25 bg-cyan-950/15 p-4 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-cyan-100">CEM runtime handoff</h3>
        <span
          className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${statusClass}`}
        >
          {snapshot.status.replace(/_/g, " ")}
        </span>
      </div>

      <p className="text-xs text-slate-500">{snapshot.disclaimers[0]}</p>
      <p className="text-xs text-slate-400">{CEM_CYBERCROW_SAREA_RELATIONSHIP_COPY}</p>

      <dl className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <dt className="text-slate-500">Business Portal entry</dt>
          <dd>
            <Link
              href={snapshot.businessPortalEntryRoute}
              className="text-cyan-300 hover:text-cyan-200 text-xs"
            >
              {snapshot.businessPortalEntryRoute}
            </Link>
          </dd>
        </div>
        <div>
          <dt className="text-slate-500">Modules</dt>
          <dd className="text-white">{snapshot.moduleCount}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Users / roles</dt>
          <dd className="text-white">
            {snapshot.userCount} / {snapshot.roleCount}
          </dd>
        </div>
        <div>
          <dt className="text-slate-500">Tasks / workflows</dt>
          <dd className="text-white">
            {snapshot.taskCount} / {snapshot.workflowCount}
          </dd>
        </div>
      </dl>

      <div className="grid gap-3 sm:grid-cols-2 text-xs">
        <div className="rounded-lg border border-violet-500/20 p-3">
          <p className="font-medium text-violet-200">CyberCrow dependency</p>
          <p className="mt-1 text-slate-400">{snapshot.cyberCrowDependency.summary}</p>
          <p className="mt-1 text-slate-500">Status: {snapshot.cyberCrowDependency.status}</p>
        </div>
        <div className="rounded-lg border border-rose-500/20 p-3">
          <p className="font-medium text-rose-200">SAREA dependency</p>
          <p className="mt-1 text-slate-400">{snapshot.sareaDependency.summary}</p>
          <p className="mt-1 text-slate-500">Status: {snapshot.sareaDependency.status}</p>
        </div>
      </div>

      <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 text-xs">
        {snapshot.operationalAreas
          .filter((a) => a.status !== "not_applicable")
          .slice(0, 9)
          .map((area) => (
            <li key={area.area} className="flex justify-between gap-2 border-b border-slate-800/60 pb-1">
              <Link href={area.route} className="text-slate-300 hover:text-cyan-300">
                {area.label}
              </Link>
              <span className={AREA_STATUS_CLASS[area.status] ?? "text-slate-500"}>
                {area.status}
              </span>
            </li>
          ))}
      </ul>

      {snapshot.blockers.length > 0 && (
        <ul className="text-sm text-rose-200/90 list-disc list-inside">
          {snapshot.blockers.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      )}

      {snapshot.warnings.length > 0 && !stagingReady && (
        <ul className="text-xs text-amber-200/80 list-disc list-inside">
          {snapshot.warnings.slice(0, 4).map((w) => (
            <li key={w}>{w}</li>
          ))}
        </ul>
      )}

      <p className="text-xs text-slate-400">
        Next: {snapshot.recommendedActions[0] ?? "Open Business Portal dashboard for staging walkthrough"}
      </p>

      <div className="flex flex-wrap gap-3 text-xs">
        <Link href={routes.admin.goNoGo} className="text-cyan-400 hover:text-cyan-300">
          Go / No-Go center →
        </Link>
        <Link href={snapshot.businessPortalEntryRoute} className="text-cyan-400 hover:text-cyan-300">
          Open Business Portal →
        </Link>
      </div>
    </section>
  );
}
