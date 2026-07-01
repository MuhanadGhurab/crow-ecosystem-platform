import { HeroSection } from "@/components/public/hero-section";
import { HomepageArchitectsMapPreview } from "@/components/crow-story/homepage-architects-map-preview";
import { HomepageBuiltFor } from "@/components/public/homepage-built-for";
import { HomepageDiscoveryBlueprint } from "@/components/public/homepage-discovery-blueprint";
import { HomepageExploreRow } from "@/components/public/homepage-explore-row";
import { HomepageFinalCta } from "@/components/public/homepage-final-cta";
import { HomepageHowItWorks } from "@/components/public/homepage-how-it-works";
import { HomepageRoadmap } from "@/components/public/homepage-roadmap";
import { HomepageRuntimeEngines } from "@/components/public/homepage-runtime-engines";
import { HomepageThreeWorkspaces } from "@/components/public/homepage-three-workspaces";
import { HomepageTrustProof } from "@/components/public/homepage-trust-proof";
import { getSessionUser } from "@/lib/auth/session";

export default async function HomePage() {
  const user = await getSessionUser();

  return (
    <>
      <HeroSection authenticated={Boolean(user)} />

      <HomepageArchitectsMapPreview />

      <HomepageHowItWorks />

      <HomepageThreeWorkspaces />

      <HomepageRuntimeEngines />

      <HomepageBuiltFor />

      <HomepageTrustProof />

      <HomepageDiscoveryBlueprint />

      <HomepageExploreRow />

      <HomepageRoadmap />

      <HomepageFinalCta />
    </>
  );
}
