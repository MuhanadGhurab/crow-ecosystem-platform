import Link from "next/link";

import { PublicOperatingDiagram } from "@/components/public-v2/public-operating-diagram";
import {
  PUBLIC_V2_PENDING_DESTINATIONS,
  PUBLIC_V2_SECTION_IDS,
  publicV2SectionHref,
} from "@/lib/public-v2/routes";
import { routes } from "@/lib/routes";
import { PUBLIC_V2_MOTION_CLASS } from "@/lib/public-v2/motion";

export function PublicHeroSection() {
  return (
    <section
      id={PUBLIC_V2_SECTION_IDS.hero}
      className="scroll-mt-24 px-4 pb-12 pt-10 sm:px-6 sm:pb-16 sm:pt-14 lg:px-8"
      aria-labelledby="public-v2-hero-heading"
    >
      <div className="mx-auto grid max-w-[1280px] items-center gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-12">
        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400/90">
            Enterprise operating system
          </p>
          <h1
            id="public-v2-hero-heading"
            className="text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl lg:text-[2.65rem]"
          >
            Design how your organization should operate—then build the system around it.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg">
            Crow understands your purpose, people, responsibilities, workflows and trust requirements,
            then turns them into an Enterprise Blueprint and an operational tenant.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href={publicV2SectionHref(PUBLIC_V2_SECTION_IDS.journeyNew)}
              className={`inline-flex min-h-[44px] items-center justify-center rounded-xl bg-cyan-500/20 px-5 py-2.5 text-sm font-semibold text-cyan-100 ring-1 ring-cyan-500/30 transition-colors hover:bg-cyan-500/30 ${PUBLIC_V2_MOTION_CLASS.button}`}
            >
              Build a New Organization
            </Link>
            <Link
              href={publicV2SectionHref(PUBLIC_V2_SECTION_IDS.journeyTransform)}
              className={`inline-flex min-h-[44px] items-center justify-center rounded-xl border border-violet-500/30 bg-violet-500/10 px-5 py-2.5 text-sm font-semibold text-violet-100 transition-colors hover:bg-violet-500/15 ${PUBLIC_V2_MOTION_CLASS.button}`}
            >
              Transform an Existing Organization
            </Link>
          </div>

          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <Link
              href={publicV2SectionHref(PUBLIC_V2_SECTION_IDS.howCrowWorks)}
              className={`text-slate-400 underline-offset-4 transition-colors hover:text-cyan-300 hover:underline ${PUBLIC_V2_MOTION_CLASS.button}`}
            >
              See How Crow Works
            </Link>
            <Link
              href={routes.auth.login}
              className={`text-slate-400 underline-offset-4 transition-colors hover:text-cyan-300 hover:underline ${PUBLIC_V2_MOTION_CLASS.button}`}
            >
              Sign In
            </Link>
          </div>

          <p className="mt-6 text-xs text-slate-600">
            Final destinations{" "}
            <span className="text-slate-500">{PUBLIC_V2_PENDING_DESTINATIONS.newOrganization}</span> and{" "}
            <span className="text-slate-500">{PUBLIC_V2_PENDING_DESTINATIONS.transformExisting}</span>{" "}
            are pending — preview links scroll to journey cards below.
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 sm:p-5 lg:p-6">
          <PublicOperatingDiagram />
        </div>
      </div>
    </section>
  );
}
