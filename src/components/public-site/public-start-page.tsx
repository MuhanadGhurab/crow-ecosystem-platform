"use client";

import Link from "next/link";

import {
  PublicAccessCallout,
  PublicContentPage,
} from "@/components/public-site/public-content-page";
import { PublicClientJourneySteps } from "@/components/public-site/public-client-journey-steps";
import { buildSignupHandoffUrl } from "@/lib/public/journey-handoff";
import { publicRoutes } from "@/lib/public/routes";
import { PUBLIC_V2_MOTION_CLASS } from "@/lib/public-v2/motion";

const JOURNEYS = [
  {
    title: "Build a New Organization",
    description: "For new ideas, startups, divisions, or operations starting from intent.",
    href: publicRoutes.newOrganization,
    cta: buildSignupHandoffUrl("NEW"),
    ctaLabel: "Start Building New",
    accent: "cyan" as const,
  },
  {
    title: "Transform an Existing Organization",
    description: "Map what exists, design the target model, and transition with governance.",
    href: publicRoutes.transformExisting,
    cta: buildSignupHandoffUrl("TRANSFORM"),
    ctaLabel: "Start Transforming",
    accent: "violet" as const,
  },
  {
    title: "Discuss Your Organization",
    description: "Learn about secure intake — sign in only when you begin the client request.",
    href: publicRoutes.request,
    cta: publicRoutes.request,
    ctaLabel: "Continue to secure intake",
    accent: "amber" as const,
  },
] as const;

export function StartPageContent() {
  return (
    <PublicContentPage
      mood="start"
      eyebrow="Choose your journey"
      title="Start Designing"
      description="Explore every public page without signing in. Start the client process only when you choose a conversion action below."
      introExtra={
        <PublicAccessCallout>
          Educational links are public. &quot;Start Building&quot;, &quot;Start Transforming&quot;, and secure
          intake require account sign-in — no business records are created from browsing alone.
        </PublicAccessCallout>
      }
    >
      <PublicClientJourneySteps highlight={["browse", "choose", "signin"]} compact />

      <div className="grid gap-6 lg:grid-cols-3">
        {JOURNEYS.map((j) => (
          <article
            key={j.title}
            className={`pv2-card pv2-card-interactive p-6 ${
              j.accent === "cyan"
                ? "border-[color-mix(in_srgb,var(--pv2-cyan)_28%,var(--pv2-border))]"
                : j.accent === "violet"
                  ? "border-[color-mix(in_srgb,var(--pv2-violet)_28%,var(--pv2-border))]"
                  : "border-[color-mix(in_srgb,var(--pv2-amber)_28%,var(--pv2-border))]"
            }`}
          >
            <h2 className="text-lg font-semibold text-[var(--pv2-text-primary)]">{j.title}</h2>
            <p className="pv2-body mt-2">{j.description}</p>
            <div className="mt-6 flex flex-col gap-2">
              <Link
                href={j.href}
                className={`pv2-btn-secondary text-center ${PUBLIC_V2_MOTION_CLASS.button}`}
              >
                Explore journey
              </Link>
              <Link href={j.cta} className={`pv2-btn-primary text-center ${PUBLIC_V2_MOTION_CLASS.button}`}>
                {j.ctaLabel}
              </Link>
            </div>
          </article>
        ))}
      </div>
    </PublicContentPage>
  );
}
