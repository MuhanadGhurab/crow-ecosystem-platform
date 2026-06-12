import Link from "next/link";
import { HOMEPAGE_BUILT_FOR } from "@/lib/constants/homepage";
import { HomepageSectionHeader } from "@/components/public/homepage-section-header";

export function HomepageBuiltFor() {
  return (
    <section id="built-for" className="cc-home-section scroll-mt-24 border-t border-white/[0.04]">
      <HomepageSectionHeader
        eyebrow="Who it is for"
        title="Built for organizations that need structure and trust"
        description="Crow adapts to your sector during discovery and blueprint — you do not need to understand the full architecture on day one."
      />

      <ul className="mt-12 grid gap-4 sm:grid-cols-2">
        {HOMEPAGE_BUILT_FOR.map((item) => (
          <li key={item.title} className="cc-home-card">
            <h3 className="font-display text-lg font-semibold text-white">{item.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">{item.summary}</p>
          </li>
        ))}
      </ul>

      <p className="mt-10 text-center">
        <Link href="/industries" className="text-sm text-violet-400 hover:text-violet-300">
          See industries we serve →
        </Link>
      </p>
    </section>
  );
}
