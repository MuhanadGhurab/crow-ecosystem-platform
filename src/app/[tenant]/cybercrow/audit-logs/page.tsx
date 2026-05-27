import Link from "next/link";
import { notFound } from "next/navigation";
import { CybercrowAuditLogList } from "@/components/tenant/cybercrow/cybercrow-audit-log-list";
import { CybercrowOperatorNextActions } from "@/components/tenant/cybercrow/cybercrow-operator-next-actions";
import { CybercrowPageHeader } from "@/components/tenant/cybercrow/cybercrow-page-header";
import { EmptyState } from "@/components/ui/empty-state";
import type { LogisticsAuditFilter } from "@/lib/constants/cybercrow-audit-events";
import { hasErpModule } from "@/lib/constants/erp-module-registry";
import { routes } from "@/lib/routes";
import { tenantHasLogisticsModule } from "@/lib/services/cybercrow-logistics-audit.service";
import { listTenantAuditLogs } from "@/lib/services/cybercrow-tenant.service";
import { getTenantBySlug } from "@/lib/services/tenant.service";

function parseCategory(raw: string | undefined): LogisticsAuditFilter {
  if (raw === "logistics" || raw === "platform") return raw;
  return "all";
}

export default async function CybercrowAuditLogsPage({
  params,
  searchParams,
}: {
  params: Promise<{ tenant: string }>;
  searchParams: Promise<{ category?: string }>;
}) {
  const { tenant: slug } = await params;
  const { category: categoryParam } = await searchParams;
  const tenant = await getTenantBySlug(slug);
  if (!tenant) notFound();

  const moduleKeys = (tenant.modules ?? []).map((m) => m.moduleKey);
  const category = parseCategory(categoryParam);
  const showLogisticsFilter = tenantHasLogisticsModule(moduleKeys);
  const logs = await listTenantAuditLogs(tenant.id, { category, limit: 80 });
  const r = routes.tenant(slug).cybercrow;

  const filterTabs: { key: LogisticsAuditFilter; label: string; href: string }[] = [
    { key: "all", label: "All events", href: r.auditLogs },
  ];
  if (showLogisticsFilter) {
    filterTabs.push(
      { key: "logistics", label: "Logistics ops", href: `${r.auditLogs}?category=logistics` },
      { key: "platform", label: "Platform & policy", href: `${r.auditLogs}?category=platform` }
    );
  }

  return (
    <div className="space-y-8">
      <CybercrowPageHeader tenantSlug={slug} area="audit_logs" title="Audit logs" showScopeNote={false} />

      {filterTabs.length > 1 && (
        <nav className="flex flex-wrap gap-2" aria-label="Audit log filters">
          {filterTabs.map((tab) => (
            <Link
              key={tab.key}
              href={tab.href}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                category === tab.key
                  ? "bg-violet-500/25 text-violet-200"
                  : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200"
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </nav>
      )}

      {logs.length === 0 ? (
        <EmptyState
          title="No audit entries"
          description={
            category === "logistics" && showLogisticsFilter
              ? "Run tenant ops seed or complete a logistics workflow to populate OCR and dispatch audit events."
              : "Activity will appear as users interact with the workspace and CyberCrow baseline initializes."
          }
        />
      ) : (
        <CybercrowAuditLogList logs={logs} />
      )}

      {showLogisticsFilter && hasErpModule(tenant.modules ?? [], "logistics") && (
        <p className="text-xs text-slate-500">
          Logistics events link to workflows and shipment reference codes from the ERP chain.
        </p>
      )}

      <CybercrowOperatorNextActions
        items={[
          {
            action: "document_exception",
            href: r.auditLogs,
            detail: logs.length > 0 ? `${logs.length} entries in view` : "Trace platform actions",
          },
          {
            action: "collect_evidence",
            href: r.evidence,
            detail: "Correlate audit rows with evidence catalog",
          },
          {
            action: "review_event",
            href: r.securityEvents,
            detail: "Pair with security event review",
          },
        ]}
      />

      <Link href={r.dashboard} className="text-sm text-cyan-400 hover:text-cyan-300">
        ← CyberCrow dashboard
      </Link>
    </div>
  );
}
