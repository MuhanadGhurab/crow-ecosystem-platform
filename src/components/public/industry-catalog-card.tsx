import type { SectorCatalogEntry } from "@/lib/constants/sector-catalog";

type Props = {
  sector: SectorCatalogEntry;
  moduleLabels: string[];
};

export function IndustryCatalogCard({ sector, moduleLabels }: Props) {
  return (
    <article className={`cc-glass-card cc-engine-card--${sector.entity} flex flex-col`}>
      <div className="flex flex-wrap items-center gap-2">
        <span className={`cc-entity-badge cc-entity-badge--${sector.entity}`}>{sector.badge}</span>
        <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-400">
          Validated operating model
        </span>
      </div>
      <h2 className="mt-3 font-display text-lg font-semibold text-white">{sector.title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-400">{sector.summary}</p>
      <p className="mt-2 text-xs font-medium text-cyan-300/80">{sector.readinessNote}</p>

      <dl className="mt-5 space-y-4 text-sm flex-1">
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Core workflows</dt>
          <dd className="mt-1.5">
            <ul className="space-y-1 text-slate-300">
              {sector.coreWorkflows.map((w) => (
                <li key={w} className="leading-snug">
                  {w}
                </li>
              ))}
            </ul>
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">CEM modules (live catalog)</dt>
          <dd className="mt-1.5 flex flex-wrap gap-1">
            {moduleLabels.map((label) => (
              <span
                key={label}
                className="rounded-md border border-cyan-500/15 bg-cyan-500/5 px-2 py-0.5 text-[11px] text-cyan-100/90"
              >
                {label}
              </span>
            ))}
          </dd>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">CyberCrow focus</dt>
            <dd className="mt-1.5 space-y-1 text-xs text-slate-400">
              {sector.cybercrowFocus.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">SAREA focus</dt>
            <dd className="mt-1.5 space-y-1 text-xs text-slate-400">
              {sector.sareaFocus.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </dd>
          </div>
        </div>
      </dl>

      <p className="mt-4 border-t border-white/[0.06] pt-3 text-xs leading-relaxed text-slate-500">
        {sector.advisoryNote}
      </p>
    </article>
  );
}
