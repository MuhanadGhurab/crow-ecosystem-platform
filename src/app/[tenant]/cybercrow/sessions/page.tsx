import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { IdentityTelemetrySummary } from "@/components/tenant/cybercrow/identity-telemetry-summary";
import { routes } from "@/lib/routes";
import {
  getCybercrowIdentityTelemetrySummary,
  listTenantSessionEvents,
} from "@/lib/services/cybercrow-identity-telemetry.service";
import { listTenantAuditLogs } from "@/lib/services/cybercrow-tenant.service";
import { getTenantSecuritySettings } from "@/lib/services/tenant-security-settings.service";
import { getTenantBySlug } from "@/lib/services/tenant.service";

const SESSION_ACTION_HINTS = ["LOGIN", "LOGOUT", "SESSION", "MFA", "AUTH"];

function isSessionRelatedAction(action: string): boolean {
  const upper = action.toUpperCase();
  return SESSION_ACTION_HINTS.some((hint) => upper.includes(hint));
}

export default async function CybercrowSessionsPage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: slug } = await params;
  const tenant = await getTenantBySlug(slug);
  if (!tenant) notFound();

  const [security, telemetry, sessionEvents, recentAudit] = await Promise.all([
    getTenantSecuritySettings(tenant.id),
    getCybercrowIdentityTelemetrySummary(tenant.id),
    listTenantSessionEvents(tenant.id, 20),
    listTenantAuditLogs(tenant.id, { limit: 40 }),
  ]);
  const sessionSignals = recentAudit.filter((log) => isSessionRelatedAction(log.action));
  const r = routes.tenant(slug).cybercrow;

  return (
    <div className="space-y-8">
      <PageHeader
        badge="CyberCrow"
        entity="cybercrow"
        title="Sessions & session trust"
        description="Session audit events and identity-related audit signals — not live Entra session inventory."
      />

      <section className="rounded-lg border border-amber-500/20 bg-amber-950/20 px-4 py-3 text-sm text-amber-100/90">
        <p className="font-medium text-amber-300">Session trust (stored telemetry)</p>
        <p className="mt-1 text-xs text-slate-400">
          Forced sign-out and live Entra session lists are not connected. This view shows{" "}
          <code className="text-amber-200/80">session_events</code> rows and supplemental audit
          actions when recorded.
        </p>
      </section>

      <IdentityTelemetrySummary
        summary={telemetry}
        mfaRequired={security.mfaRequired}
        idpLabel={security.idpLabel}
      />

      {sessionEvents.length === 0 ? (
        <EmptyState
          title="No session_events rows"
          description="Session lifecycle events appear when auth middleware records create, refresh, or revoke signals."
        />
      ) : (
        <section className="cc-glass-card">
          <h3 className="text-sm font-medium text-violet-300">Session events</h3>
          <ul className="mt-4 space-y-2">
            {sessionEvents.map((e) => (
              <li key={e.id} className="cc-list-item flex-col !items-start gap-1">
                <span className="text-white">
                  {e.eventType.replace(/_/g, " ").toLowerCase()}
                  <span className="ml-2 font-mono text-xs text-slate-500">{e.sessionId}</span>
                </span>
                <span className="text-xs text-slate-500">
                  {e.createdAt.toLocaleString("en-GB", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {sessionSignals.length === 0 ? (
        <EmptyState
          title="No session-related audit entries"
          description="Login, logout, and MFA actions in CyberCrow audit logs supplement session_events when present."
        />
      ) : (
        <section className="cc-glass-card">
          <h3 className="text-sm font-medium text-violet-300">Identity-related audit events</h3>
          <ul className="mt-4 space-y-2">
            {sessionSignals.map((log) => (
              <li key={log.id} className="cc-list-item flex-col !items-start gap-1">
                <span className="text-white">{log.action.replace(/_/g, " ").toLowerCase()}</span>
                <span className="text-xs text-slate-500">
                  {log.createdAt.toLocaleString("en-GB", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                  {log.entityType ? ` · ${log.entityType}` : null}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="text-xs text-slate-500">
        For IdP alignment and Entra operations narrative, see{" "}
        <Link href={r.identity} className="text-violet-400 hover:text-violet-300">
          Identity & access
        </Link>
        .
      </p>

      <Link href={r.dashboard} className="text-sm text-cyan-400 hover:text-cyan-300">
        ← CyberCrow dashboard
      </Link>
    </div>
  );
}
