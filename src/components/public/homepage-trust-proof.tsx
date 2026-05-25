import Link from "next/link";
import { HOMEPAGE_TRUST_PROOF } from "@/lib/constants/homepage";
import { PublicSectionIntro } from "@/components/public/public-section-intro";

export function HomepageTrustProof() {
  return (
    <section id="trust" className="cc-safe-x relative mx-auto max-w-6xl scroll-mt-20 py-14 sm:py-20">
      <PublicSectionIntro
        badge="Trust & validation"
        title="Proven paths, honest scope"
        description="We describe what the platform does today — advisory security and governed workflows — without overclaiming certification or full automation."
      />
      <ul className="mt-8 space-y-4">
        {HOMEPAGE_TRUST_PROOF.map((line) => (
          <li
            key={line}
            className="flex gap-3 rounded-xl border border-teal-500/15 bg-teal-950/20 px-4 py-3 text-sm leading-relaxed text-slate-300 sm:px-5 sm:py-4"
          >
            <span className="mt-0.5 text-teal-400" aria-hidden>
              ✓
            </span>
            <span>{line}</span>
          </li>
        ))}
      </ul>
      <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm">
        <Link href="/security" className="cc-btn-secondary">
          Security layer
        </Link>
        <Link href="/pricing" className="cc-btn-secondary">
          See plans
        </Link>
        <Link href="/about" className="text-violet-400 hover:text-violet-300">
          About Crow →
        </Link>
      </div>
    </section>
  );
}
