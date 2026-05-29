import Link from "next/link";
import { ProCrowWorkbenchPageHeader } from "@/components/procrow/procrow-workbench-page-header";
import { ProCrowStageSummaryCard } from "@/components/procrow/procrow-stage-summary-card";
import {
  PROCROW_CEM_RUNTIME_MODULES,
  PROCROW_PREPARATION_CONTROLS,
} from "@/lib/constants/procrow-workbench-ia";
import { routes } from "@/lib/routes";

type ProCrowTenantWorkbenchHeaderProps = {
  displayName: string;
  slug: string;
  healthLabel: string;
  enabledModuleCount: number;
  cybercrowInitialized: boolean;
  sareaProfileCount: number;
  requestHref?: string;
};

export function ProCrowTenantWorkbenchHeader({
  displayName,
  slug,
  healthLabel,
  enabledModuleCount,
  cybercrowInitialized,
  sareaProfileCount,
  requestHref,
}: ProCrowTenantWorkbenchHeaderProps) {
  return (
    <div className="space-y-4">
      <ProCrowWorkbenchPageHeader
        eyebrow="ProCrow · Tenant readiness"
        title={displayName}
        purpose="ProCrow supervises this CEM runtime — readiness and discipline, not production launch. CEM runs day-to-day operations."
        statusChip={healthLabel}
        backHref={routes.admin.tenants}
        backLabel="← All tenants"
        actions={
          <Link href={routes.tenant(slug).dashboard} className="cc-btn-primary text-sm">
            Open CEM runtime →
          </Link>
        }
      />
      <p className="font-mono text-sm text-cyan-400">/{slug}</p>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <ProCrowStageSummaryCard label="Modules enabled" value={String(enabledModuleCount)} />
        <ProCrowStageSummaryCard
          label="CyberCrow"
          value={cybercrowInitialized ? "Initialized" : "Needs setup"}
          tone={cybercrowInitialized ? "success" : "attention"}
        />
        <ProCrowStageSummaryCard label="SAREA profiles" value={String(sareaProfileCount)} />
        <ProCrowStageSummaryCard
          label="Go / No-Go"
          value="Advisory"
          hint="Review before demo or deploy"
          tone="muted"
        />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-cyan-500/15 bg-cyan-500/5 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-cyan-400/90">ProCrow prepares</p>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {PROCROW_PREPARATION_CONTROLS.map((c) => (
              <li key={c} className="rounded border border-cyan-500/20 px-2 py-0.5 text-[11px] text-cyan-100/80">
                {c}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border border-slate-700/50 bg-white/[0.02] p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">CEM runtime operates</p>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {PROCROW_CEM_RUNTIME_MODULES.map((m) => (
              <li key={m} className="rounded border border-slate-700/60 px-2 py-0.5 text-[11px] text-slate-400">
                {m}
              </li>
            ))}
          </ul>
        </div>
      </div>
      {requestHref && (
        <Link href={requestHref} className="text-sm text-cyan-400 hover:text-cyan-300">
          Linked implementation request →
        </Link>
      )}
    </div>
  );
}
