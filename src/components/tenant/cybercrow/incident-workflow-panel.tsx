import Link from "next/link";
import { IncidentStatusActions } from "@/components/tenant/cybercrow/incident-status-actions";
import { incidentStatusLabel } from "@/lib/constants/cybercrow-incident-status";
import type { IncidentEnriched } from "@/lib/services/cybercrow-soc-workflow.service";
import { routes } from "@/lib/routes";

type Props = {
  tenantSlug: string;
  row: IncidentEnriched;
  canManage: boolean;
};

export function IncidentWorkflowPanel({ tenantSlug, row, canManage }: Props) {
  const { incident, linkedEvent, statusHistory, relatedAuditCount, evidenceHints, recommendedAction } =
    row;
  const r = routes.tenant(tenantSlug).cybercrow;

  return (
    <div className="mt-3 space-y-3 border-t border-violet-500/10 pt-3">
      <div className="flex flex-wrap gap-2 text-xs">
        <span className="rounded-full bg-violet-500/15 px-2 py-0.5 text-violet-200">
          {incident.severity}
        </span>
        <span className="rounded-full bg-slate-500/15 px-2 py-0.5 text-slate-300">
          {incidentStatusLabel(incident.status)}
        </span>
        <span className="rounded-full bg-slate-500/10 px-2 py-0.5 text-slate-500">
          Assignment workflow not enabled
        </span>
      </div>

      <p className="text-xs text-amber-200/90">
        <span className="font-medium text-amber-300">Recommended:</span> {recommendedAction}
      </p>

      {linkedEvent ? (
        <div className="rounded-cc-sm border border-teal-500/15 bg-teal-950/10 px-3 py-2 text-xs">
          <p className="font-medium text-teal-300">Linked security event</p>
          <p className="mt-1 text-slate-400">
            {linkedEvent.eventType.replace(/_/g, " ")} · {linkedEvent.severity}
          </p>
          <Link href={r.securityEvents} className="mt-1 inline-block text-teal-400 hover:text-teal-300">
            View security events →
          </Link>
        </div>
      ) : (
        <p className="text-xs text-slate-500">No escalated security event linked in payload.</p>
      )}

      {statusHistory.length > 0 ? (
        <div>
          <p className="text-xs font-medium text-slate-400">Status timeline (audit-backed)</p>
          <ul className="mt-2 space-y-1 border-l border-violet-500/20 pl-3">
            {statusHistory.map((h, idx) => (
              <li key={idx} className="text-xs text-slate-500">
                {h.at.toLocaleString("en-GB", { dateStyle: "short", timeStyle: "short" })}
                {h.previousStatus && h.nextStatus ? (
                  <>
                    {" "}
                    · {h.previousStatus} → {h.nextStatus}
                  </>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-xs text-slate-500">
          Status timeline appears after the first audited status change.
        </p>
      )}

      <p className="text-xs text-slate-500">
        {relatedAuditCount} related audit log entries (incident + linked event).
      </p>

      <div>
        <p className="text-xs font-medium text-slate-400">Evidence readiness (advisory)</p>
        <ul className="mt-1 list-inside list-disc text-xs text-slate-500">
          {evidenceHints.slice(0, 3).map((hint) => (
            <li key={hint}>{hint}</li>
          ))}
        </ul>
        <Link href={r.evidence} className="mt-1 inline-block text-xs text-indigo-400">
          Evidence repository →
        </Link>
      </div>

      <div className="flex flex-wrap gap-3 text-xs">
        <Link href={r.auditLogs} className="text-violet-400 hover:text-violet-300">
          Audit trail →
        </Link>
        <Link href={r.risk} className="text-slate-400 hover:text-slate-300">
          Risk posture →
        </Link>
      </div>

      {canManage ? (
        <IncidentStatusActions
          tenantSlug={tenantSlug}
          incidentId={incident.id}
          currentStatus={incident.status}
        />
      ) : null}
    </div>
  );
}
