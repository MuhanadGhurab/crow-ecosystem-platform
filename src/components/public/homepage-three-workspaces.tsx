import Link from "next/link";
import { HOMEPAGE_THREE_WORKSPACES } from "@/lib/constants/homepage";

const ACCENT: Record<string, string> = {
  client: "border-cyan-500/25 hover:border-cyan-500/40",
  business: "border-teal-500/25 hover:border-teal-500/40",
  procrow: "border-violet-500/25 hover:border-violet-500/40",
};

const BADGE: Record<string, string> = {
  client: "text-cyan-300",
  business: "text-teal-300",
  procrow: "text-violet-300",
};

export function HomepageThreeWorkspaces() {
  return (
    <section id="three-workspaces" className="cc-safe-x relative mx-auto max-w-6xl scroll-mt-20 py-14 sm:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <span className="cc-star-badge">Three workspaces</span>
        <h2 className="cc-section-title mt-4">One platform, clear roles</h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-400 sm:text-base">
          Client Portal for request and onboarding. Business Portal for day-to-day work. ProCrow for
          operators who prepare and govern tenant runtime — sign-in required for each.
        </p>
      </div>

      <ul className="mt-10 grid gap-5 md:grid-cols-3">
        {HOMEPAGE_THREE_WORKSPACES.map((workspace) => (
          <li key={workspace.id}>
            <Link
              href={workspace.href}
              className={`flex h-full flex-col rounded-xl border bg-gradient-to-b from-white/[0.04] to-transparent p-6 transition ${ACCENT[workspace.id] ?? ""}`}
            >
              <span className={`text-xs font-semibold uppercase tracking-wider ${BADGE[workspace.id] ?? ""}`}>
                {workspace.name}
              </span>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-300">{workspace.summary}</p>
              <span className="mt-4 text-sm font-medium text-slate-400 transition group-hover:text-white">
                Learn more →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
