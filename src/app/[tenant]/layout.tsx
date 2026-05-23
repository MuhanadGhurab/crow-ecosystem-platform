import { notFound } from "next/navigation";
import { UserMenu } from "@/components/portal/auth/user-menu";
import { AreaShell } from "@/components/ui/area-shell";
import { RoleBadge } from "@/components/auth/role-badge";
import { buildAuditorTenantNav, isAuditorReadOnly } from "@/lib/auth/auditor-nav";
import { filterNavByCrowRole } from "@/lib/auth/permissions";
import { getCrowAuth, isPlatformStaff } from "@/lib/auth/roles";
import { readSareaPreviewPersona } from "@/lib/sarea/preview-cookie";
import { getEnabledErpNavItems } from "@/lib/constants/erp-module-registry";
import { buildTenantNavItems } from "@/lib/constants/sarea-runtime";
import { requireTenantAccess } from "@/lib/auth/session";
import { getSareaRuntimeContext } from "@/lib/services/sarea-runtime.service";
import { routes } from "@/lib/routes";
import { getTenantBySlug } from "@/lib/services/tenant.service";

export default async function TenantLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: slug } = await params;
  const user = await requireTenantAccess(slug);
  const tenant = await getTenantBySlug(slug);

  if (!tenant) {
    notFound();
  }

  const { role } = getCrowAuth(user);
  const previewPersona =
    role && isPlatformStaff(role) ? await readSareaPreviewPersona() : null;
  const runtime = await getSareaRuntimeContext(
    tenant.id,
    user.email ?? "",
    role,
    previewPersona
  );
  const erpNav = getEnabledErpNavItems(slug, tenant.modules);
  const nav = isAuditorReadOnly(role)
    ? buildAuditorTenantNav(slug)
    : filterNavByCrowRole(
        buildTenantNavItems(slug, runtime.navKeys, erpNav),
        role,
        slug
      );

  const r = routes.tenant(slug);

  return (
    <AreaShell
      entity="cem"
      title={`CEM — ${tenant.organization.displayName}`}
      badge="Crow Enterprise Manager"
      experienceBadge={`${runtime.profileName} (${runtime.personaKey})`}
      subtitle={`/${slug} · ${tenant.planKey} · ${runtime.density} density`}
      hubLinks={
        isAuditorReadOnly(role)
          ? [
              { href: routes.admin.audit, entity: "cem", label: "Platform audit" },
              { href: r.cybercrow.dashboard, entity: "cybercrow" },
            ]
          : [
              { href: r.dashboard, entity: "cem", label: "CEM" },
              { href: r.cybercrow.dashboard, entity: "cybercrow" },
              { href: routes.sarea.overview, entity: "sarea" },
            ]
      }
      nav={nav}
      headerActions={
        <div className="flex items-center gap-2">
          <RoleBadge role={role} />
          <UserMenu />
        </div>
      }
      mainClassName={runtime.compact ? "text-sm" : undefined}
    >
      {children}
    </AreaShell>
  );
}
