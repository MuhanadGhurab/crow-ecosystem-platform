import { UserMenu } from "@/components/portal/auth/user-menu";
import { AreaShell } from "@/components/ui/area-shell";
import { requirePlatformStaff } from "@/lib/auth/session";
import { routes } from "@/lib/routes";

export default async function SareaLayout({ children }: { children: React.ReactNode }) {
  await requirePlatformStaff();
  const nav = [
    { href: routes.sarea.overview, label: "Overview" },
    { href: routes.sarea.profiles, label: "Profiles" },
    { href: routes.sarea.layouts, label: "Layouts" },
    { href: routes.sarea.roleMapping, label: "Role mapping" },
    { href: routes.sarea.rules, label: "Rules" },
    { href: routes.sarea.widgets, label: "Widgets" },
    { href: routes.sarea.navigation, label: "Navigation" },
    { href: routes.sarea.deviceRules, label: "Device rules" },
    { href: routes.sarea.preview, label: "Preview" },
  ];

  return (
    <AreaShell
      entity="sarea"
      title="SAREA Experience Studio"
      badge="Smart Adaptive Role Experience"
      subtitle="Personas · layouts · widgets · adaptive UI rules"
      hubLinks={[
        { href: routes.admin.overview, entity: "cem", label: "Admin" },
        { href: routes.sarea.overview, entity: "sarea" },
      ]}
      nav={nav}
      headerActions={<UserMenu />}
    >
      {children}
    </AreaShell>
  );
}
