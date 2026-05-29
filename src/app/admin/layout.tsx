import { UserMenu } from "@/components/portal/auth/user-menu";
import { RoleBadge } from "@/components/auth/role-badge";
import { AreaShell, type NavGroup } from "@/components/ui/area-shell";
import { Permission, hasPermission } from "@/lib/auth/permissions";
import { getCrowAuth } from "@/lib/auth/roles";
import { getSessionUser, requirePlatformConsole } from "@/lib/auth/session";
import { buildPlatformEngineHubLinks } from "@/lib/constants/platform-engine-hub";
import { PROCROW_ADMIN_NAV_GROUPS } from "@/lib/constants/procrow-admin-nav";
import { routes } from "@/lib/routes";

function buildProcrowNavGroups(role: ReturnType<typeof getCrowAuth>["role"]): NavGroup[] {
  const groups: NavGroup[] = [];
  for (const group of PROCROW_ADMIN_NAV_GROUPS) {
    const items = group.items
      .filter((item) => hasPermission(role, item.permission))
      .map(({ href, label }) => ({ href, label }));
    if (items.length > 0) {
      groups.push({ heading: group.heading, items });
    }
  }
  return groups;
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requirePlatformConsole();
  const user = await getSessionUser();
  const { role } = getCrowAuth(user);
  // Nav routes: routes.admin.queue · routes.admin.goNoGo · routes.admin.operatorConsole (PROCROW_ADMIN_NAV_GROUPS)
  const navGroups = buildProcrowNavGroups(role);
  const fallbackNav =
    navGroups.length > 0
      ? navGroups
      : [
          {
            heading: "Customer flow",
            items: [{ href: routes.admin.requests, label: "Requests" }],
          },
        ];

  return (
    <AreaShell
      title="ProCrow"
      subtitle="Platform administration · control tower"
      badge="Crow Enterprise Manager"
      hubLinks={buildPlatformEngineHubLinks({ includeAdmin: false })}
      navGroups={fallbackNav}
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
