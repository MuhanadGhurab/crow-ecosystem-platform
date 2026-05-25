import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { CybercrowSocPhilosophyBanner } from "@/components/tenant/cybercrow/cybercrow-soc-philosophy-banner";
import { IncidentWorkflowPanel } from "@/components/tenant/cybercrow/incident-workflow-panel";
import { canManageCybercrowIncidents } from "@/lib/auth/cybercrow-access";
import { incidentStatusLabel } from "@/lib/constants/cybercrow-incident-status";
import { routes } from "@/lib/routes";
import { listIncidentsEnriched } from "@/lib/services/cybercrow-soc-workflow.service";
import { getTenantBySlug } from "@/lib/services/tenant.service";

export default async function CybercrowIncidentsPage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: slug } = await params;
  const tenant = await getTenantBySlug(slug);
  if (!tenant) notFound();
  const [rows, canManage] = await Promise.all([
    listIncidentsEnriched(tenant.id),
    canManageCybercrowIncidents(slug),
  ]);
  const r = routes.tenant(slug).cybercrow;

  return (
    <div className="space-y-8">
      <PageHeader
        badge="CyberCrow"
        entity="cybercrow"
        title="Incidents"
        description="Security incidents with acknowledge, review, resolve, and reopen — each change is audit-logged."
      />

      <CybercrowSocPhilosophyBanner compact />

      <section className="rounded-lg border border-violet-500/15 bg-violet-950/15 px-4 py-3 text-xs text-slate-400">
        {canManage
          ? "Status changes require cybercrow.incidents.manage. Incidents are never deleted — only status updates."
          : "Read-only for your role. Analysts with incident manage permission can update workflow status."}
      </section>

      {rows.length === 0 ? (
        <EmptyState
          title="No incidents"
          description="Baseline posture is healthy — incidents appear when events are escalated or raised manually."
        />
      ) : (
        <ul className="space-y-3">
          {rows.map((row) => (
            <li key={row.incident.id} className="cc-glass-card">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <span className="font-medium text-white">{row.incident.title}</span>
                <span className="text-slate-500">
                  {row.incident.severity} · {incidentStatusLabel(row.incident.status)} ·{" "}
                  {row.incident.createdAt.toLocaleString("en-GB", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </span>
              </div>
              <IncidentWorkflowPanel tenantSlug={slug} row={row} canManage={canManage} />
            </li>
          ))}
        </ul>
      )}
      <Link href={r.dashboard} className="text-sm text-cyan-400 hover:text-cyan-300">
        ← CyberCrow dashboard
      </Link>
    </div>
  );
}
