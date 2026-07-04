"use client";

import Link from "next/link";

import { PublicContentPage } from "@/components/public-site/public-content-page";
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
    description: "Structured intake when you want Crow to understand your context first.",
    href: publicRoutes.request,
    cta: publicRoutes.request,
    ctaLabel: "Discuss Your Organization",
    accent: "amber" as const,
  },
] as const;

export function StartPageContent() {
  return (
    <PublicContentPage
      eyebrow="Choose your journey"
      title="Start Designing"
      description="Explore first — passive browsing does not create business records. Choose Build New, Transform Existing, or discuss your organization when you are ready."
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {JOURNEYS.map((j) => (
          <article
            key={j.title}
            className={`pv2-card p-6 ${
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
              <Link href={j.cta} className={`pv2-btn-primary text-center ${PUBLIC_V2_MOTION_CLASS.button}`}>
                {j.ctaLabel}
              </Link>
              {j.href !== j.cta ? (
                <Link href={j.href} className={`pv2-btn-ghost text-center text-sm ${PUBLIC_V2_MOTION_CLASS.button}`}>
                  Learn more
                </Link>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </PublicContentPage>
  );
}
