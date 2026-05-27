import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { CrowMark } from "@/components/public/brand/crow-mark";
import { UserMenu } from "@/components/portal/auth/user-menu";
import { StaffPreviewNav } from "@/components/portal/staff-preview-nav";
import { getCrowAuth, isPlatformConsoleRole } from "@/lib/auth/roles";
import { routes } from "@/lib/routes";

const NAV = [
  { href: routes.client.home, label: "Overview" },
  { href: routes.client.profile, label: "Profile" },
  { href: routes.client.company, label: "Company" },
  { href: routes.client.requests, label: "Requests" },
  { href: routes.client.proposals, label: "Proposals" },
  { href: routes.client.onboarding, label: "Onboarding" },
  { href: routes.client.settings, label: "Settings" },
] as const;

type Props = {
  user: User;
  children: React.ReactNode;
};

export function ClientPortalShell({ user, children }: Props) {
  const { role, tenantSlugs } = getCrowAuth(user);
  const staffConsolePreview = isPlatformConsoleRole(role);

  return (
    <div className="cc-starfield cc-noise min-h-[100dvh]">
      <header className="cc-safe-x border-b border-teal-500/15 bg-cc-elevated/60 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <CrowMark href="/" size="sm" showTagline={false} />
            <nav className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-slate-400 hover:text-teal-200"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href={`${routes.portal.requests}?preview=client`}
              className="hidden text-xs text-slate-500 hover:text-slate-300 sm:inline"
            >
              Legacy portal
            </Link>
            {staffConsolePreview && (
              <Link
                href={routes.admin.overview}
                className="text-xs font-medium text-teal-400 hover:text-teal-300"
              >
                ProCrow console
              </Link>
            )}
            <UserMenu />
          </div>
        </div>
      </header>
      <main className="cc-safe-x mx-auto max-w-5xl py-8 sm:py-12">
        <StaffPreviewNav role={role} tenantSlugs={tenantSlugs} />
        {children}
      </main>
    </div>
  );
}
