import Link from "next/link";
import { moduleLabel } from "@/lib/catalog-labels";
import { tenantModulePurpose } from "@/lib/constants/tenant-module-purpose";
import { getEnabledErpNavItems } from "@/lib/constants/erp-module-registry";
import { routes } from "@/lib/routes";

type TenantModulesOperationalGridProps = {
  slug: string;
  modules: { id: string; moduleKey: string; enabled?: boolean }[];
  workflowCount: number;
  openTaskCount: number;
};

export function TenantModulesOperationalGrid({
  slug,
  modules,
  workflowCount,
  openTaskCount,
}: TenantModulesOperationalGridProps) {
  const r = routes.tenant(slug);
  const erpNav = getEnabledErpNavItems(slug, modules);
  const erpByCemKey = new Map(erpNav.map((n) => [n.cemModuleKey, n]));

  return (
    <ul className="grid gap-4 lg:grid-cols-2">
      {modules.map((m) => {
        const erp = erpByCemKey.get(m.moduleKey);
        const href = erp?.href ?? r.modules;
        const hasRoute = Boolean(erp);
        const isBi = m.moduleKey === "bi";

        return (
          <li
            key={m.id}
            className="cc-glass-card flex flex-col gap-4 border-cyan-500/10 sm:flex-row sm:items-start sm:justify-between"
          >
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-display text-base font-semibold text-white">
                  {moduleLabel(m.moduleKey)}
                </h3>
                <span className="rounded-full border border-teal-500/25 bg-teal-500/10 px-2 py-0.5 text-xs text-teal-300">
                  Enabled
                </span>
                {!hasRoute && (
                  <span className="rounded-full border border-slate-600/40 bg-slate-800/40 px-2 py-0.5 text-xs text-slate-400">
                    Catalog only
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm text-slate-400">{tenantModulePurpose(m.moduleKey)}</p>
              <p className="mt-3 text-xs text-slate-500">
                {workflowCount} workflow{workflowCount === 1 ? "" : "s"} · {openTaskCount} open task
                {openTaskCount === 1 ? "" : "s"} tenant-wide
              </p>
              {(m.moduleKey === "bi" || m.moduleKey === "approvals") && (
                <p className="mt-2 text-xs text-amber-300/80">
                  Lightweight in this phase — not a full ERP product surface.
                </p>
              )}
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:items-end">
              {hasRoute && (
                <Link href={href} className="cc-btn-secondary text-sm">
                  Open module →
                </Link>
              )}
              {isBi && (
                <Link href={r.reports} className="text-xs text-cyan-400 hover:text-cyan-300">
                  Reports readiness →
                </Link>
              )}
              {m.moduleKey === "iam" && (
                <Link
                  href={r.cybercrow.identity}
                  className="text-xs text-violet-400 hover:text-violet-300"
                >
                  CyberCrow identity →
                </Link>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

/** Advisory note when logistics module appears on non-logistics tenants */
export function TenantModulesAdvisoryNote({
  slug,
  moduleKeys,
}: {
  slug: string;
  moduleKeys: string[];
}) {
  const hasLogistics = moduleKeys.includes("logistics");
  const r = routes.tenant(slug);

  if (!hasLogistics) return null;

  return (
    <p className="rounded-cc border border-teal-500/15 bg-teal-950/20 px-4 py-3 text-xs text-teal-200/90">
      Logistics module is enabled — open the{" "}
      <Link href={r.logistics} className="underline">
        logistics hub
      </Link>{" "}
      for shipment/OCR workflows. Construction tenants typically omit logistics (see Rimal
      validation).
    </p>
  );
}
