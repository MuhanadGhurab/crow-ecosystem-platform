import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { routes } from "@/lib/routes";
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

  const [security, recentAudit] = await Promise.all([
    getTenantSecuritySettings(tenant.id),
    listTenantAuditLogs(tenant.id, { limit: 40 }),
  ]);
  const sessionSignals = recentAudit.filter((log) => isSessionRelatedAction(log.action));
  const r = routes.tenant(slug).cybercrow;

  return (
    <div className="space-y-8">
      <PageHeader
        badge="CyberCrow"
        entity="cybercrow"
        title="Sessions & privileged access"
        description="Session telemetry and privileged access reviews — Entra-aligned when configured."
      />

      <section className="rounded-lg border border-amber-500/20 bg-amber-950/20 px-4 py-3 text-sm text-amber-100/90">
        <p className="font-medium text-amber-300">Read-only session governance</p>
        <p className="mt-1 text-xs text-slate-400">
          Live Entra session inventory and forced sign-out are not connected in this release. This
          view surfaces identity-related audit signals and MFA posture from tenant security settings
          until a session store is integrated.
        </p>
      </section>

      <section className="cc-glass-card grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-xs text-slate-500">MFA required (tenant policy)</p>
          <p className="mt-1 text-lg font-semibold text-white">
            {security.mfaRequired ? "Yes" : "Not enforced"}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-500">IdP preference (discovery)</p>
          <p className="mt-1 text-lg font-semibold text-white">{security.idpLabel}</p>
        </div>
      </section>

      {sessionSignals.length === 0 ? (
        <EmptyState
          title="No session signals in audit trail"
          description="Login, logout, and MFA events will appear here when recorded in CyberCrow audit logs. Configure identity in Entra settings and run tenant workflows to generate activity."
        />
      ) : (
        <section className="cc-glass-card">
          <h3 className="text-sm font-medium text-violet-300">Recent identity-related audit events</h3>
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
