import Image from "next/image";
import Link from "next/link";

import { CrowMotif } from "@/components/public/crow-motif";
import {
  HOMEPAGE_HERO_EXPLAINER,
  HOMEPAGE_HERO_HEADLINE,
  HOMEPAGE_HERO_SUBHEADLINE,
} from "@/lib/constants/homepage";

/** Homepage hero wordmark — not used in nav, favicon, or app chrome. */
export const CYBERCROW_HERO_IMAGE = "/images/cybercrow-hero.png";

const HERO_IMAGE_WIDTH = 1024;
const HERO_IMAGE_HEIGHT = 682;

export function HeroSection() {
  return (
    <section
      className="relative min-h-[78vh] overflow-hidden px-4 pb-14 pt-8 sm:px-6 sm:pb-16 sm:pt-12 lg:min-h-[82vh] lg:px-8"
      aria-labelledby="hero-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        aria-hidden
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
        }}
      />
      <div
        className="pointer-events-none absolute left-[14%] top-[12%] h-3 w-3 animate-cc-pulse-soft rounded-full bg-white shadow-cc-star"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_100%_80%_at_50%_-30%,rgba(139,92,246,0.18),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_100%_0%,rgba(34,211,238,0.1),transparent_50%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_40%_30%_at_0%_80%,rgba(251,113,133,0.08),transparent_50%)]" />
      <CrowMotif
        variant="silhouette"
        className="pointer-events-none absolute end-[10%] top-[18%] hidden h-16 w-20 opacity-30 md:block lg:end-[14%] lg:top-[22%]"
      />
      <CrowMotif
        variant="constellation"
        className="pointer-events-none absolute start-[8%] top-[28%] hidden h-14 w-20 opacity-25 lg:block"
      />

      <div className="relative mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center lg:gap-12">
          <div className="order-1 flex min-w-0 flex-col items-center text-center lg:items-start lg:text-start">
            <span className="cc-star-badge">Crow Ecosystem · Enterprise orchestration</span>
            <h1
              id="hero-heading"
              className="mt-6 max-w-4xl font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl"
            >
              {HOMEPAGE_HERO_HEADLINE}
            </h1>
            <p className="mt-4 max-w-2xl text-lg font-medium text-slate-300 sm:text-xl">
              {HOMEPAGE_HERO_SUBHEADLINE}
            </p>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
              {HOMEPAGE_HERO_EXPLAINER}
            </p>

            <div className="mt-10 flex w-full max-w-md flex-col gap-3 sm:max-w-none sm:flex-row sm:flex-wrap sm:justify-center lg:justify-start">
              <Link href="/request" className="cc-btn-primary w-full px-8 sm:w-auto">
                Start an Enterprise Request →
              </Link>
              <Link href="/architecture" className="cc-btn-secondary w-full sm:w-auto">
                Explore the Architecture
              </Link>
              <Link
                href="/security"
                className="w-full text-center text-sm font-medium text-violet-400 transition hover:text-violet-300 sm:w-auto sm:px-4"
              >
                View Security Layer →
              </Link>
            </div>
          </div>

          <div className="order-2 flex min-w-0 justify-center pt-6 sm:pt-8 lg:order-2 lg:justify-end lg:pt-0">
            <div className="group relative w-full max-w-[min(100%,280px)] sm:max-w-[320px] lg:max-w-[440px] xl:max-w-[500px]">
              <div
                className="pointer-events-none absolute left-1/2 top-1/2 h-[75%] w-[95%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/20 blur-3xl"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute left-1/2 top-[45%] h-[55%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/15 blur-3xl"
                aria-hidden
              />
              <div className="relative overflow-hidden rounded-2xl ring-1 ring-cyan-500/20 shadow-[0_12px_48px_rgba(34,211,238,0.14)] transition-transform duration-500 ease-out group-hover:scale-[1.02] lg:rounded-3xl">
                <Image
                  src={CYBERCROW_HERO_IMAGE}
                  alt="CyberCrow — security and trust layer in the Crow Ecosystem"
                  width={HERO_IMAGE_WIDTH}
                  height={HERO_IMAGE_HEIGHT}
                  priority
                  sizes="(max-width: 640px) 280px, (max-width: 1024px) 320px, 500px"
                  className="cc-hero-brand-img relative mx-auto h-auto w-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
