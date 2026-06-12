import { HeroSection } from "@/components/public/hero-section";
import { HomepageBuiltFor } from "@/components/public/homepage-built-for";
import { HomepageDiscoveryBlueprint } from "@/components/public/homepage-discovery-blueprint";
import { HomepageExploreRow } from "@/components/public/homepage-explore-row";
import { HomepageFinalCta } from "@/components/public/homepage-final-cta";
import { HomepageHowItWorks } from "@/components/public/homepage-how-it-works";
import { HomepageRoadmap } from "@/components/public/homepage-roadmap";
import { HomepageRuntimeEngines } from "@/components/public/homepage-runtime-engines";
import { HomepageThreeWorkspaces } from "@/components/public/homepage-three-workspaces";
import { HomepageTrustProof } from "@/components/public/homepage-trust-proof";

export default function HomePage() {
  return (
    <>
      <HeroSection />

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
