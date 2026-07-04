import Link from "next/link";

import { PublicOperatingDiagram } from "@/components/public-v2/public-operating-diagram";
import { publicRoutes } from "@/lib/public/routes";
import { PUBLIC_V2_SECTION_IDS } from "@/lib/public-v2/routes";
import { routes } from "@/lib/routes";
import { PUBLIC_V2_MOTION_CLASS } from "@/lib/public-v2/motion";

const TRUST_INDICATORS = [
  "Organization-first design",
  "Blueprint before build",
  "Governed runtime",
] as const;

export function PublicHeroSection() {
  return (
    <section
      id={PUBLIC_V2_SECTION_IDS.hero}
      className="pv2-section-band scroll-mt-24 pb-12 pt-10 sm:pb-14 sm:pt-12"
      aria-labelledby="public-v2-hero-heading"
    >
      <div className="pv2-section-inner">
        <div className="pv2-hero-panel pv2-hero-energy grid items-center gap-10 p-6 sm:p-8 lg:grid-cols-[1fr_1.05fr] lg:gap-12 lg:p-10">
        <div>
          <p className="pv2-eyebrow mb-3">Enterprise operating system</p>
          <h1 id="public-v2-hero-heading" className="pv2-h1">
            Design how your organization should operate—then build the system around it.
          </h1>
          <p className="pv2-lead mt-5 max-w-xl">
            Crow understands your purpose, people, responsibilities, workflows and trust requirements,
            then turns them into an Enterprise Blueprint and an operational tenant.
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
              className={`pv2-btn-primary ${PUBLIC_V2_MOTION_CLASS.button}`}
            >
              Build a New Organization
            </Link>
            <Link
              href={publicRoutes.transformExisting}
              className={`pv2-btn-secondary ${PUBLIC_V2_MOTION_CLASS.button}`}
            >
              Transform an Existing Organization
            </Link>
          </div>

          <div className="mt-4 flex flex-wrap gap-4 text-sm">
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
        </div>

        <div className="pv2-hero-panel p-4 sm:p-6 lg:p-7">
          <PublicOperatingDiagram />
        </div>
        </div>
      </div>
    </section>
  );
}
