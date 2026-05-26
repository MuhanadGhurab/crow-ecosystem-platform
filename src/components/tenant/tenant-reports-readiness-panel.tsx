import Link from "next/link";
import { StatCard } from "@/components/ui/stat-card";
import { hasErpModule } from "@/lib/constants/erp-module-registry";
import { routes } from "@/lib/routes";
import type { CemOperationsSnapshot } from "@/lib/cem-operations/types";
import type { ReportsKpiSummary } from "@/lib/services/reports.service";

function formatSar(amount: number) {
  return new Intl.NumberFormat("en-SA", { maximumFractionDigits: 0 }).format(amount);
}

type TenantReportsReadinessPanelProps = {
  slug: string;
  organizationName: string;
  tenantModules: { moduleKey: string; enabled?: boolean }[];
  kpis: ReportsKpiSummary;
  cybercrowInitialized: boolean;
  cemOps?: CemOperationsSnapshot;
};

export function TenantReportsReadinessPanel({
  slug,
  organizationName,
  tenantModules,
  kpis,
  cybercrowInitialized,
  cemOps,
}: TenantReportsReadinessPanelProps) {
  const r = routes.tenant(slug);
  const moduleKeys = tenantModules.filter((m) => m.enabled !== false).map((m) => m.moduleKey);

  const categories = [
    {
      key: "operations",
      title: "Operations & workflows",
      available: kpis.activeWorkflows > 0 || kpis.openTasks > 0,
      detail: `${kpis.activeWorkflows} active workflows · ${kpis.openTasks} open tasks`,
      href: r.workflows,
    },
    {
      key: "sales",
      title: "Sales pipeline",
      available: hasErpModule(tenantModules, "sales") && kpis.salesCount > 0,
      detail: hasErpModule(tenantModules, "sales")
        ? `${kpis.salesCount} rows · ${formatSar(kpis.pipelineSar)} SAR pipeline`
        : "Sales module not enabled or not seeded",
      href: r.sales,
    },
    {
      key: "inventory",
      title: "Inventory & stock",
      available: hasErpModule(tenantModules, "inventory") && kpis.inventorySkus > 0,
      detail: hasErpModule(tenantModules, "inventory")
        ? `${kpis.inventorySkus} SKUs · ${kpis.lowStockCount} low stock`
        : "Inventory module not enabled",
      href: r.inventory,
    },
    {
      key: "finance",
      title: "Finance snapshot",
      available: hasErpModule(tenantModules, "finance") && kpis.financeEntries > 0,
      detail: hasErpModule(tenantModules, "finance")
        ? `${kpis.financeEntries} entries · ${formatSar(kpis.openArSar)} SAR open AR`
        : "Finance module not enabled",
      href: r.finance,
    },
    {
      key: "security",
      title: "CyberCrow risk & evidence",
      available: cybercrowInitialized,
      detail: cybercrowInitialized
        ? "Posture, incidents, and evidence packs in CyberCrow"
        : "Initialize CyberCrow for security reporting context",
      href: r.cybercrow.risk,
    },
  ];

  const enabledCount = categories.filter((c) => c.available).length;

  return (
    <div className="space-y-8">
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Report categories ready"
          value={`${enabledCount}/${categories.length}`}
          entity="cem"
          accent="cyan"
          hint="Based on seeded tenant data"
        />
        <StatCard
          label="Open tasks"
          value={String(kpis.openTasks)}
          entity="cem"
          accent="amber"
          hint="Operational backlog"
        />
        <StatCard
          label="Active workflows"
          value={String(kpis.activeWorkflows)}
          entity="cem"
          accent="teal"
        />
        <StatCard
          label="Modules enabled"
          value={String(moduleKeys.length)}
          entity="cem"
          accent="cyan"
          hint={organizationName}
        />
      </section>

      <section className="cc-glass-card">
        <h3 className="font-display text-sm font-semibold text-cyan-400">
          Operational reporting readiness
        </h3>
        <p className="mt-2 text-sm text-slate-400">
          Categories reflect data that exists today — no fabricated charts or analytics engine.
        </p>
        <ul className="mt-6 space-y-3">
          {categories.map((cat) => (
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
        <section className="cc-glass-card border-cyan-500/10">
          <h3 className="font-display text-sm font-semibold text-cyan-400">
            CEM operations readiness
          </h3>
          <p className="mt-2 text-sm text-slate-400">
            Coverage from live tenant data — {cemOps.readinessDetail}
          </p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 text-sm">
            <li className="rounded-cc border border-white/5 px-3 py-2">
              <span className="text-slate-500">Workflow coverage</span>
              <p className="text-white">
                {cemOps.workflowsWithTasks}/{cemOps.workflowCount} with tasks
                {cemOps.workflowsWithoutTasks > 0 && (
                  <span className="text-amber-400"> · {cemOps.workflowsWithoutTasks} need tasks</span>
                )}
              </p>
            </li>
            <li className="rounded-cc border border-white/5 px-3 py-2">
              <span className="text-slate-500">Task distribution</span>
              <p className="text-white">
                {cemOps.openTaskCount} open · {cemOps.unassignedTaskCount} unassigned ·{" "}
                {cemOps.tasksWithoutWorkflow} without workflow
              </p>
            </li>
            <li className="rounded-cc border border-white/5 px-3 py-2">
              <span className="text-slate-500">Department coverage</span>
              <p className="text-white">
                {cemOps.departmentsWithProfiles}/{cemOps.departmentCount} with profiles
              </p>
            </li>
            <li className="rounded-cc border border-white/5 px-3 py-2">
              <span className="text-slate-500">Role mapping</span>
              <p className="text-white">
                {cemOps.rolesWithAssignments}/{cemOps.roleCount} with user assignments
              </p>
            </li>
          </ul>
          <div className="mt-4 flex flex-wrap gap-3 text-xs">
            <Link href={r.workflows} className="text-cyan-400 hover:text-cyan-300">
              Workflows →
            </Link>
            <Link href={r.departments} className="text-cyan-400 hover:text-cyan-300">
              Structure →
            </Link>
            <Link href={routes.sarea.profiles} className="text-rose-400 hover:text-rose-300">
              SAREA profiles →
            </Link>
          </div>
        </section>
      )}

      <section className="cc-glass-card border-violet-500/15">
        <h3 className="text-sm font-medium text-violet-300">Security & GRC reporting</h3>
        <p className="mt-2 text-sm text-slate-400">
          Executive security narratives live in CyberCrow — evidence and GRC packs are advisory
          readiness surfaces, not certified compliance claims.
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

      <p className="text-xs text-slate-500">
        Advanced BI exports and scheduled report delivery are deferred until a client budget
        approves production analytics infrastructure.
      </p>
    </div>
  );
}
