import Link from "next/link";

import { PublicSection } from "@/components/public-v2/public-section";
import { publicRoutes } from "@/lib/public/routes";
import { PUBLIC_V2_SECTION_IDS } from "@/lib/public-v2/routes";
import { routes } from "@/lib/routes";
import { PUBLIC_V2_MOTION_CLASS } from "@/lib/public-v2/motion";

export function PublicFinalCtaSection() {
  return (
    <PublicSection
      id={PUBLIC_V2_SECTION_IDS.finalCta}
      band="gold"
      variant="emphasis"
      title="Start with your organization—not a software package."
      description="Choose your starting journey or discuss your organization with Crow's structured intake."
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
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
        <Link href={routes.public.request} className={`pv2-link ${PUBLIC_V2_MOTION_CLASS.button}`}>
          Discuss Your Organization
        </Link>
        <Link href={routes.auth.login} className={`pv2-link ${PUBLIC_V2_MOTION_CLASS.button}`}>
          Sign In
        </Link>
      </div>
    </PublicSection>
  );
}
