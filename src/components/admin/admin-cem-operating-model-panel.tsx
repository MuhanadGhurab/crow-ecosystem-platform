import Link from "next/link";
import type { CemOperatingModelSnapshot } from "@/lib/cem/cem-operating-model-contract";
import { CEM_OPERATING_MODEL_RELATIONSHIP_COPY } from "@/lib/cem/cem-operating-model-contract";
import { routes } from "@/lib/routes";

type Props = {
  snapshot: CemOperatingModelSnapshot;
};

const STATUS_CLASS: Record<string, string> = {
  not_started: "border-slate-600/50 text-slate-300",
  model_detected: "border-cyan-500/30 text-cyan-200",
  partially_connected: "border-amber-500/40 text-amber-200",
  operational_spine_ready: "border-teal-500/40 text-teal-200",
  needs_data: "border-amber-500/40 text-amber-200",
  needs_review: "border-rose-500/40 text-rose-200",
};

export function AdminCemOperatingModelPanel({ snapshot }: Props) {
  const statusClass = STATUS_CLASS[snapshot.status] ?? STATUS_CLASS.model_detected;
  const disconnected = snapshot.moduleRoles.filter(
    (m) => m.enabled && !m.dataBacked && m.readiness !== "demo_limited"
  );

  return (
    <section className="rounded-xl border border-teal-500/25 bg-teal-950/15 p-4 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-teal-100">CEM core operating model</h3>
        <span
          className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${statusClass}`}
        >
          {snapshot.status.replace(/_/g, " ")}
        </span>
      </div>

      <p className="text-xs text-slate-500">{snapshot.disclaimers[1]}</p>
      <p className="text-xs text-slate-400">{CEM_OPERATING_MODEL_RELATIONSHIP_COPY}</p>

      <dl className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <dt className="text-slate-500">Business Portal</dt>
          <dd>
            <Link
              href={snapshot.businessPortalRoute}
              className="text-teal-300 hover:text-teal-200 text-xs"
            >
              {snapshot.businessPortalRoute}
            </Link>
          </dd>
        </div>
        <div>
          <dt className="text-slate-500">Spine</dt>
          <dd className="text-white">
            {snapshot.entities.department ?? 0} / {snapshot.entities.role ?? 0} /{" "}
            {snapshot.entities.user ?? 0}
          </dd>
        </div>
        <div>
          <dt className="text-slate-500">Tasks / workflows</dt>
          <dd className="text-white">
            {snapshot.entities.task ?? 0} / {snapshot.entities.workflow ?? 0}
          </dd>
        </div>
        <div>
          <dt className="text-slate-500">Flows mapped</dt>
          <dd className="text-white">
            {snapshot.flows.filter((f) => f.readiness === "mapped" || f.readiness === "partial").length}
            /{snapshot.flows.length}
          </dd>
        </div>
      </dl>

      <div className="grid gap-3 sm:grid-cols-2 text-xs">
        <div className="rounded-lg border border-white/5 p-3 space-y-2">
          <p className="font-medium text-teal-200">Cross-module flows</p>
          <ul className="space-y-1 text-slate-400">
            {snapshot.flows.map((flow) => (
              <li key={flow.key}>
                {flow.label} — <span className="text-slate-500">{flow.readiness}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border border-white/5 p-3 space-y-2">
          <p className="font-medium text-teal-200">Disconnected / thin modules</p>
          {disconnected.length === 0 ? (
            <p className="text-slate-500">No thin enabled modules detected.</p>
          ) : (
            <ul className="space-y-1 text-slate-400">
              {disconnected.slice(0, 6).map((m) => (
                <li key={m.moduleKey}>
                  {m.moduleLabel} — {m.readiness}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {snapshot.blockers.length > 0 && (
        <p className="text-xs text-rose-300">{snapshot.blockers.join(" ")}</p>
      )}
      {snapshot.recommendedActions.length > 0 && (
        <p className="text-xs text-amber-200">
          ProCrow action: {snapshot.recommendedActions[0]}
        </p>
      )}

      <p className="text-[10px] text-slate-600">
        M3 handoff layer remains separate — this panel shows connected ERP operating model only.
      </p>
    </section>
  );
}
