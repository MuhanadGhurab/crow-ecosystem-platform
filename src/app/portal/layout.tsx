import Link from "next/link";
import { CrowMark } from "@/components/public/brand/crow-mark";
import { UserMenu } from "@/components/portal/auth/user-menu";
import { StaffPreviewNav } from "@/components/portal/staff-preview-nav";
import { getCrowAuth, isPlatformConsoleRole } from "@/lib/auth/roles";
import { requireClientAccess } from "@/lib/auth/session";
import { routes } from "@/lib/routes";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const user = await requireClientAccess();
  const { role, tenantSlugs } = getCrowAuth(user);
  const staffConsolePreview = isPlatformConsoleRole(role);

  return (
    <div className="cc-starfield cc-noise min-h-[100dvh]">
      <header className="cc-safe-x border-b border-cyan-500/10 bg-cc-elevated/60 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 py-4">
          <div className="flex items-center gap-6">
            <CrowMark href="/" size="sm" showTagline={false} />
            <nav className="hidden gap-4 text-sm sm:flex">
              <Link
                href={routes.portal.requests}
                className="font-medium text-cyan-400 hover:text-cyan-300"
              >
                My requests
              </Link>
              {staffConsolePreview && (
                <Link
                  href={routes.admin.overview}
                  className="font-medium text-teal-400 hover:text-teal-300"
                >
                  CEM Command Center
                </Link>
              )}
            </nav>
          </div>
          <UserMenu />
        </div>
      </header>
      <main className="cc-safe-x mx-auto max-w-5xl py-8 sm:py-12">
        <StaffPreviewNav role={role} tenantSlugs={tenantSlugs} />
        {children}
      </main>
    </div>
  );
}
