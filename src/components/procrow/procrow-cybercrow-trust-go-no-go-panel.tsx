import type { CyberCrowTrustGoNoGoDependency } from "@/lib/services/cybercrow-tenant-trust.service";

type Props = {
  dependency: CyberCrowTrustGoNoGoDependency;
};

const STATUS_STYLE: Record<CyberCrowTrustGoNoGoDependency["status"], string> = {
  ready: "border-teal-500/30 text-teal-200",
  warning: "border-amber-500/30 text-amber-200",
  blocked: "border-rose-500/30 text-rose-200",
};

export function ProCrowCybercrowTrustGoNoGoPanel({ dependency }: Props) {
  return (
    <section className="cc-glass-card cc-entity-block--cybercrow !p-5 space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-violet-300">
          CyberCrow tenant trust (Go/No-Go dependency)
        </h2>
        <span
          className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase ${STATUS_STYLE[dependency.status]}`}
        >
          {dependency.status}
        </span>
      </div>
      <p className="text-sm text-white">{dependency.label}</p>
      <p className="text-xs text-slate-400">{dependency.advisoryNote}</p>
      <p className="text-xs text-slate-600">
        Verify with <code className="text-violet-400">npm run cybercrow-trust:verify</code> after
        CyberCrow M1 changes. Per-tenant detail: ProCrow tenant workbench → CyberCrow tab.
      </p>
    </section>
  );
}
