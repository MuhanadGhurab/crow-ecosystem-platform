import Link from "next/link";
import { notFound } from "next/navigation";
import { GrantTenantAccessForm } from "@/components/admin/grant-tenant-access-form";
import { RequestStatusBadge } from "@/components/admin/request-status-badge";
import { moduleLabel, planLabel } from "@/lib/catalog-labels";
import { routes } from "@/lib/routes";
import { listTenantMemberships } from "@/lib/services/membership.service";
import { getTenantIdentityCounts } from "@/lib/services/tenant-identity.service";
import { getTenantHealthSummary } from "@/lib/services/tenant-health.service";
import { getTenantById, getTenantWorkspaceSummary } from "@/lib/services/tenant.service";
import type { ImplementationRequestStatus } from "@/lib/types/platform";

export default async function AdminTenantDetailPage({
  params,
}: {
  params: Promise<{ tenantId: string }>;
}) {
  const { tenantId } = await params;
  const tenant = await getTenantById(tenantId);

  if (!tenant) {
    notFound();
  }

  const summary = await getTenantWorkspaceSummary(tenant.id);
  const health = await getTenantHealthSummary(tenant.id);
  const identity = await getTenantIdentityCounts(tenant.id);
  const memberships = await listTenantMemberships(tenant.id);
  const request = tenant.blueprint?.request;

  return (
    <div className="space-y-8">
      <div>
        <Link href={routes.admin.tenants} className="text-sm text-cyan-400 hover:text-cyan-300">
          ← All tenants
        </Link>
        <h2 className="mt-4 text-xl font-semibold text-white">{tenant.organization.displayName}</h2>
        <p className="mt-1 font-mono text-sm text-cyan-400">/{tenant.slug}</p>
      </div>

      <section className="cc-glass-card space-y-4">
        <h3 className="text-sm font-medium text-cyan-400">Workspace health</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-xs text-slate-500">Status</p>
            <p
              className={`text-sm font-medium ${
                health.healthScore === "good"
                  ? "text-teal-300"
                  : health.healthScore === "watch"
                    ? "text-amber-300"
                    : "text-red-400"
              }`}
            >
              {health.healthLabel}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Open incidents</p>
            <p className="text-sm font-medium text-white">{health.openIncidentCount}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Auth memberships</p>
            <p className="text-sm font-medium text-cyan-300">{health.membershipCount}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Last audit event</p>
            <p className="text-sm font-medium text-slate-300">
              {health.lastAuditAt ? health.lastAuditAt.toLocaleString() : "—"}
            </p>
          </div>
        </div>
      </section>

      <section className="cc-glass-card grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <p className="text-xs text-slate-500">Plan</p>
          <p className="text-sm font-medium text-white">{planLabel(tenant.planKey)}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">CEM users</p>
          <p className="text-sm font-medium text-cyan-300">{identity.profiles}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Departments / roles</p>
          <p className="text-sm font-medium text-cyan-300">
            {identity.departments} / {identity.roles}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-500">CyberCrow events</p>
          <p className="text-sm font-medium text-cyan-300">{summary.auditLogCount}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">SAREA profiles</p>
          <p className="text-sm font-medium text-cyan-300">{summary.sareaProfileCount}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Auth memberships</p>
          <p className="text-sm font-medium text-cyan-300">{memberships.length}</p>
        </div>
      </section>

      <section className="cc-glass-card">
        <h3 className="text-sm font-medium text-cyan-400">Grant tenant access</h3>
        <div className="mt-4">
          <GrantTenantAccessForm tenantId={tenant.id} tenantSlug={tenant.slug} />
        </div>
        {memberships.length > 0 && (
          <ul className="mt-6 space-y-2 border-t border-cyan-500/10 pt-4 text-xs text-slate-500">
            {memberships.map((m) => (
              <li key={m.id} className="font-mono">
                {m.supabaseUserId.slice(0, 8)}… · {m.role}
              </li>
            ))}
          </ul>
        )}
      </section>

      {request && (
        <section className="cc-glass-card space-y-3">
          <h3 className="text-sm font-medium text-cyan-400">Implementation request</h3>
          <p className="font-mono text-xs text-slate-500">{request.referenceCode}</p>
          <RequestStatusBadge status={request.status as ImplementationRequestStatus} />
          <Link
            href={routes.admin.request(request.id)}
            className="inline-block text-sm text-cyan-400 hover:text-cyan-300"
          >
            View request →
          </Link>
        </section>
      )}

      <section className="cc-glass-card">
        <h3 className="text-sm font-medium text-cyan-400">Enabled modules</h3>
        <ul className="mt-3 flex flex-wrap gap-2">
          {tenant.modules.map((m) => (
            <li
              key={m.id}
              className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs text-cyan-300"
            >
              {moduleLabel(m.moduleKey)}
            </li>
          ))}
        </ul>
      </section>

      <div className="flex flex-wrap gap-3">
        <Link href={routes.tenant(tenant.slug).dashboard} className="cc-btn-primary text-sm">
          Open tenant workspace →
        </Link>
        <Link href={routes.tenant(tenant.slug).users} className="cc-btn-secondary text-sm">
          CEM users
        </Link>
        {tenant.blueprint && (
          <Link
            href={routes.blueprint(tenant.blueprint.id).overview}
            className="cc-btn-secondary text-sm"
          >
            View blueprint
          </Link>
        )}
      </div>
    </div>
  );
}
