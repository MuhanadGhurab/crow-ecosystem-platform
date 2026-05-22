import Link from "next/link";
import { notFound } from "next/navigation";
import { routes } from "@/lib/routes";
import { listTenantRoles } from "@/lib/services/tenant-identity.service";
import { getTenantBySlug } from "@/lib/services/tenant.service";

export default async function TenantRolesPage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: slug } = await params;
  const tenant = await getTenantBySlug(slug);
  if (!tenant) notFound();

  const roles = await listTenantRoles(tenant.id);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white">Roles</h2>
        <p className="mt-1 text-sm text-slate-400">
          RBAC role definitions for {tenant.organization.displayName}. Assign roles to users on the
          users page.
        </p>
      </div>

      {roles.length === 0 ? (
        <p className="text-sm text-slate-500">No roles defined for this tenant.</p>
      ) : (
        <ul className="space-y-3">
          {roles.map((r) => (
            <li
              key={r.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-cc border border-cyan-500/10 bg-white/5 p-4"
            >
              <div>
                <p className="font-medium text-white">{r.name}</p>
                <p className="font-mono text-xs text-slate-500">{r.slug}</p>
              </div>
              <p className="text-xs text-slate-500">
                {r._count.userRoles} users · {r._count.rolePermissions} permissions
              </p>
            </li>
          ))}
        </ul>
      )}

      <Link href={routes.tenant(slug).users} className="text-sm text-cyan-400 hover:text-cyan-300">
        Assign roles on users page →
      </Link>
    </div>
  );
}
