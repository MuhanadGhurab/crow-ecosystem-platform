import Link from "next/link";
import {
  REPORTS_BI_CYBERCROW_EVIDENCE,
  REPORTS_BI_CYBERCROW_RISKS,
  REPORTS_BI_REPORT_KPI_SIGNALS,
  REPORTS_BI_SAREA_PERSONAS,
  REPORTS_BI_SECTOR_NOTES,
} from "@/lib/constants/reports-bi-readiness-depth";
import { hasErpModule } from "@/lib/constants/erp-module-registry";
import { routes } from "@/lib/routes";
import type { CemOperationsSnapshot } from "@/lib/cem-operations/types";
import type { ReportsBiReadinessSnapshot } from "@/lib/services/reports-bi-readiness.service";
import { StatCard } from "@/components/ui/stat-card";

function formatSar(amount: number) {
  return new Intl.NumberFormat("en-SA", { maximumFractionDigits: 0 }).format(amount);
}

function rollupStatusBadge(status: string) {
  if (status === "healthy") {
    return (
      <span className="rounded-full border border-teal-500/30 bg-teal-500/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-teal-300">
        Healthy
      </span>
    );
  }
  if (status === "needs_review") {
    return (
      <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-amber-300">
        Needs review
      </span>
    );
  }
  if (status === "limited_data") {
    return (
      <span className="rounded-full border border-slate-600 bg-slate-800/50 px-2 py-0.5 text-[10px] uppercase tracking-wide text-slate-400">
        Limited data
      </span>
    );
  }
  return (
    <span className="rounded-full border border-slate-700 bg-slate-900/50 px-2 py-0.5 text-[10px] uppercase tracking-wide text-slate-500">
      Not enabled
    </span>
  );
}

type ReportsBiOperationsReadinessPanelProps = {
  slug: string;
  organizationName: string;
  tenantModules: { moduleKey: string; enabled?: boolean }[];
  snapshot: ReportsBiReadinessSnapshot;
  cemOps?: CemOperationsSnapshot;
  cybercrowLive: boolean;
};

export function ReportsBiOperationsReadinessPanel({
  slug,
  organizationName,
  tenantModules,
  snapshot,
  cemOps,
  cybercrowLive,
}: ReportsBiOperationsReadinessPanelProps) {
  const r = routes.tenant(slug);
  const sectorNote = snapshot.sectorKey
    ? REPORTS_BI_SECTOR_NOTES.find((n) => n.sector === snapshot.sectorKey)
    : null;

  const routeHref: Record<string, string> = {
    hr: r.hr,
    crm: r.crm,
    finance: r.finance,
    procurement: r.procurement,
    inventory: r.inventory,
    logistics: r.logistics,
    tasks: r.tasks,
    cybercrowRisk: r.cybercrow.risk,
    sareaProfiles: routes.sarea.profiles,
  };

  const readinessAccent =
    snapshot.readinessLevel === "operational"
      ? "teal"
      : snapshot.readinessLevel === "building"
        ? "amber"
        : undefined;

  const kpiCategories = [
    {
      key: "operations",
      title: "Operations & workflows",
      available: snapshot.kpis.activeWorkflows > 0 || snapshot.kpis.openTasks > 0,
      detail: `${snapshot.kpis.activeWorkflows} active workflows · ${snapshot.kpis.openTasks} open tasks`,
      href: r.workflows,
    },
    {
      key: "sales",
      title: "Sales pipeline",
      available: hasErpModule(tenantModules, "sales") && snapshot.kpis.salesCount > 0,
      detail: hasErpModule(tenantModules, "sales")
        ? `${snapshot.kpis.salesCount} rows · ${formatSar(snapshot.kpis.pipelineSar)} SAR pipeline`
        : "Sales module not enabled or not seeded",
      href: r.sales,
    },
    {
      key: "inventory",
      title: "Inventory & stock",
      available: hasErpModule(tenantModules, "inventory") && snapshot.kpis.inventorySkus > 0,
      detail: hasErpModule(tenantModules, "inventory")
        ? `${snapshot.kpis.inventorySkus} SKUs · ${snapshot.kpis.lowStockCount} low stock`
        : "Inventory module not enabled",
      href: r.inventory,
    },
    {
      key: "finance",
      title: "Finance snapshot",
      available: hasErpModule(tenantModules, "finance") && snapshot.kpis.financeEntries > 0,
      detail: hasErpModule(tenantModules, "finance")
        ? `${snapshot.kpis.financeEntries} entries · ${formatSar(snapshot.kpis.openArSar)} SAR open AR`
        : "Finance module not enabled",
      href: r.finance,
    },
    {
      key: "security",
      title: "CyberCrow risk & evidence",
      available: cybercrowLive,
      detail: cybercrowLive
        ? "Posture, incidents, and evidence packs in CyberCrow"
        : "Initialize CyberCrow for security reporting context",
      href: r.cybercrow.risk,
    },
  ];

  const enabledCategoryCount = kpiCategories.filter((c) => c.available).length;

  return (
    <div className="space-y-6">
      <section className="cc-glass-card border-cyan-500/15 p-5">
        <h3 className="font-display text-sm font-semibold text-cyan-300">
          Reports / BI — executive visibility
        </h3>
        <p className="mt-2 text-sm text-slate-400">{snapshot.readinessDetail}</p>
        <p
          className={`mt-2 text-lg font-medium ${
            readinessAccent === "teal"
              ? "text-teal-300"
              : readinessAccent === "amber"
                ? "text-amber-300"
                : "text-slate-300"
          }`}
        >
          {snapshot.readinessLabel}
        </p>
        <p className="mt-2 text-xs text-slate-600">
          Cross-module reporting readiness and advisory roll-ups for {organizationName} —
          operator-reviewed signals only (no warehouse layer, external BI connectors, predictive
          engines, or certified compliance outputs).
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Roll-up domains"
          value={`${snapshot.executiveRollup.filter((x) => x.status !== "not_enabled").length}/${snapshot.executiveRollup.length}`}
          entity="cem"
          accent="cyan"
          hint="Executive categories in scope"
        />
        <StatCard
          label="KPI categories ready"
          value={`${enabledCategoryCount}/${kpiCategories.length}`}
          entity="cem"
          accent="cyan"
          hint="From seeded tenant data"
        />
        <StatCard
          label="Open tasks"
          value={String(snapshot.kpis.openTasks)}
          entity="cem"
          accent="amber"
        />
        <StatCard
          label="Active workflows"
          value={String(snapshot.kpis.activeWorkflows)}
          entity="cem"
          accent="teal"
        />
      </section>

      <section className="cc-glass-card p-5">
        <h3 className="font-display text-sm font-semibold text-cyan-400">Executive roll-up</h3>
        <p className="mt-2 text-sm text-slate-400">
          Rule-based advisory status per domain — not predictive scoring or autonomous analytics.
        </p>
        <ul className="mt-4 space-y-3">
          {snapshot.executiveRollup.map((item) => {
            const href = routeHref[item.routeKey] ?? r.dashboard;
            return (
              <li
                key={item.id}
                className="rounded-cc border border-cyan-500/10 bg-white/[0.02] px-4 py-3"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-white">{item.title}</p>
                      {rollupStatusBadge(item.status)}
                    </div>
                    <p className="mt-1 text-xs text-slate-500">{item.explanation}</p>
                    <p className="mt-2 text-xs text-cyan-400/80">Next: {item.nextAction}</p>
                  </div>
                  {item.status !== "not_enabled" && (
                    <Link href={href} className="shrink-0 text-xs text-cyan-400 hover:text-cyan-300">
                      Open hub →
                    </Link>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="cc-glass-card">
        <h3 className="font-display text-sm font-semibold text-cyan-400">Cross-module KPI signals</h3>
        <p className="mt-2 text-sm text-slate-400">
          Categories reflect data that exists today — no fabricated charts, trends, or revenue
          forecasts.
        </p>
        <ul className="mt-6 space-y-3">
          {kpiCategories.map((cat) => (
            <li
              key={cat.key}
              className="flex flex-wrap items-center justify-between gap-4 rounded-cc border border-cyan-500/10 bg-white/[0.02] px-4 py-3"
            >
              <div>
                <p className="font-medium text-white">{cat.title}</p>
                <p className="mt-1 text-xs text-slate-500">{cat.detail}</p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    cat.available
                      ? "bg-teal-500/15 text-teal-300"
                      : "bg-slate-700/40 text-slate-400"
                  }`}
                >
                  {cat.available ? "Data available" : "Not enabled yet"}
                </span>
                <Link href={cat.href} className="text-xs text-cyan-400 hover:text-cyan-300">
                  Open →
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {cemOps && (
        <section className="cc-glass-card border-cyan-500/10 p-5">
          <h3 className="font-display text-sm font-semibold text-cyan-400">
            Task & workflow readiness
          </h3>
          <p className="mt-2 text-sm text-slate-400">
            {snapshot.cemOpsReadinessDetail} — {snapshot.cemOpsReadinessLabel}
          </p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 text-sm">
            <li className="rounded-cc border border-white/5 px-3 py-2">
              <span className="text-slate-500">Workflow coverage</span>
              <p className="text-white">
                {cemOps.workflowsWithTasks}/{cemOps.workflowCount} with tasks
              </p>
            </li>
            <li className="rounded-cc border border-white/5 px-3 py-2">
              <span className="text-slate-500">Open tasks</span>
              <p className="text-white">
                {cemOps.openTaskCount} open · {cemOps.unassignedTaskCount} unassigned
              </p>
            </li>
          </ul>
          <div className="mt-4 flex flex-wrap gap-3 text-xs">
            <Link href={r.tasks} className="text-cyan-400 hover:text-cyan-300">
              Tasks →
            </Link>
            <Link href={r.workflows} className="text-cyan-400 hover:text-cyan-300">
              Workflows →
            </Link>
          </div>
        </section>
      )}

      <section className="cc-glass-card border-violet-500/15 p-5">
        <h3 className="text-sm font-medium text-violet-300">CyberCrow reporting posture</h3>
        <p className="mt-2 text-sm text-slate-400">{snapshot.cybercrowSummary}</p>
        <ul className="mt-3 list-inside list-disc text-xs text-slate-500">
          {REPORTS_BI_CYBERCROW_RISKS.slice(0, 3).map((risk) => (
            <li key={risk}>{risk}</li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-slate-600">
          Evidence examples (advisory): {REPORTS_BI_CYBERCROW_EVIDENCE.slice(0, 2).join(" · ")}
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href={r.cybercrow.evidence} className="cc-btn-secondary text-sm">
            Evidence packs
          </Link>
          <Link href={r.cybercrow.grc} className="cc-btn-secondary text-sm">
            GRC readiness
          </Link>
          <Link href={r.cybercrow.risk} className="text-sm text-violet-400 hover:text-violet-300">
            Risk register →
          </Link>
        </div>
      </section>

      <section className="cc-glass-card border-rose-500/15 p-5">
        <h3 className="text-sm font-medium text-rose-300">SAREA experience posture</h3>
        <p className="mt-2 text-sm text-slate-400">
          RBAC controls access; SAREA controls experience.{" "}
          {snapshot.sareaBackedPersonas}/{snapshot.sareaTotalPersonas} tenant-backed personas ·
          advisory: {snapshot.sareaAdvisory.replace(/_/g, " ")}.
        </p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {REPORTS_BI_SAREA_PERSONAS.slice(0, 4).map((p) => (
            <li
              key={p.personaKey}
              className="rounded-full border border-rose-500/20 bg-rose-500/5 px-2 py-1 text-[10px] text-rose-200/90"
              title={p.hint}
            >
              {p.label}
            </li>
          ))}
        </ul>
        {snapshot.sareaNextActions.length > 0 && (
          <ul className="mt-3 list-inside list-disc text-xs text-slate-500">
            {snapshot.sareaNextActions.slice(0, 3).map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        )}
        <Link
          href={routes.sarea.roleMapping}
          className="mt-4 inline-block text-sm text-rose-400 hover:text-rose-300"
        >
          Role mapping →
        </Link>
      </section>

      <section className="cc-glass-card p-5">
        <h3 className="font-display text-sm font-semibold text-slate-300">
          Recommended report workflows
        </h3>
        <p className="mt-2 text-xs text-slate-500">
          Advisory cadence — not scheduled automation or external BI delivery.
        </p>
        <ul className="mt-4 space-y-2">
          {snapshot.reportWorkflowReadiness.map((w) => (
            <li key={w.id} className="text-sm text-slate-400">
              <span className="text-slate-300">{w.label}</span> — {w.description}
            </li>
          ))}
        </ul>
      </section>

      {sectorNote && (
        <section className="cc-glass-card border-white/5 p-4">
          <h3 className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Sector relevance ({sectorNote.sector})
          </h3>
          <p className="mt-2 text-sm text-slate-400">{sectorNote.emphasis}</p>
        </section>
      )}

      <section className="cc-glass-card border-teal-500/10 p-5">
        <h3 className="text-sm font-medium text-teal-300">Report KPI signals (advisory)</h3>
        <ul className="mt-3 list-inside list-disc text-xs text-slate-500">
          {REPORTS_BI_REPORT_KPI_SIGNALS.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </section>

      {snapshot.recommendedActions.length > 0 && (
        <section className="cc-glass-card border-amber-500/10 p-5">
          <h3 className="text-sm font-medium text-amber-300">Next recommended actions</h3>
          <ul className="mt-3 list-inside list-disc text-sm text-slate-400">
            {snapshot.recommendedActions.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </section>
      )}

      <p className="text-xs text-slate-500">
        Advanced BI exports, centralized analytics pipelines, and scheduled report delivery remain
        future-only until production analytics infrastructure is approved.
      </p>
    </div>
  );
}
