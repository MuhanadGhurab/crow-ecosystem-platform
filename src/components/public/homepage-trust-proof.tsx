import Link from "next/link";
import { HOMEPAGE_TRUST_PROOF } from "@/lib/constants/homepage";
import { HomepageSectionHeader } from "@/components/public/homepage-section-header";

export function HomepageTrustProof() {
  return (
    <section id="trust" className="cc-home-section scroll-mt-24">
      <HomepageSectionHeader
        eyebrow="Trust & validation"
        title="Proven paths, honest scope"
        description="We describe what the platform does today — advisory security and governed workflows — without overclaiming certification or full automation."
      />

      <article className="cc-home-card mx-auto mt-12 max-w-3xl">
        <ul className="space-y-4">
          {HOMEPAGE_TRUST_PROOF.map((line) => (
            <li key={line} className="flex gap-3 text-sm leading-relaxed text-slate-300">
              <span className="mt-0.5 text-teal-400" aria-hidden>
                ✓
              </span>
              <span>{line}</span>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap gap-3 border-t border-white/[0.06] pt-8">
          <Link href="/security" className="cc-btn-secondary text-sm">
            Security layer
          </Link>
          <Link href="/pricing" className="cc-btn-secondary text-sm">
            See plans
          </Link>
          <Link href="/about" className="inline-flex items-center text-sm text-violet-400 hover:text-violet-300">
            About Crow →
          </Link>
        </div>
      </article>
    </section>
  );
}
