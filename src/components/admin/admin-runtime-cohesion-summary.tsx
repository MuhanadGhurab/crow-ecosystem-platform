import Link from "next/link";
import { routes } from "@/lib/routes";
import { summarizeRuntimeCohesionForAdmin } from "@/lib/services/runtime-cohesion.service";
import type { RuntimeCohesionSnapshot } from "@/lib/services/runtime-cohesion.service";

type Props = {
  tenantSlug: string;
  snapshot: RuntimeCohesionSnapshot;
};

/**
 * Platform operator view — tenant health snapshot, no data mutation.
 */
export function AdminRuntimeCohesionSummary({ tenantSlug, snapshot }: Props) {
  const summary = summarizeRuntimeCohesionForAdmin(snapshot);
  const r = routes.tenant(tenantSlug);

  return (
    <section className="cc-glass-card border-violet-500/20 !p-5 space-y-3">
      <h3 className="text-sm font-medium text-violet-300">Runtime cohesion (operator)</h3>
      <p className="text-xs text-slate-400">{summary.headline}</p>
      <p className="text-[11px] text-slate-500">{snapshot.overallDetail}</p>
      {summary.weakChains.length > 0 ? (
        <div>
          <p className="text-[11px] font-medium text-amber-200/90">Chains needing attention</p>
          <ul className="mt-1 list-inside list-disc text-[11px] text-slate-400">
            {summary.weakChains.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-[11px] text-emerald-200/80">All cohesion chains in the healthy advisory band.</p>
      )}
      {snapshot.evidenceReadinessGaps.length > 0 && (
        <div>
          <p className="text-[11px] font-medium text-slate-300">CyberCrow / evidence hints</p>
          <ul className="mt-1 list-inside list-disc text-[11px] text-slate-500">
            {snapshot.evidenceReadinessGaps.map((g) => (
              <li key={g}>{g}</li>
            ))}
          </ul>
        </div>
      )}
      {snapshot.sareaCoverageGaps.length > 0 && (
        <div>
          <p className="text-[11px] font-medium text-slate-300">SAREA hints</p>
          <ul className="mt-1 list-inside list-disc text-[11px] text-slate-500">
            {snapshot.sareaCoverageGaps.map((g) => (
              <li key={g}>{g}</li>
            ))}
          </ul>
        </div>
      )}
      <div>
        <p className="text-[11px] font-medium text-slate-300">Suggested operator actions</p>
        <ol className="mt-1 list-inside list-decimal text-[11px] text-slate-400">
          {summary.actions.map((a, i) => (
            <li key={i}>{a}</li>
          ))}
        </ol>
      </div>
      <div className="flex flex-wrap gap-2 pt-1">
        <Link href={r.dashboard} className="cc-btn-secondary text-xs">
          Tenant dashboard
        </Link>
        <Link href={r.modules} className="cc-btn-secondary text-xs">
          Modules
        </Link>
        <Link href={r.reports} className="cc-btn-secondary text-xs">
          Reports / BI
        </Link>
      </div>
    </section>
  );
}
