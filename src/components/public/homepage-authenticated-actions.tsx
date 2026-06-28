import Link from "next/link";

import { routes } from "@/lib/routes";

export function HomepageAuthenticatedActions() {
  return (
    <div
      className="mx-auto mt-8 flex max-w-xl flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap"
      role="navigation"
      aria-label="Signed-in client actions"
    >
      <Link href={routes.client.requestNew} className="cc-btn-hero-light min-w-[14rem]">
        Start a Service Request
      </Link>
      <Link
        href={routes.client.requests}
        className="inline-flex min-h-[48px] min-w-[12rem] items-center justify-center rounded-full border border-white/15 bg-white/[0.04] px-6 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/[0.08]"
      >
        View My Requests
      </Link>
      <Link
        href={routes.client.home}
        className="inline-flex min-h-[48px] min-w-[12rem] items-center justify-center rounded-full border border-cyan-500/30 bg-cyan-500/10 px-6 py-3 text-sm font-medium text-cyan-200 transition hover:bg-cyan-500/20"
      >
        Continue Discovery
      </Link>
    </div>
  );
}
