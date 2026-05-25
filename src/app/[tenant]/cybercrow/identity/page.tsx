import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import {
  EntraOpsPanel,
  shouldShowEntraOpsNarrative,
} from "@/components/tenant/entra-ops-panel";
import { IdentityTelemetrySummary } from "@/components/tenant/cybercrow/identity-telemetry-summary";
import { routes } from "@/lib/routes";
import {
  getCybercrowIdentityTelemetrySummary,
  listTenantLoginEvents,
  listTenantAccessAttempts,
  listTenantDeviceTrustRecords,
} from "@/lib/services/cybercrow-identity-telemetry.service";
import { getTenantSecuritySettings } from "@/lib/services/tenant-security-settings.service";
import { getTenantBySlug } from "@/lib/services/tenant.service";

export default async function CybercrowIdentityPage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: slug } = await params;
  const tenant = await getTenantBySlug(slug);
  if (!tenant) notFound();

  const [security, telemetry, loginEvents, accessAttempts, deviceTrust] = await Promise.all([
    getTenantSecuritySettings(tenant.id),
    getCybercrowIdentityTelemetrySummary(tenant.id),
    listTenantLoginEvents(tenant.id, 12),
    listTenantAccessAttempts(tenant.id, 12),
    listTenantDeviceTrustRecords(tenant.id, 12),
  ]);
  const showEntra = shouldShowEntraOpsNarrative(tenant.planKey, security);
  const r = routes.tenant(slug);

  return (
    <div className="space-y-8">
      <PageHeader
        badge="CyberCrow"
        entity="cybercrow"
        title="Identity & access"
        description="Identity posture from stored telemetry, discovery IdP/MFA settings, and Entra operations — not live directory sync."
      />

      <section className="rounded-lg border border-violet-500/15 bg-violet-950/15 px-4 py-3 text-xs text-slate-400">
        Access signals and session trust are derived from tenant tables and audit entries when
        auth flows write them. This is not a SIEM, Entra session inventory, or AI risk score.
      </section>

      <IdentityTelemetrySummary
        summary={telemetry}
        mfaRequired={security.mfaRequired}
        idpLabel={security.idpLabel}
      />

      <EntraOpsPanel
        tenantSlug={slug}
        security={security}
        showEntraNarrative={showEntra}
        variant="identity"
      />

      {loginEvents.length === 0 && accessAttempts.length === 0 && deviceTrust.length === 0 ? (
        <EmptyState
          title="No identity telemetry rows yet"
          description="Login, access, and device trust events appear when application auth and policy checks record them. MFA and IdP preference above still reflect discovery and tenant security settings."
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {loginEvents.length > 0 && (
            <section className="cc-glass-card">
              <h3 className="text-sm font-medium text-violet-300">Recent login events</h3>
              <ul className="mt-4 space-y-2">
                {loginEvents.map((e) => (
                  <li key={e.id} className="cc-list-item flex-col !items-start gap-1">
                    <span className={e.success ? "text-teal-300" : "text-rose-400"}>
                      {e.success ? "Success" : "Failed"}
                      {e.ipAddress ? ` · ${e.ipAddress}` : ""}
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
          {accessAttempts.length > 0 && (
            <section className="cc-glass-card">
              <h3 className="text-sm font-medium text-violet-300">Access attempts</h3>
              <ul className="mt-4 space-y-2">
                {accessAttempts.map((a) => (
                  <li key={a.id} className="cc-list-item flex-col !items-start gap-1">
                    <span className="text-white">{a.resourceKey}</span>
                    <span className={`text-xs ${a.allowed ? "text-teal-400" : "text-rose-400"}`}>
                      {a.allowed ? "Allowed" : "Denied"} ·{" "}
                      {a.createdAt.toLocaleString("en-GB", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}
          {deviceTrust.length > 0 && (
            <section className="cc-glass-card lg:col-span-2">
              <h3 className="text-sm font-medium text-violet-300">Device trust</h3>
              <ul className="mt-4 space-y-2">
                {deviceTrust.map((d) => (
                  <li key={d.id} className="cc-list-item flex-col !items-start gap-1 sm:flex-row sm:items-center">
                    <span className="font-mono text-sm text-white">{d.deviceId}</span>
                    <span className="text-xs text-slate-500">
                      {d.trustLevel} ·{" "}
                      {d.createdAt.toLocaleString("en-GB", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}

      <section className="cc-glass-card text-sm text-slate-400">
        <p>
          Session governance and privileged access reviews are on the{" "}
          <Link href={r.cybercrow.sessions} className="text-violet-400 hover:text-violet-300">
            Sessions
          </Link>{" "}
          console. Workspace-level settings:{" "}
          <Link href={r.settings} className="text-cyan-400 hover:text-cyan-300">
            Tenant settings →
          </Link>
        </p>
      </section>

      <Link href={r.cybercrow.dashboard} className="text-sm text-cyan-400 hover:text-cyan-300">
        ← CyberCrow dashboard
      </Link>
    </div>
  );
}
