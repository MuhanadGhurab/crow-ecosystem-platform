import Link from "next/link";
import { HOMEPAGE_CROW_WORKS_STEPS } from "@/lib/constants/homepage";

export function HomepageHowItWorks() {
  return (
    <section id="how-crow-works" className="cc-public-band scroll-mt-20 border-t border-white/[0.04]">
      <div className="cc-safe-x relative mx-auto max-w-6xl py-14 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <span className="cc-star-badge">How Crow works</span>
          <h2 className="cc-section-title mt-4">From request to daily operations</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-400 sm:text-base">
            Five clear steps — what happens after you sign in, through ProCrow preparation and into the
            Business Portal.
          </p>
        </div>

        <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:gap-3">
          {HOMEPAGE_CROW_WORKS_STEPS.map((item, index) => (
            <li
              key={item.step}
              className="group relative flex flex-col rounded-xl border border-white/[0.08] bg-white/[0.02] p-5 transition hover:border-cyan-500/20 hover:bg-white/[0.04]"
            >
              <span className="font-mono text-xs font-bold text-cyan-400/90">{item.step}</span>
              <h3 className="mt-2 font-display text-base font-semibold text-white sm:text-lg">
                {item.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-400">{item.summary}</p>
              {index < HOMEPAGE_CROW_WORKS_STEPS.length - 1 ? (
                <span
                  className="pointer-events-none absolute -end-3 top-1/2 hidden -translate-y-1/2 text-slate-600 lg:inline"
                  aria-hidden
                >
                  →
                </span>
              ) : null}
            </li>
          ))}
        </ol>

        <p className="mt-10 text-center text-sm text-slate-500">
          Full lifecycle map for architects?{" "}
          <Link href="/architecture" className="text-cyan-400 hover:text-cyan-300">
            Explore architecture →
          </Link>
        </p>
      </div>
    </section>
  );
}
