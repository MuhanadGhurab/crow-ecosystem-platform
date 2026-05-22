import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
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
import { getTenantBySlug } from "@/lib/services/tenant.service";

export default async function TenantUsersPage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: slug } = await params;
  const tenant = await getTenantBySlug(slug);
  if (!tenant) notFound();

  const [profiles, roles, user] = await Promise.all([
    listTenantProfiles(tenant.id),
    listTenantRoles(tenant.id),
    getSessionUser(),
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
        badge="CEM"
        title="Users & roles"
        description={`Profiles and role assignments for ${tenant.organization.displayName}.`}
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

      <div className="flex flex-wrap gap-4 text-sm">
        <Link href={routes.tenant(slug).roles} className="text-cyan-400 hover:text-cyan-300">
          View role definitions →
        </Link>
        {canManageRoles && (
          <Link
            href={routes.tenant(slug).cybercrow.auditLogs}
            className="text-slate-400 hover:text-white"
          >
            CyberCrow audit logs →
          </Link>
        )}
      </div>
    </div>
  );
}
