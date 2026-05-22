import { AuditorReadOnlyBanner } from "@/components/tenant/cybercrow/auditor-readonly-banner";
import { ModuleSubNav } from "@/components/ui/module-subnav";
import { isAuditorReadOnly } from "@/lib/auth/auditor-nav";
import { getCrowAuth } from "@/lib/auth/roles";
import { requireTenantAccess } from "@/lib/auth/session";
import { routes } from "@/lib/routes";
import { tenantHasLogisticsModule } from "@/lib/services/cybercrow-logistics-audit.service";
import { getTenantBySlug } from "@/lib/services/tenant.service";

export default async function CybercrowLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ tenant: string }>;
}) {
  const { tenant } = await params;
  const user = await requireTenantAccess(tenant);
  const { role } = getCrowAuth(user);
  const auditorView = isAuditorReadOnly(role);
  const r = routes.tenant(tenant).cybercrow;
  const tenantRecord = await getTenantBySlug(tenant);
  const moduleKeys = (tenantRecord?.modules ?? []).map((m) => m.moduleKey);
  const platformAuditHref = tenantHasLogisticsModule(moduleKeys)
    ? `/admin/audit?category=logistics&tenant=${tenant}`
    : "/admin/audit";

  const nav = [
    { href: r.dashboard, label: "Dashboard" },
    { href: r.auditLogs, label: "Audit logs" },
    { href: r.securityEvents, label: "Security events" },
    { href: r.risk, label: "Risk" },
    { href: r.incidents, label: "Incidents" },
    { href: r.compliance, label: "Compliance" },
    { href: r.identity, label: "Identity" },
    { href: r.sessions, label: "Sessions" },
    { href: r.grc, label: "GRC" },
    { href: r.evidence, label: "Evidence" },
  ];

  return (
    <div className="cc-entity-cybercrow">
      <ModuleSubNav
        variant="cybercrow"
        title="CyberCrow — Enterprise Security"
        subtitle="Audit · risk · compliance · identity · NCA-aligned baseline"
        items={nav}
      />
      {auditorView && (
        <AuditorReadOnlyBanner slug={tenant} platformAuditHref={platformAuditHref} />
      )}
      {children}
    </div>
  );
}
