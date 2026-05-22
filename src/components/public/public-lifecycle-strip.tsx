import Link from "next/link";
import { FULL_PLATFORM_LIFECYCLE } from "@/lib/constants/platform";

/** Compact lifecycle chips with CTA to implementation intake. */
export function PublicLifecycleStrip() {
  return (
    <section className="cc-safe-x mx-auto max-w-6xl py-12 sm:py-16">
      <div className="text-center">
        <span className="cc-star-badge">North-star journey</span>
        <h2 className="cc-section-title mt-4">Request → Go-live</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-400">
          One governed path from implementation intake through discovery, blueprint pricing, and
          tenant provisioning.
        </p>
      </div>
      <div className="cc-scroll-chips mt-8 justify-center lg:flex-wrap lg:overflow-visible lg:pb-0">
        <ol className="flex gap-2 lg:flex-wrap lg:justify-center">
          {FULL_PLATFORM_LIFECYCLE.map((label, index) => (
            <li key={label}>
              <span className="inline-flex min-h-[40px] items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-slate-200 backdrop-blur-md">
                <span className="font-mono text-xs font-bold text-cc-star">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {label}
              </span>
            </li>
          ))}
        </ol>
      </div>
      <div className="mt-8 flex justify-center">
        <Link href="/request" className="cc-btn-primary min-w-[14rem]">
          Start implementation request →
        </Link>
      </div>
    </section>
  );
}
