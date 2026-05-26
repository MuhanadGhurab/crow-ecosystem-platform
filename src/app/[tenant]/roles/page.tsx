import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { TenantRuntimeCrossLinks } from "@/components/tenant/tenant-runtime-cross-links";
import { TenantRuntimeStatStrip } from "@/components/tenant/tenant-runtime-stat-strip";
import { routes } from "@/lib/routes";
import { listTenantRoles } from "@/lib/services/tenant-identity.service";
import { safeWorkspaceSummary } from "@/lib/services/workspace-summary-safe";
import { getTenantBySlug } from "@/lib/services/tenant.service";

export default async function TenantRolesPage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: slug } = await params;
  const tenant = await getTenantBySlug(slug);
  if (!tenant) notFound();

  const [roles, summary] = await Promise.all([
    listTenantRoles(tenant.id),
    safeWorkspaceSummary(tenant.id),
  ]);

  const r = routes.tenant(slug);
  const assignedUsers = roles.reduce((n, role) => n + role._count.userRoles, 0);

  return (
    <div className="space-y-8">
      <PageHeader
        badge="CEM · RBAC"
        entity="cem"
        title="Roles"
        description={`RBAC role definitions for ${tenant.organization.displayName}. Permissions are enforced server-side — SAREA preview does not elevate access.`}
      />

      <TenantRuntimeStatStrip
        items={[
          { label: "Roles", value: roles.length, accent: "violet" },
          { label: "Assignments", value: assignedUsers, hint: "User-role links" },
          { label: "Profiles", value: summary.profileCount ?? 0 },
          {
            label: "SAREA profiles",
            value: summary.sareaProfileCount ?? 0,
            accent: "rose",
            hint: "Experience mappings",
          },
        ]}
      />

      {roles.length === 0 ? (
        <EmptyState
          title="No roles defined"
          description="Roles are created during discovery seeding or blueprint provisioning."
          action={
            <Link href={r.users} className="cc-btn-primary text-sm">
              Go to users
            </Link>
          }
        />
      ) : (
        <ul className="space-y-3">
          {roles.map((role) => (
            <li
              key={role.id}
              className="cc-glass-card flex flex-wrap items-center justify-between gap-4 border-cyan-500/10 p-4"
            >
              <div>
                <p className="font-medium text-white">{role.name}</p>
                <p className="font-mono text-xs text-slate-500">{role.slug}</p>
              </div>
              <p className="text-xs text-slate-500">
                {role._count.userRoles} user{role._count.userRoles === 1 ? "" : "s"} ·{" "}
                {role._count.rolePermissions} permission
                {role._count.rolePermissions === 1 ? "" : "s"}
              </p>
            </li>
          ))}
        </ul>
      )}

      <section className="cc-glass-card border-violet-500/15">
        <h3 className="text-sm font-medium text-violet-300">Next steps</h3>
        <ul className="mt-3 space-y-2 text-sm text-slate-400">
          <li>
            <Link href={r.users} className="text-cyan-400 hover:text-cyan-300">
              Assign roles on the users page →
            </Link>
          </li>
          {summary.cybercrowInitialized && (
            <li>
              <Link href={r.cybercrow.auditLogs} className="text-violet-400 hover:text-violet-300">
                Review CyberCrow audit for privileged actions →
              </Link>
            </li>
          )}
        </ul>
      </section>

      <TenantRuntimeCrossLinks slug={slug} current="roles" cybercrowLive={summary.cybercrowInitialized} />
    </div>
  );
}
