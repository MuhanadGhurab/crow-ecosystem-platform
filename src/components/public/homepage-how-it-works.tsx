import Link from "next/link";
import { CROW_PUBLIC_LIFECYCLE_STRIP } from "@/lib/constants/crow-simplified-lifecycle";
import { HOMEPAGE_CROW_WORKS_STEPS } from "@/lib/constants/homepage";
import { HomepageSectionHeader } from "@/components/public/homepage-section-header";

export function HomepageHowItWorks() {
  return (
    <section id="how-crow-works" className="cc-home-section scroll-mt-24">
      <HomepageSectionHeader
        eyebrow="How Crow works"
        title="From request to daily operations"
        description="Five clear steps — what happens after you sign in, through ProCrow preparation and into the Business Portal."
      />

      <div className="cc-home-chip-row mt-10">
        <ol className="flex gap-2 sm:flex-wrap sm:justify-center">
          {CROW_PUBLIC_LIFECYCLE_STRIP.map((step, index) => (
            <li key={step.id}>
              <span className="cc-home-chip">
                <span className="font-mono text-[10px] font-bold text-violet-400">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {step.label}
              </span>
            </li>
          ))}
        </ol>
      </div>

      <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:gap-3">
        {HOMEPAGE_CROW_WORKS_STEPS.map((item) => (
          <li key={item.step} className="cc-home-card">
            <span className="font-mono text-xs font-bold text-violet-400/90">{item.step}</span>
            <h3 className="mt-3 font-display text-base font-semibold text-white sm:text-lg">
              {item.title}
            </h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-400">{item.summary}</p>
          </li>
        ))}
      </ol>

      <p className="mt-10 text-center text-sm text-slate-500">
        Full lifecycle map for architects?{" "}
        <Link href="/architecture" className="text-violet-400 hover:text-violet-300">
          Explore architecture →
        </Link>
      </p>
    </section>
  );
}
