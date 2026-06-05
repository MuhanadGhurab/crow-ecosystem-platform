import Link from "next/link";
import type { CemOperatingModelSnapshot } from "@/lib/cem/cem-operating-model-contract";
import { CEM_OPERATING_MODEL_RELATIONSHIP_COPY } from "@/lib/cem/cem-operating-model-contract";
import { routes } from "@/lib/routes";

type Props = {
  slug: string;
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

const FLOW_READINESS_CLASS: Record<string, string> = {
  mapped: "text-teal-300",
  partial: "text-amber-300",
  advisory: "text-slate-400",
  missing_data: "text-slate-500",
};

export function TenantCemOperatingModelPanel({ slug, snapshot }: Props) {
  const r = routes.tenant(slug);
  const statusClass = STATUS_CLASS[snapshot.status] ?? STATUS_CLASS.model_detected;

  return (
    <section className="rounded-xl border border-cyan-500/20 bg-cyan-950/10 p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-cyan-100">CEM operating model</h3>
        <span
          className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${statusClass}`}
        >
          {snapshot.status.replace(/_/g, " ")}
        </span>
      </div>

      <p className="text-xs text-slate-500">{snapshot.disclaimers[0]}</p>
      <p className="text-xs text-slate-400">{CEM_OPERATING_MODEL_RELATIONSHIP_COPY}</p>

      <dl className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <dt className="text-slate-500">Active modules</dt>
          <dd className="text-white">{snapshot.entities.module ?? 0}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Org spine</dt>
          <dd className="text-white">
            {snapshot.entities.department ?? 0} depts · {snapshot.entities.role ?? 0} roles ·{" "}
            {snapshot.entities.user ?? 0} users
          </dd>
        </div>
        <div>
          <dt className="text-slate-500">Coordination</dt>
          <dd className="text-white">
            {snapshot.entities.task ?? 0} tasks · {snapshot.entities.workflow ?? 0} workflows
          </dd>
        </div>
        <div>
          <dt className="text-slate-500">Reports</dt>
          <dd className="text-white">{snapshot.reportOutputs.length} outputs</dd>
        </div>
      </dl>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-white/5 p-3 text-xs space-y-2">
          <p className="font-medium text-cyan-200">Cross-module flows</p>
          <ul className="space-y-1.5 text-slate-400">
            {snapshot.flows.slice(0, 5).map((flow) => (
              <li key={flow.key} className="flex justify-between gap-2">
                <span>{flow.label}</span>
                <span className={FLOW_READINESS_CLASS[flow.readiness] ?? "text-slate-500"}>
                  {flow.readiness}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border border-white/5 p-3 text-xs space-y-2">
          <p className="font-medium text-cyan-200">Operational links</p>
          <ul className="space-y-1 text-slate-400">
            {snapshot.links
              .filter((l) => l.strength !== "missing")
              .slice(0, 4)
              .map((link, i) => (
                <li key={`${link.fromId}-${i}`}>
                  {link.fromLabel} → {link.toLabel} ({link.strength})
                </li>
              ))}
            {snapshot.links.filter((l) => l.strength === "missing").length > 0 && (
              <li className="text-amber-300/80">
                {snapshot.links.filter((l) => l.strength === "missing").length} missing link(s) —
                advisory
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 text-xs">
        <Link href={r.tasks} className="text-cyan-400 hover:text-cyan-300">
          Tasks →
        </Link>
        <Link href={r.workflows} className="text-cyan-400 hover:text-cyan-300">
          Workflows →
        </Link>
        <Link href={r.reports} className="text-cyan-400 hover:text-cyan-300">
          Reports →
        </Link>
        <Link href={r.cybercrow.dashboard} className="text-violet-400 hover:text-violet-300">
          CyberCrow trust →
        </Link>
      </div>

      {snapshot.warnings.length > 0 && (
        <p className="text-xs text-amber-200/90">{snapshot.warnings[0]}</p>
      )}
    </section>
  );
}
