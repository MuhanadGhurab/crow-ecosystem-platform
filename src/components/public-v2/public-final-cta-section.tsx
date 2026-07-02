import Link from "next/link";

import { PublicSection } from "@/components/public-v2/public-section";
import {
  PUBLIC_V2_SECTION_IDS,
  publicV2SectionHref,
} from "@/lib/public-v2/routes";
import { routes } from "@/lib/routes";
import { PUBLIC_V2_MOTION_CLASS } from "@/lib/public-v2/motion";

export function PublicFinalCtaSection() {
  return (
    <PublicSection
      id={PUBLIC_V2_SECTION_IDS.finalCta}
      variant="emphasis"
      title="Start with your organization—not a software package."
      description="Choose your starting journey or discuss your organization with Crow's structured intake."
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
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
          href={routes.public.request}
          className={`text-slate-300 underline-offset-4 transition-colors hover:text-cyan-300 hover:underline ${PUBLIC_V2_MOTION_CLASS.button}`}
        >
          Discuss Your Organization
        </Link>
        <Link
          href={routes.auth.login}
          className={`text-slate-300 underline-offset-4 transition-colors hover:text-cyan-300 hover:underline ${PUBLIC_V2_MOTION_CLASS.button}`}
        >
          Sign In
        </Link>
      </div>
    </PublicSection>
  );
}
