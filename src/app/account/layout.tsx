import Link from "next/link";
import { CrowMark } from "@/components/public/brand/crow-mark";
import { requireActivePlatformAccount } from "@/lib/auth/session";
import { routes } from "@/lib/routes";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireActivePlatformAccount();

  return (
    <div className="cc-starfield cc-noise min-h-[100dvh]">
      <header className="border-b border-cyan-500/10 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4 sm:px-6">
          <CrowMark href="/" size="sm" showTagline={false} />
          <nav className="flex gap-4 text-sm">
            <Link
              href={routes.account.profile}
              className="text-slate-400 hover:text-cyan-300"
            >
              Profile
            </Link>
            <Link
              href={routes.account.legal}
              className="text-slate-400 hover:text-cyan-300"
            >
              Legal
            </Link>
            <Link href={routes.auth.signOut} className="text-slate-500 hover:text-slate-300">
              Sign out
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
