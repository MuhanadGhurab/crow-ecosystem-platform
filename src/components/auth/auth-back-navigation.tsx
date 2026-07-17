"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { routes } from "@/lib/routes";

type AuthBackNavigationProps = {
  homeHref?: string;
  homeLabel?: string;
  showGoBack?: boolean;
};

export function AuthBackNavigation({
  homeHref = routes.public.home,
  homeLabel = "Back to Home",
  showGoBack = true,
}: AuthBackNavigationProps) {
  const router = useRouter();

  return (
    <nav className="mb-6 flex flex-wrap items-center gap-3" aria-label="Authentication navigation">
      <Link
        href={homeHref}
        className="inline-flex items-center rounded-lg border border-slate-700 px-3 py-1.5 text-sm font-medium text-slate-200 hover:border-cyan-500/40 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
      >
        {homeLabel}
      </Link>
      {showGoBack && (
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center rounded-lg px-3 py-1.5 text-sm text-slate-400 hover:text-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
        >
          Go Back
        </button>
      )}
    </nav>
  );
}
