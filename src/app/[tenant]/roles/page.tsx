import Link from "next/link";
import { notFound } from "next/navigation";
import { TenantRuntimePageHeader } from "@/components/tenant/tenant-runtime-page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { TenantRuntimeCrossLinks } from "@/components/tenant/tenant-runtime-cross-links";
import { TenantRuntimeStatStrip } from "@/components/tenant/tenant-runtime-stat-strip";
import { HrOrgLinkageBanner } from "@/components/tenant/hr/hr-org-linkage-banner";
import { TenantCemLinkageNote } from "@/components/tenant/tenant-cem-linkage-note";
import { routes } from "@/lib/routes";
import { getCemOperationsSnapshot } from "@/lib/services/cem-operations-intelligence.service";
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

  const [roles, summary, ops] = await Promise.all([
    listTenantRoles(tenant.id),
    safeWorkspaceSummary(tenant.id),
    getCemOperationsSnapshot(tenant.id),
  ]);

  const r = routes.tenant(slug);
  const assignedUsers = roles.reduce((n, role) => n + role._count.userRoles, 0);
  const unassignedRoles = Math.max(0, roles.length - ops.rolesWithAssignments);
  const hrWarnings: string[] = [];
  if (roles.length > 0 && ops.rolesWithAssignments === 0) {
    hrWarnings.push("Roles exist but none are assigned — map users before workforce go-live.");
  } else if (unassignedRoles > 0) {
    hrWarnings.push(`${unassignedRoles} role(s) have no user assignment.`);
  }

  return (
    <div className="space-y-8">
      <TenantRuntimePageHeader
        beat="structure"
        badge="CEM · RBAC"
        entity="cem"
        title="Roles"
        description={`RBAC role definitions for ${tenant.organization.displayName}. Permissions are enforced server-side — SAREA preview does not elevate access.`}
      />

      <HrOrgLinkageBanner slug={slug} warnings={hrWarnings} />

      <TenantRuntimeStatStrip
        items={[
          { label: "Roles", value: roles.length, accent: "violet" },
          { label: "Assignments", value: assignedUsers, hint: "User-role links" },
          {
            label: "Unassigned roles",
            value: Math.max(0, roles.length - ops.rolesWithAssignments),
            accent: roles.length > ops.rolesWithAssignments ? "amber" : undefined,
          },
          {
            label: "SAREA profiles",
            value: summary.sareaProfileCount ?? 0,
            accent: "rose",
            hint: "Persona experience",
          },
          { label: "Readiness", value: ops.readinessLabel },
        ]}
      />

      {roles.length > 0 && ops.rolesWithAssignments === 0 && (
        <p className="rounded-cc border border-amber-500/20 bg-amber-950/20 px-4 py-3 text-sm text-amber-200">
          Roles exist but none are assigned to users — map assignments on the{" "}
          <Link href={r.users} className="text-cyan-300 underline">
            users
          </Link>{" "}
          page. RBAC controls access; SAREA controls experience after roles are mapped.
        </p>
      )}

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

      <section className="cc-glass-card border-rose-500/15">
        <h3 className="text-sm font-medium text-rose-300">SAREA persona relevance</h3>
        <p className="mt-2 text-sm text-slate-400">
          Role slugs align with SAREA experience profiles for navigation density and widgets.
          Preview does not elevate permissions.
        </p>
        <Link href={routes.sarea.profiles} className="mt-3 inline-block text-sm text-rose-400">
          SAREA profiles →
        </Link>
      </section>

      <section className="cc-glass-card border-violet-500/15">
        <h3 className="text-sm font-medium text-violet-300">Operational responsibility</h3>
        <ul className="mt-3 space-y-2 text-sm text-slate-400">
          <li>
            <Link href={r.users} className="text-cyan-400 hover:text-cyan-300">
              Assign roles on the users page →
            </Link>
          </li>
          <li>
            <Link href={r.workflows} className="text-cyan-400 hover:text-cyan-300">
              Review workflows for task ownership →
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

      <TenantCemLinkageNote
        slug={slug}
        cybercrowInitialized={summary.cybercrowInitialized}
        compact
      />

      <TenantRuntimeCrossLinks slug={slug} current="roles" cybercrowLive={summary.cybercrowInitialized} />
    </div>
  );
}
