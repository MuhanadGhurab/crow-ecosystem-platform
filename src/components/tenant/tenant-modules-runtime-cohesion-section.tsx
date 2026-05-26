import Link from "next/link";
import { COHESION_CHAINS } from "@/lib/constants/cross-module-cohesion";
import { routes } from "@/lib/routes";
import type { RuntimeCohesionSnapshot } from "@/lib/services/runtime-cohesion.service";

type Props = {
  slug: string;
  snapshot: RuntimeCohesionSnapshot;
  enabledModuleKeys: string[];
};

export function TenantModulesRuntimeCohesionSection({ slug, snapshot, enabledModuleKeys }: Props) {
  const enabled = new Set(enabledModuleKeys);
  const r = routes.tenant(slug);

  const missingCompanions: string[] = [];
  for (const chain of COHESION_CHAINS) {
    const missing = chain.cemKeysForCoverage.filter((k) => k !== "sarea" && !enabled.has(k));
    if (missing.length > 0 && missing.length < chain.cemKeysForCoverage.length) {
      missingCompanions.push(`${chain.label}: enable ${missing.join(", ")} for full chain.`);
    }
  }

  return (
    <section className="cc-glass-card border-cyan-500/15 !p-6 space-y-4">
      <div>
        <h3 className="text-sm font-medium text-cyan-400">Cross-module runtime cohesion</h3>
        <p className="mt-1 text-xs text-slate-500">
          Dependency chains and handoff readiness — rule-based, operator-guided. Does not change which modules are
          enabled.
        </p>
      </div>
      <p className="text-xs text-slate-400">
        Overall: <span className="font-mono text-cyan-300">{snapshot.overallStatus}</span> · {snapshot.overallDetail}
      </p>
      <div className="grid gap-3 md:grid-cols-2">
        {COHESION_CHAINS.map((chain) => {
          const st = snapshot.chains.find((c) => c.key === chain.key);
          return (
            <div key={chain.key} className="rounded-cc-sm border border-white/10 bg-black/15 p-3 text-xs text-slate-400">
              <p className="font-medium text-slate-200">{chain.label}</p>
              <p className="mt-1 text-[11px]">{chain.purpose}</p>
              <p className="mt-2 text-[10px] text-slate-500">
                Modules: {chain.modulesInvolved.join(" → ")}
              </p>
              {st && (
                <p className="mt-1 text-[10px] text-cyan-300/90">
                  Status: {st.status} · {st.coverageDetail}
                </p>
              )}
            </div>
          );
        })}
      </div>
      {missingCompanions.length > 0 && (
        <div className="rounded-cc-sm border border-amber-500/20 bg-amber-950/10 px-3 py-2 text-[11px] text-amber-100/85">
          <p className="font-medium text-amber-200">Missing companion modules</p>
          <ul className="mt-1 list-inside list-disc">
            {missingCompanions.slice(0, 6).map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </div>
      )}
      {snapshot.handoffGaps.length > 0 && (
        <div className="text-[11px] text-slate-500">
          <p className="font-medium text-slate-400">Handoff gaps</p>
          <ul className="mt-1 list-inside list-disc">
            {snapshot.handoffGaps.slice(0, 5).map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="flex flex-wrap gap-2 pt-1">
        <Link href={r.reports} className="cc-btn-secondary text-xs">
          Reports / BI
        </Link>
        <Link href={r.tasks} className="cc-btn-secondary text-xs">
          Tasks
        </Link>
        <Link href={r.workflows} className="cc-btn-secondary text-xs">
          Workflows
        </Link>
        <Link href={r.cybercrow.dashboard} className="cc-btn-secondary text-xs">
          CyberCrow
        </Link>
        <Link href={routes.sarea.profiles} className="cc-btn-secondary text-xs">
          SAREA studio
        </Link>
      </div>
    </section>
  );
}
