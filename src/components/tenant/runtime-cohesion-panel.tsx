import Link from "next/link";
import { routes } from "@/lib/routes";
import type { RuntimeCohesionSnapshot } from "@/lib/services/runtime-cohesion.service";

const STATUS_CLASS: Record<string, string> = {
  healthy: "border-emerald-500/30 bg-emerald-950/20 text-emerald-200",
  needs_review: "border-amber-500/35 bg-amber-950/25 text-amber-200",
  limited_data: "border-slate-500/30 bg-slate-900/40 text-slate-300",
  not_enabled: "border-slate-600/40 bg-slate-950/40 text-slate-500",
};

type Props = {
  slug: string;
  snapshot: RuntimeCohesionSnapshot;
};

/**
 * Compact cross-module runtime cohesion — rule-based, operator-guided (G10).
 */
export function RuntimeCohesionPanel({ slug, snapshot }: Props) {
  const overallClass = STATUS_CLASS[snapshot.overallStatus] ?? STATUS_CLASS.limited_data;
  const weakChains = snapshot.chains.filter((c) => c.status !== "healthy").slice(0, 3);

  return (
    <section className="cc-glass-card border-cyan-500/15 !p-5" aria-labelledby="runtime-cohesion-heading">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <span className="cc-entity-badge cc-entity-badge--cem text-[10px]">Runtime cohesion</span>
          <h3 id="runtime-cohesion-heading" className="mt-2 text-sm font-semibold text-white">
            Cross-module readiness
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Advisory signals from enabled modules, BI roll-up, tasks, CyberCrow, and SAREA — not autonomous
            orchestration.
          </p>
        </div>
        <div className={`rounded-cc-sm border px-3 py-1.5 text-xs font-medium ${overallClass}`}>
          {snapshot.overallStatus.replace("_", " ")}
        </div>
      </div>
      <p className="mt-3 text-xs text-slate-400">{snapshot.overallDetail}</p>
      <p className="mt-1 text-[11px] text-slate-500">
        BI posture: <span className="text-cyan-300/90">{snapshot.biReadinessLabel}</span>
        {snapshot.cybercrowInitialized ? " · CyberCrow live" : " · CyberCrow pending"}
      </p>

      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {snapshot.chains.map((c) => (
          <div
            key={c.key}
            className="rounded-cc-sm border border-white/10 bg-black/20 px-3 py-2 text-[11px] text-slate-400"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-medium text-slate-200">{c.label}</span>
              <span className={`rounded px-1.5 py-0.5 text-[10px] uppercase ${STATUS_CLASS[c.status] ?? ""}`}>
                {c.status.replace("_", " ")}
              </span>
            </div>
            <p className="mt-1 text-[10px] text-slate-500">{c.coverageDetail}</p>
          </div>
        ))}
      </div>

      {weakChains.length > 0 && (
        <div className="mt-4 rounded-cc-sm border border-amber-500/20 bg-amber-950/10 px-3 py-2">
          <p className="text-[11px] font-medium text-amber-200/90">Weak links (advisory)</p>
          <ul className="mt-1 list-inside list-disc text-[11px] text-amber-100/80">
            {weakChains.map((c) => (
              <li key={c.key}>
                {c.label}: {c.weakHints[0] ?? "Review companion modules and roll-ups."}
              </li>
            ))}
          </ul>
        </div>
      )}

      {snapshot.recommendedNextActions.length > 0 && (
        <div className="mt-3">
          <p className="text-[11px] font-medium text-slate-300">Operator-guided next steps</p>
          <ul className="mt-1 list-inside list-decimal text-[11px] text-slate-400">
            {snapshot.recommendedNextActions.slice(0, 4).map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {snapshot.relatedRoutes.slice(0, 5).map((route) => (
          <Link key={route.href} href={route.href} className="cc-btn-secondary text-xs">
            {route.label}
          </Link>
        ))}
        <Link href={routes.tenant(slug).modules} className="cc-btn-secondary text-xs">
          Module cohesion
        </Link>
      </div>
    </section>
  );
}
