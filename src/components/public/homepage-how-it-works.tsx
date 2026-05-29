import Link from "next/link";
import { HOMEPAGE_HOW_IT_WORKS } from "@/lib/constants/homepage";
import { PublicSectionIntro } from "@/components/public/public-section-intro";

export function HomepageHowItWorks() {
  return (
    <section id="how-it-works" className="cc-public-band scroll-mt-20">
      <div className="cc-safe-x relative mx-auto max-w-6xl">
        <PublicSectionIntro
          badge="How it works"
          title="From signed-in request to tenant runtime"
          description="Six clear steps — what happens after you sign in and submit, through ProCrow review and governed go-live."
        />
        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {HOMEPAGE_HOW_IT_WORKS.map((item) => (
            <li
              key={item.step}
              className="cc-glass-card relative flex flex-col border-white/10 p-5 sm:p-6"
            >
              <span className="font-mono text-xs font-bold text-cc-star">{item.step}</span>
              <h3 className="mt-3 font-display text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-400">{item.summary}</p>
            </li>
          ))}
        </ol>
        <p className="mt-8 text-center text-sm text-slate-500">
          Want the full technical map?{" "}
          <Link href="/architecture" className="text-cyan-400 hover:text-cyan-300">
            Explore the architecture →
          </Link>
        </p>
      </div>
    </section>
  );
}
