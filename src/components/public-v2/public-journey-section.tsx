import { PublicJourneyCard } from "@/components/public-v2/public-journey-card";
import { PublicSection } from "@/components/public-v2/public-section";
import { PUBLIC_V2_SECTION_IDS } from "@/lib/public-v2/routes";

export function PublicJourneySection() {
  return (
    <PublicSection
      id={PUBLIC_V2_SECTION_IDS.journeys}
      eyebrow="Starting conditions"
      title="Build new or transform existing"
      description="Two related journeys with different starting points — both lead to an approved Enterprise Blueprint and governed tenant."
      band="purple"
    >
      <div className="pv2-journey-split">
        <PublicJourneyCard kind="NEW" />
        <PublicJourneyCard kind="TRANSFORM" />
      </div>
    </PublicSection>
  );
}
