import type { CemModuleDepthSnapshot } from "@/lib/cem/cem-module-depth-contract";

const STATUS_LABEL: Record<CemModuleDepthSnapshot["status"], string> = {
  not_available: "Not available",
  thin: "Thin / advisory",
  demo_ready: "Demo ready",
  operational_model_ready: "Operational model ready",
  needs_data: "Needs data",
  needs_review: "Needs review",
};

const STATUS_CLASS: Record<CemModuleDepthSnapshot["status"], string> = {
  not_available: "text-slate-500 border-slate-600/50",
  thin: "text-slate-400 border-slate-600/50",
  demo_ready: "text-amber-300 border-amber-500/40",
  operational_model_ready: "text-teal-300 border-teal-500/40",
  needs_data: "text-amber-300 border-amber-500/40",
  needs_review: "text-rose-300 border-rose-500/40",
};

type Props = {
  snapshot: CemModuleDepthSnapshot;
};

export function CemModuleDepthHeader({ snapshot }: Props) {
  const statusClass = STATUS_CLASS[snapshot.status];

  return (
    <section className="cc-glass-card border-violet-500/15 !py-4 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-violet-300">
          Module operational depth
        </h3>
        <span
          className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase ${statusClass}`}
        >
          {STATUS_LABEL[snapshot.status]}
        </span>
      </div>

      <p className="text-sm text-slate-300">{snapshot.purpose}</p>

      <p className="text-xs text-slate-500">
        Staging runtime — derived read-only view. ProCrow Go/No-Go required before F23-gated
        production; not a transactional ERP engine.
      </p>

      {(snapshot.departments.length > 0 || snapshot.roles.length > 0) && (
        <dl className="grid gap-2 text-xs sm:grid-cols-2">
          {snapshot.departments.length > 0 && (
            <div>
              <dt className="text-slate-500">Departments</dt>
              <dd className="text-slate-300">{snapshot.departments.join(" · ")}</dd>
            </div>
          )}
          {snapshot.roles.length > 0 && (
            <div>
              <dt className="text-slate-500">Roles</dt>
              <dd className="text-slate-300">{snapshot.roles.join(" · ")}</dd>
            </div>
          )}
        </dl>
      )}

      {snapshot.blockers.length > 0 && (
        <ul className="list-disc pl-4 text-xs text-rose-300/90 space-y-0.5">
          {snapshot.blockers.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      )}
    </section>
  );
}
