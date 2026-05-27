import { UserMenu } from "@/components/portal/auth/user-menu";
import { RoleBadge } from "@/components/auth/role-badge";
import { AreaShell } from "@/components/ui/area-shell";
import { Permission, hasPermission } from "@/lib/auth/permissions";
import { getCrowAuth } from "@/lib/auth/roles";
import { getSessionUser, requirePlatformConsole } from "@/lib/auth/session";
import { buildPlatformEngineHubLinks } from "@/lib/constants/platform-engine-hub";
import { routes } from "@/lib/routes";

const ADMIN_NAV: { href: string; label: string; permission: (typeof Permission)[keyof typeof Permission] }[] = [
  { href: routes.admin.overview, label: "Overview", permission: Permission["platform.admin.view"] },
  { href: routes.admin.queue, label: "Queue", permission: Permission["platform.admin.view"] },
  { href: routes.admin.goNoGo, label: "Go / No-Go", permission: Permission["platform.admin.view"] },
  { href: routes.admin.operatorConsole, label: "Operator console", permission: Permission["platform.admin.view"] },
  { href: routes.admin.requests, label: "Requests", permission: Permission["platform.requests.view"] },
  { href: routes.admin.discovery, label: "Discovery", permission: Permission["platform.discovery.view"] },
  { href: routes.admin.blueprints, label: "Blueprints", permission: Permission["platform.blueprint.view"] },
  { href: routes.admin.tenants, label: "Tenants", permission: Permission["platform.tenants.manage"] },
  { href: routes.admin.domains, label: "Domains", permission: Permission["platform.admin.view"] },
  { href: routes.admin.integrations, label: "Integrations", permission: Permission["platform.admin.view"] },
  { href: routes.admin.subscriptions, label: "Subscriptions", permission: Permission["platform.requests.view"] },
  { href: routes.admin.securityBaselines, label: "Security Baselines", permission: Permission["platform.admin.view"] },
  { href: routes.admin.notifications, label: "Notifications", permission: Permission["platform.audit.view"] },
  { href: routes.admin.audit, label: "Audit", permission: Permission["platform.audit.view"] },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requirePlatformConsole();
  const user = await getSessionUser();
  const { role } = getCrowAuth(user);
  const nav = ADMIN_NAV.filter((item) => hasPermission(role, item.permission)).map(
    ({ href, label }) => ({ href, label })
  );

  return (
    <AreaShell
      title="ProCrow"
      subtitle="Platform administration · control tower"
      badge="Crow Enterprise Manager"
      hubLinks={buildPlatformEngineHubLinks({ includeAdmin: false })}
      nav={nav.length > 0 ? nav : [{ href: routes.admin.requests, label: "Requests" }]}
      headerActions={
        <div className="flex items-center gap-2">
          <RoleBadge role={role} />
          <UserMenu />
        </div>
      }
    >
      {children}
    </AreaShell>
  );
}
