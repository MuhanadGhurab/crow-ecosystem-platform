import type { CybercrowAuditLog } from "@prisma/client";
import {
  isLogisticsAuditAction,
  LOGISTICS_AUDIT_CATEGORY,
} from "@/lib/constants/cybercrow-audit-events";

type AuditLogRow = Pick<
  CybercrowAuditLog,
  "id" | "action" | "entityType" | "entityId" | "metadata" | "createdAt"
> & { actorId?: string | null };

function metadataRecord(metadata: unknown): Record<string, unknown> | null {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) return null;
  return metadata as Record<string, unknown>;
}

function actionLabel(action: string): string {
  return action.replace(/_/g, " ").toLowerCase();
}

export function CybercrowAuditLogList({ logs }: { logs: AuditLogRow[] }) {
  if (logs.length === 0) {
    return <p className="text-sm text-slate-500">No entries match this filter.</p>;
  }

  return (
    <ul className="space-y-2">
      {logs.map((log) => {
        const meta = metadataRecord(log.metadata);
        const isLogistics =
          isLogisticsAuditAction(log.action) ||
          meta?.category === LOGISTICS_AUDIT_CATEGORY;
        const ref =
          (typeof meta?.referenceCode === "string" && meta.referenceCode) ||
          (typeof meta?.shipmentRef === "string" && meta.shipmentRef) ||
          log.entityId;
        const workflow =
          typeof meta?.workflowName === "string" ? meta.workflowName : null;
        const severity =
          typeof meta?.severity === "string" ? meta.severity : null;
        const category =
          typeof meta?.category === "string" ? meta.category : null;
        const incidentId =
          log.entityType === "incident" && log.entityId ? log.entityId : null;
        const securityEventId =
          log.entityType === "security_event" && log.entityId ? log.entityId : null;

        return (
          <li key={log.id} className="cc-list-item flex-col !items-start gap-1">
            <div className="flex w-full flex-wrap items-center gap-2">
              <p className="font-medium text-white">{actionLabel(log.action)}</p>
              {isLogistics && (
                <span className="rounded-full bg-teal-500/15 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-teal-300">
                  Logistics
                </span>
              )}
              {severity && (
                <span className="text-[10px] font-medium uppercase text-slate-500">
                  {severity}
                </span>
              )}
            </div>
            {(workflow || ref) && (
              <p className="text-xs text-slate-400">
                {workflow}
                {workflow && ref ? " · " : null}
                {ref ? <span className="font-mono text-cyan-500/90">{ref}</span> : null}
              </p>
            )}
            <p className="text-xs text-slate-500">
              {log.createdAt.toLocaleString("en-GB", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
              {log.actorId ? (
                <>
                  {" "}
                  · actor <span className="font-mono text-slate-600">{log.actorId.slice(0, 8)}…</span>
                </>
              ) : null}
              {log.entityType ? ` · ${log.entityType}` : null}
              {category ? ` · ${category}` : null}
            </p>
            {(incidentId || securityEventId) && (
              <p className="text-xs text-violet-400/80">
                SOC link:{" "}
                {incidentId ? (
                  <span className="font-mono">incident {incidentId.slice(0, 8)}…</span>
                ) : null}
                {incidentId && securityEventId ? " · " : null}
                {securityEventId ? (
                  <span className="font-mono">event {securityEventId.slice(0, 8)}…</span>
                ) : null}
              </p>
            )}
          </li>
        );
      })}
    </ul>
  );
}
