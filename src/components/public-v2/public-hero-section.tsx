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
      className="scroll-mt-24 px-4 pb-12 pt-8 sm:px-6 sm:pb-14 sm:pt-10 lg:px-8"
      aria-labelledby="public-v2-hero-heading"
    >
      <div className="mx-auto grid max-w-[1280px] items-center gap-8 lg:grid-cols-[1fr_1.08fr] lg:gap-10">
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
              <li
                key={item}
                className="rounded-full border border-[var(--pv2-border)] bg-[var(--pv2-surface)] px-3 py-1 text-xs font-medium text-[var(--pv2-text-secondary)] shadow-sm"
              >
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

        <div className="pv2-card p-4 sm:p-5 lg:p-6">
          <PublicOperatingDiagram />
        </div>
      </div>
    </section>
  );
}
