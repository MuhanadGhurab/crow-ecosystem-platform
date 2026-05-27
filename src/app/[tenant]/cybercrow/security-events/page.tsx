import Link from "next/link";
import { notFound } from "next/navigation";
import { CybercrowOperatorNextActions } from "@/components/tenant/cybercrow/cybercrow-operator-next-actions";
import { CybercrowPageHeader } from "@/components/tenant/cybercrow/cybercrow-page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { CybercrowSocPhilosophyBanner } from "@/components/tenant/cybercrow/cybercrow-soc-philosophy-banner";
import { CybercrowEventEvidenceHints } from "@/components/tenant/cybercrow/cybercrow-event-evidence-hints";
import { SecurityEventReviewActions } from "@/components/tenant/cybercrow/security-event-review-actions";
import { canManageCybercrowIncidents } from "@/lib/auth/cybercrow-access";
import { routes } from "@/lib/routes";
import { tenantHasLogisticsModule } from "@/lib/services/cybercrow-logistics-audit.service";
import type { SecurityEventReviewStatus } from "@/lib/services/cybercrow-mutations.service";
import { getEventEvidenceContext } from "@/lib/services/cybercrow-evidence-grc.service";
import { listSecurityEventsEnriched } from "@/lib/services/cybercrow-soc-workflow.service";
import { isLogisticsSecurityEvent } from "@/lib/services/cybercrow-tenant.service";
import { getTenantBySlug } from "@/lib/services/tenant.service";

const SEVERITY_CLASS: Record<string, string> = {
  low: "text-teal-400",
  medium: "text-amber-300",
  high: "text-rose-400",
  info: "text-cyan-400",
};

const REVIEW_FILTERS: { key: SecurityEventReviewStatus | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending review" },
  { key: "reviewed", label: "Reviewed" },
  { key: "dismissed", label: "Dismissed" },
  { key: "escalated", label: "Escalated" },
];

function parseReviewFilter(raw: string | undefined): SecurityEventReviewStatus | "all" {
  if (raw === "pending" || raw === "reviewed" || raw === "dismissed" || raw === "escalated") {
    return raw;
  }
  return "all";
}

export default async function CybercrowSecurityEventsPage({
  params,
  searchParams,
}: {
  params: Promise<{ tenant: string }>;
  searchParams: Promise<{ logistics?: string; review?: string }>;
}) {
  const { tenant: slug } = await params;
  const { logistics: logisticsParam, review: reviewParam } = await searchParams;
  const tenant = await getTenantBySlug(slug);
  if (!tenant) notFound();

  const moduleKeys = (tenant.modules ?? []).map((m) => m.moduleKey);
  const logisticsOnly = logisticsParam === "1" && tenantHasLogisticsModule(moduleKeys);
  const reviewFilter = parseReviewFilter(reviewParam);

  const [rows, canManage] = await Promise.all([
    listSecurityEventsEnriched(tenant.id, {
      limit: 60,
      logisticsOnly,
      reviewFilter,
    }),
    canManageCybercrowIncidents(slug),
  ]);
  const r = routes.tenant(slug).cybercrow;

  return (
    <div className="space-y-8">
      <CybercrowPageHeader
        tenantSlug={slug}
        area="security_events"
        title="Security events"
        description={
          logisticsOnly
            ? "Logistics-linked observed activity (route anomaly, dispatch SLA breach)."
            : "Observed security activity with review, dismiss (informational), and escalation to incidents."
        }
        showScopeNote={false}
      />

      <CybercrowSocPhilosophyBanner compact showSareaNote />

      <section className="rounded-lg border border-violet-500/15 bg-violet-950/15 px-4 py-3 text-xs text-slate-400">
        {canManage
          ? "Review state is stored in event payload — events are not deleted. Escalation creates an incident and links it; duplicate escalation is blocked."
          : "Read-only catalog. Review and escalation require cybercrow.incidents.manage permission."}
      </section>

      <nav className="flex flex-wrap gap-2" aria-label="Review filters">
        {REVIEW_FILTERS.map((f) => {
          const params = new URLSearchParams();
          if (logisticsOnly) params.set("logistics", "1");
          if (f.key !== "all") params.set("review", f.key);
          const qs = params.toString();
          const href = qs ? `${r.securityEvents}?${qs}` : r.securityEvents;
          return (
            <Link
              key={f.key}
              href={href}
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                reviewFilter === f.key
                  ? "bg-violet-500/25 text-violet-200"
                  : "bg-white/5 text-slate-400 hover:text-slate-200"
              }`}
            >
              {f.label}
            </Link>
          );
        })}
      </nav>

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

      {rows.length === 0 ? (
        <EmptyState
          title="No security events"
          description={
            logisticsOnly
              ? "Logistics anomaly and SLA events appear after ops seed or live workflow escalation."
              : "Events are recorded when CyberCrow observes policy or logistics escalations."
          }
        />
      ) : (
        <ul className="space-y-3">
          {rows.map((row) => {
            const e = row.event;
            return (
              <li key={e.id} className="cc-glass-card">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-white">
                    {e.eventType.replace(/_/g, " ").toLowerCase()}
                  </span>
                  <span className="rounded-full bg-slate-500/15 px-2 py-0.5 text-[10px] text-slate-400">
                    {row.reviewStatus}
                  </span>
                  {isLogisticsSecurityEvent(e.eventType) && (
                    <span className="rounded-full bg-teal-500/15 px-2 py-0.5 text-[10px] text-teal-300">
                      Logistics
                    </span>
                  )}
                  <span
                    className={`text-xs font-medium ${SEVERITY_CLASS[e.severity] ?? "text-slate-400"}`}
                  >
                    {e.severity}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  Source: <span className="font-mono text-slate-400">{e.eventType}</span>
                  {row.referenceCode ? (
                    <>
                      {" "}
                      · affected{" "}
                      <span className="font-mono text-cyan-500/90">{row.referenceCode}</span>
                    </>
                  ) : null}
                </p>
                {row.workflowName ? (
                  <p className="text-xs text-slate-400">Workflow: {row.workflowName}</p>
                ) : null}
                <p className="text-xs text-slate-500">
                  {e.createdAt.toLocaleString("en-GB", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
                <CybercrowEventEvidenceHints
                  tenantSlug={slug}
                  context={getEventEvidenceContext(
                    row.reviewStatus,
                    e.severity,
                    Boolean(row.escalatedIncidentId)
                  )}
                />
                {canManage ? (
                  <SecurityEventReviewActions
                    tenantSlug={slug}
                    eventId={e.id}
                    severity={e.severity}
                    reviewStatus={row.reviewStatus}
                    escalatedIncidentId={row.escalatedIncidentId}
                    escalatedIncidentTitle={row.escalatedIncidentTitle}
                    recommendedAction={row.recommendedAction}
                  />
                ) : (
                  <p className="mt-2 text-xs text-slate-500">{row.recommendedAction}</p>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <CybercrowOperatorNextActions
        items={[
          {
            action: "review_event",
            href: r.securityEvents,
            detail: rows.length > 0 ? `${rows.length} event(s) in view` : "Awaiting observed activity",
          },
          {
            action: "collect_evidence",
            href: r.evidence,
            detail: "Link reviewed events to evidence catalog",
          },
          {
            action: "review_risk",
            href: r.risk,
            detail: "Posture impact from open events",
          },
        ]}
      />

      <Link href={r.dashboard} className="text-sm text-cyan-400 hover:text-cyan-300">
        ← CyberCrow dashboard
      </Link>
    </div>
  );
}
