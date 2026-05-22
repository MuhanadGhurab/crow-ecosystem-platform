import Link from "next/link";
import { CrowMark } from "@/components/public/brand/crow-mark";
import { UserMenu } from "@/components/portal/auth/user-menu";
import { requireClientAccess } from "@/lib/auth/session";
import { routes } from "@/lib/routes";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  await requireClientAccess();

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
            </nav>
          </div>
          <UserMenu />
        </div>
      </header>
      <main className="cc-safe-x mx-auto max-w-5xl py-8 sm:py-12">{children}</main>
    </div>
  );
}
