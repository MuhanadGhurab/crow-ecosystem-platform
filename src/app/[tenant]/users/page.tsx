import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { TenantRuntimeCrossLinks } from "@/components/tenant/tenant-runtime-cross-links";
import { TenantRuntimeStatStrip } from "@/components/tenant/tenant-runtime-stat-strip";
import { InviteTenantUserForm } from "@/components/tenant/invite-tenant-user-form";
import {
  ProfileRoleAssignForm,
  ProfileRoleTable,
} from "@/components/tenant/profile-role-manager";
import { getSessionUser } from "@/lib/auth/session";
import { getCrowAuth, isPlatformStaff } from "@/lib/auth/roles";
import { canPerformAction } from "@/lib/services/cybercrow-policy.service";
import { routes } from "@/lib/routes";
import { listTenantProfiles, listTenantRoles } from "@/lib/services/tenant-identity.service";
import { safeWorkspaceSummary } from "@/lib/services/workspace-summary-safe";
import { getTenantBySlug } from "@/lib/services/tenant.service";

export default async function TenantUsersPage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: slug } = await params;
  const tenant = await getTenantBySlug(slug);
  if (!tenant) notFound();

  const [profiles, roles, user, summary] = await Promise.all([
    listTenantProfiles(tenant.id),
    listTenantRoles(tenant.id),
    getSessionUser(),
    safeWorkspaceSummary(tenant.id),
  ]);

  const { role } = getCrowAuth(user);
  const canManageRoles =
    isPlatformStaff(role) || canPerformAction(role, "cem.roles.manage");

  const profileRows = profiles.map((p) => ({
    id: p.id,
    fullName: p.fullName,
    email: p.email,
    departmentName: p.department?.name ?? null,
    userRoles: p.userRoles.map((ur) => ({
      roleId: ur.roleId,
      roleName: ur.role.name,
    })),
  }));

  const roleOptions = roles.map((r) => ({ id: r.id, name: r.name, slug: r.slug }));

  return (
    <div className="space-y-8">
      <PageHeader
        badge="CEM · Identity"
        entity="cem"
        title="Users & roles"
        description={`Profiles and role assignments for ${tenant.organization.displayName}. Identity provider behavior is unchanged — this page manages workspace RBAC only.`}
      />

      <TenantRuntimeStatStrip
        items={[
          { label: "Profiles", value: profiles.length, accent: "teal" },
          { label: "Roles", value: roles.length, accent: "violet" },
          { label: "Departments", value: summary.departmentCount ?? 0 },
          {
            label: "SAREA mappings",
            value: summary.sareaProfileCount ?? 0,
            accent: "rose",
            hint: "Experience profiles",
          },
        ]}
      />

      <InviteTenantUserForm tenantSlug={slug} />

      {canManageRoles ? (
        <ProfileRoleAssignForm tenantSlug={slug} profiles={profileRows} roles={roleOptions} />
      ) : (
        <p className="text-xs text-slate-500">
          CEM role assignment requires tenant admin. Auth membership roles are managed via invite.
        </p>
      )}

      <ProfileRoleTable
        tenantSlug={slug}
        profiles={profileRows}
        canManageRoles={canManageRoles}
      />

      <section className="cc-glass-card border-rose-500/15">
        <p className="text-sm text-slate-400">
          SAREA maps roles to navigation widgets in the studio. Persona preview on the dashboard does
          not change who can access tenant data.
        </p>
        <Link href={routes.sarea.roleMapping} className="mt-2 inline-block text-sm text-rose-400">
          SAREA role mapping →
        </Link>
      </section>

      <TenantRuntimeCrossLinks
        slug={slug}
        current="users"
        cybercrowLive={summary.cybercrowInitialized}
      />
    </div>
  );
}
