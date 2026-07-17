import { PublicBeginsDifferentlySection } from "@/components/public-v2/public-begins-differently-section";
import { PublicBlueprintToWorkspaceSection } from "@/components/public-v2/public-blueprint-to-workspace-section";
import { PublicFinalCtaSection } from "@/components/public-v2/public-final-cta-section";
import { PublicGovernedFoundationSection } from "@/components/public-v2/public-governed-foundation-section";
import { PublicHeroSection } from "@/components/public-v2/public-hero-section";
import { PublicJourneySection } from "@/components/public-v2/public-journey-section";
import { PublicLifecycleExplorer } from "@/components/public-v2/public-lifecycle-explorer";

/** Canonical public homepage — seven sections, bright identity. */
export function PublicHomepage() {
  return (
    <>
      <PublicHeroSection />
      <PublicBeginsDifferentlySection />
      <PublicLifecycleExplorer />
      <PublicJourneySection />
      <PublicBlueprintToWorkspaceSection />
      <PublicGovernedFoundationSection />
      <PublicFinalCtaSection />
    </>
  );
}
