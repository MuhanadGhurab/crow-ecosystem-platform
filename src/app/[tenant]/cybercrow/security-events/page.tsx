import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { routes } from "@/lib/routes";
import { tenantHasLogisticsModule } from "@/lib/services/cybercrow-logistics-audit.service";
import {
  isLogisticsSecurityEvent,
  listTenantSecurityEvents,
} from "@/lib/services/cybercrow-tenant.service";
import { getTenantBySlug } from "@/lib/services/tenant.service";

const SEVERITY_CLASS: Record<string, string> = {
  low: "text-teal-400",
  medium: "text-amber-300",
  high: "text-rose-400",
};

function payloadRecord(payload: unknown): Record<string, unknown> | null {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return null;
  return payload as Record<string, unknown>;
}

export default async function CybercrowSecurityEventsPage({
  params,
  searchParams,
}: {
  params: Promise<{ tenant: string }>;
  searchParams: Promise<{ logistics?: string }>;
}) {
  const { tenant: slug } = await params;
  const { logistics: logisticsParam } = await searchParams;
  const tenant = await getTenantBySlug(slug);
  if (!tenant) notFound();

  const moduleKeys = (tenant.modules ?? []).map((m) => m.moduleKey);
  const logisticsOnly = logisticsParam === "1" && tenantHasLogisticsModule(moduleKeys);
  const events = await listTenantSecurityEvents(tenant.id, {
    limit: 60,
    logisticsOnly,
  });
  const r = routes.tenant(slug).cybercrow;

  return (
    <div className="space-y-8">
      <PageHeader
        badge="CyberCrow"
        entity="cybercrow"
        title="Security events"
        description={
          logisticsOnly
            ? "Logistics-linked detections (route anomaly, dispatch SLA breach)."
            : "Detected events, correlations, and response signals."
        }
      />

      {tenantHasLogisticsModule(moduleKeys) && (
        <nav className="flex flex-wrap gap-2" aria-label="Security event filters">
          <Link
            href={r.securityEvents}
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              !logisticsOnly
                ? "bg-violet-500/25 text-violet-200"
                : "bg-white/5 text-slate-400 hover:text-slate-200"
            }`}
          >
            All events
          </Link>
          <Link
            href={`${r.securityEvents}?logistics=1`}
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              logisticsOnly
                ? "bg-teal-500/20 text-teal-200"
                : "bg-white/5 text-slate-400 hover:text-slate-200"
            }`}
          >
            Logistics only
          </Link>
        </nav>
      )}

      {events.length === 0 ? (
        <EmptyState
          title="No security events"
          description={
            logisticsOnly
              ? "Logistics anomaly and SLA events appear after ops seed or live workflow escalation."
              : "Events are recorded when CyberCrow detects policy or logistics escalations."
          }
        />
      ) : (
        <ul className="space-y-2">
          {events.map((e) => {
            const payload = payloadRecord(e.payload);
            const ref =
              typeof payload?.referenceCode === "string" ? payload.referenceCode : null;
            const workflow =
              typeof payload?.workflowName === "string" ? payload.workflowName : null;
            return (
              <li key={e.id} className="cc-list-item flex-col !items-start gap-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-white">
                    {e.eventType.replace(/_/g, " ").toLowerCase()}
                  </span>
                  {isLogisticsSecurityEvent(e.eventType) && (
                    <span className="rounded-full bg-teal-500/15 px-2 py-0.5 text-[10px] text-teal-300">
                      Logistics
                    </span>
                  )}
                  <span className={`text-xs font-medium ${SEVERITY_CLASS[e.severity] ?? "text-slate-400"}`}>
                    {e.severity}
                  </span>
                </div>
                {(workflow || ref) && (
                  <p className="text-xs text-slate-400">
                    {workflow}
                    {workflow && ref ? " · " : null}
                    {ref ? <span className="font-mono text-cyan-500/90">{ref}</span> : null}
                  </p>
                )}
                <p className="text-xs text-slate-500">
                  {e.createdAt.toLocaleString("en-GB", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              </li>
            );
          })}
        </ul>
      )}

      <Link href={r.dashboard} className="text-sm text-cyan-400 hover:text-cyan-300">
        ← CyberCrow dashboard
      </Link>
    </div>
  );
}
