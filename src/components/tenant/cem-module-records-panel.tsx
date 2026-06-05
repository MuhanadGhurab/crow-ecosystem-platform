import type { CemModuleOperationalRecord } from "@/lib/cem/cem-module-depth-contract";

const SOURCE_LABEL: Record<CemModuleOperationalRecord["source"], string> = {
  tenant_backed: "Tenant-backed",
  mock: "Demo mock",
  inferred: "Inferred",
  advisory: "Advisory",
};

const SOURCE_CLASS: Record<CemModuleOperationalRecord["source"], string> = {
  tenant_backed: "text-teal-300",
  mock: "text-amber-300",
  inferred: "text-slate-400",
  advisory: "text-slate-400",
};

type Props = {
  records: CemModuleOperationalRecord[];
  moduleLabel: string;
};

export function CemModuleRecordsPanel({ records, moduleLabel }: Props) {
  return (
    <section className="cc-glass-card border-cyan-500/10 !py-4 space-y-3">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-cyan-300">
        Operational records
      </h3>
      <p className="text-xs text-slate-500">
        Sample entities for {moduleLabel} — tenant-backed where data exists; otherwise advisory
        staging signals.
      </p>

      {records.length === 0 ? (
        <p className="text-xs text-slate-500">No records yet — add tenant data or use demo seed.</p>
      ) : (
        <ul className="space-y-2">
          {records.map((r) => (
            <li
              key={r.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-700/40 bg-slate-900/30 px-3 py-2 text-xs"
            >
              <div>
                <span className="font-medium text-white">{r.label}</span>
                <span className="ml-2 text-slate-500">{r.type.replace(/_/g, " ")}</span>
                {r.department && (
                  <span className="ml-2 text-slate-500">· {r.department}</span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-slate-400">{r.status}</span>
                <span className={`text-[10px] font-medium ${SOURCE_CLASS[r.source]}`}>
                  {SOURCE_LABEL[r.source]}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
