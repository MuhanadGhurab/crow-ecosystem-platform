import Link from "next/link";
import { CROW_PUBLIC_LIFECYCLE_STRIP } from "@/lib/constants/crow-simplified-lifecycle";

/** Compact lifecycle chips with CTA to implementation intake. */
export function PublicLifecycleStrip() {
  return (
    <section className="cc-safe-x mx-auto max-w-6xl py-12 sm:py-16">
      <div className="text-center">
        <span className="cc-star-badge">Full lifecycle</span>
        <h2 className="cc-section-title mt-4">End-to-end journey</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-400">
          Learn Crow, submit a request, complete discovery, review blueprint and proposal, then move
          day-to-day work to the Business Portal — ProCrow prepares everything in between.
        </p>
      </div>
      <div className="cc-scroll-chips mt-8 justify-center lg:flex-wrap lg:overflow-visible lg:pb-0">
        <ol className="flex gap-2 lg:flex-wrap lg:justify-center">
          {CROW_PUBLIC_LIFECYCLE_STRIP.map((step, index) => (
            <li key={step.id}>
              <span className="inline-flex min-h-[40px] items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-slate-200 backdrop-blur-md transition hover:border-cyan-400/30 hover:bg-white/[0.06] hover:text-white">
                <span className="font-mono text-xs font-bold text-cc-star">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {step.label}
              </span>
            </li>
          ))}
        </ol>
      </div>
      <div className="mt-8 flex justify-center">
        <Link href="/request" className="cc-btn-primary min-w-[14rem]">
          Start Enterprise Request →
        </Link>
        <p className="mt-2 text-center text-xs text-slate-500">Sign in to submit · browse freely until then</p>
      </div>
    </section>
  );
}
