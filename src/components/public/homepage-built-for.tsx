import Link from "next/link";
import { HOMEPAGE_BUILT_FOR } from "@/lib/constants/homepage";
import { PublicSectionIntro } from "@/components/public/public-section-intro";

export function HomepageBuiltFor() {
  return (
    <section id="built-for" className="cc-public-band scroll-mt-20">
      <div className="cc-safe-x relative mx-auto max-w-6xl">
        <PublicSectionIntro
          badge="Who it is for"
          title="Built for organizations that need structure and trust"
          description="Crow adapts to your sector during discovery and blueprint — you do not need to understand the full architecture on day one."
        />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {HOMEPAGE_BUILT_FOR.map((item) => (
            <li key={item.title} className="cc-glass-card border-white/10 p-5 sm:p-6">
              <h3 className="font-display text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{item.summary}</p>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-center">
          <Link href="/industries" className="text-sm text-cyan-400 hover:text-cyan-300">
            See industries we serve →
          </Link>
        </p>
      </div>
    </section>
  );
}
