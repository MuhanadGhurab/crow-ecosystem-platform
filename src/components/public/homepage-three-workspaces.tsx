import Link from "next/link";
import { HOMEPAGE_THREE_WORKSPACES } from "@/lib/constants/homepage";
import { HomepageCardArrow } from "@/components/public/homepage-card-arrow";
import { HomepageSectionHeader } from "@/components/public/homepage-section-header";

const BADGE: Record<string, string> = {
  client: "text-cyan-300",
  business: "text-teal-300",
  procrow: "text-violet-300",
};

export function HomepageThreeWorkspaces() {
  return (
    <section id="three-workspaces" className="cc-home-section scroll-mt-24 border-t border-white/[0.04]">
      <HomepageSectionHeader
        eyebrow="Three workspaces"
        title="One platform, clear roles"
        description="Client Portal for request and onboarding. Business Portal for day-to-day work. ProCrow for operators who prepare and govern tenant runtime — sign-in required for each."
      />

      <ul className="mt-12 grid gap-4 md:grid-cols-3">
        {HOMEPAGE_THREE_WORKSPACES.map((workspace) => (
          <li key={workspace.id}>
            <Link href={workspace.href} className="cc-home-card">
              <span className={`cc-home-card-badge ${BADGE[workspace.id] ?? ""}`}>
                {workspace.name}
              </span>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-300">{workspace.summary}</p>
              <div className="mt-6 flex items-end justify-between gap-3">
                <span className="text-sm font-medium text-slate-400">Learn more</span>
                <HomepageCardArrow />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
