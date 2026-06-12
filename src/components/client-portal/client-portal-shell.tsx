import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { ClientPortalNavLinks } from "@/components/client-portal/client-portal-nav-links";
import { CrowMark } from "@/components/public/brand/crow-mark";
import { StaffPreviewNav } from "@/components/portal/staff-preview-nav";
import { UserMenu } from "@/components/portal/auth/user-menu";
import { CLIENT_PORTAL_UTILITY_LINKS } from "@/lib/constants/client-portal-nav";
import { getCrowAuth, isPlatformConsoleRole } from "@/lib/auth/roles";
import { routes } from "@/lib/routes";

type Props = {
  user: User;
  children: React.ReactNode;
};

export function ClientPortalShell({ user, children }: Props) {
  const { role, tenantSlugs } = getCrowAuth(user);
  const staffConsolePreview = isPlatformConsoleRole(role);

  return (
    <div className="cc-starfield cc-noise min-h-[100dvh]">
      <header className="cc-client-portal-float">
        <div className="cc-client-portal-shell">
          <div className="cc-client-portal-logo-wrap">
            <CrowMark href={routes.client.home} size="sm" showTagline={false} />
          </div>

          <ClientPortalNavLinks staffConsolePreview={staffConsolePreview} />

          <div className="flex shrink-0 items-center gap-2 border-l border-white/[0.06] pl-2 lg:pl-3">
            {staffConsolePreview && (
              <Link
                href={CLIENT_PORTAL_UTILITY_LINKS.procrowConsole}
                className="hidden text-xs text-violet-300/90 hover:text-violet-200 xl:inline"
              >
                ProCrow
              </Link>
            )}
            <UserMenu />
          </div>
        </div>
      </header>

      <main className="cc-client-portal-main">
        <StaffPreviewNav role={role} tenantSlugs={tenantSlugs} />
        {children}
      </main>
    </div>
  );
}
