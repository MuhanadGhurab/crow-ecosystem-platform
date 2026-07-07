import Link from "next/link";

import { PublicHeroTransformationVisual } from "@/components/public-v2/public-hero-transformation-visual";
import { publicRoutes } from "@/lib/public/routes";
import { PUBLIC_V2_SECTION_IDS } from "@/lib/public-v2/routes";
import { routes } from "@/lib/routes";
import { PUBLIC_V2_MOTION_CLASS } from "@/lib/public-v2/motion";
import { PUBLIC_V2_JOURNEY_CTA_CLASS } from "@/lib/public-v2/tokens";

const TRUST_INDICATORS = [
  "Organization-first design",
  "Blueprint before build",
  "Governed runtime",
] as const;

const FLOW_SUMMARY = [
  "Crow designs the organization first",
  "The Operating Model is the bridge",
  "The Enterprise Blueprint becomes the build source",
  "The Runtime is the operational tenant",
] as const;

export function PublicHeroSection() {
  return (
    <section
      id={PUBLIC_V2_SECTION_IDS.hero}
      className="pv2-signature-hero scroll-mt-24"
      aria-labelledby="public-v2-hero-heading"
    >
      <div className="pv2-signature-hero-atmosphere pointer-events-none" aria-hidden />
      <div className="pv2-signature-hero-grid pointer-events-none" aria-hidden />

      <div className="pv2-section-inner relative z-[1] pb-14 pt-8 sm:pb-16 sm:pt-10 lg:pb-20 lg:pt-12">
        <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-8 xl:gap-10">
          <div className="min-w-0 lg:col-span-5 xl:col-span-4">
            <p className="pv2-eyebrow mb-3">Enterprise operating system</p>
            <h1 id="public-v2-hero-heading" className="pv2-h1 pv2-signature-hero-headline">
              Design how your organization should operate—then build the system around it.
            </h1>
            <p className="pv2-lead mt-5 max-w-xl">
              Crow understands your purpose, people, responsibilities, workflows, and trust
              requirements—then turns them into an Enterprise Blueprint and an operational tenant.
            </p>

            <ul className="mt-6 flex flex-wrap gap-2" role="list" aria-label="Service indicators">
              {TRUST_INDICATORS.map((item) => (
                <li key={item} className="pv2-trust-pill">
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href={publicRoutes.newOrganization}
                className={`${PUBLIC_V2_JOURNEY_CTA_CLASS} ${PUBLIC_V2_MOTION_CLASS.button}`}
              >
                Build a New Organization
              </Link>
              <Link
                href={publicRoutes.transformExisting}
                className={`pv2-btn-transform ${PUBLIC_V2_MOTION_CLASS.button}`}
              >
                Transform an Existing Organization
              </Link>
            </div>

            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
              <Link
                href={publicRoutes.howCrowWorks}
                className={`pv2-link ${PUBLIC_V2_MOTION_CLASS.button}`}
              >
                See How Crow Works
              </Link>
              <Link href={routes.auth.login} className={`pv2-link ${PUBLIC_V2_MOTION_CLASS.button}`}>
                Sign In
              </Link>
            </div>

            <ul className="pv2-hero-insight-list mt-8 hidden max-w-xl lg:block" role="list">
              {FLOW_SUMMARY.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>

          <div className="min-w-0 lg:col-span-7 xl:col-span-8">
            <PublicHeroTransformationVisual />
          </div>
        </div>

        <div className="pv2-hero-section-bridge" aria-hidden />
      </div>
    </section>
  );
}
