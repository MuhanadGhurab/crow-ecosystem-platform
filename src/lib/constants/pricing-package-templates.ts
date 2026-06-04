/**
 * L7 — Advisory package templates (Startup · Growth · Enterprise).
 */

import type { PricingPackageRecommendation, PricingPackageTier } from "@/lib/pricing/pricing-package-contract";

const SHARED_DISCLAIMERS = [
  "Estimated range — not a guaranteed or binding commercial quote.",
  "Final proposal pricing after ProCrow review.",
  "No checkout or subscription activation from this view.",
] as const;

export const PRICING_PACKAGE_SETUP_RANGES: Record<
  PricingPackageTier,
  { lowSar: number; highSar: number; label: string }
> = {
  startup: {
    lowSar: 18_000,
    highSar: 45_000,
    label: "18,000 – 45,000 SAR (estimated setup/onboarding)",
  },
  growth: {
    lowSar: 45_000,
    highSar: 120_000,
    label: "45,000 – 120,000 SAR (estimated setup/onboarding)",
  },
  enterprise: {
    lowSar: 120_000,
    highSar: 280_000,
    label: "120,000 – 280,000 SAR (estimated setup/onboarding)",
  },
};

export const PRICING_PACKAGE_MONTHLY_DIRECTION: Record<
  PricingPackageTier,
  { lowSar: number; highSar: number; label: string }
> = {
  startup: {
    lowSar: 2_500,
    highSar: 8_500,
    label: "≈ 2,500 – 8,500 SAR/mo direction (excl. VAT, before modules/security/SAREA add-ons)",
  },
  growth: {
    lowSar: 6_500,
    highSar: 18_000,
    label: "≈ 6,500 – 18,000 SAR/mo direction (excl. VAT, before add-ons)",
  },
  enterprise: {
    lowSar: 12_000,
    highSar: 35_000,
    label: "≈ 12,000 – 35,000 SAR/mo direction (excl. VAT, before add-ons)",
  },
};

export const PRICING_PACKAGE_TEMPLATES: Record<PricingPackageTier, PricingPackageRecommendation> = {
  startup: {
    tier: "startup",
    label: "Startup package",
    description:
      "Lean CEM footprint for early-stage teams — core modules, lighter workflows, and a simpler SAREA experience with CyberCrow baseline.",
    recommendedFor: "Small employee bands, fewer modules, and light workflow depth.",
    setupScope:
      "Focused discovery alignment, blueprint draft, baseline CyberCrow posture, and essential SAREA profiles.",
    monthlyScope:
      "Lower platform tier direction with room to add modules as operations mature.",
    moduleDepth: "Core modules (typically 2–4) — finance, CRM, or operations anchor.",
    workflowDepth: "Lite approval paths and department starter workflows.",
    cyberCrowDepth: "Standard security baseline — monitoring and access hygiene.",
    sareaDepth: "Simple navigation and role-light dashboards.",
    onboardingDepth: "Guided first 30 days — lean operator coaching.",
    supportDepth: "Business-hours advisory support during onboarding window.",
    pricingPosture: "Estimated pricing favors smaller scope (advisory only).",
    disclaimers: SHARED_DISCLAIMERS,
  },
  growth: {
    tier: "growth",
    label: "Growth package",
    description:
      "Scaling operating model — expanded modules, cross-functional workflows, reporting layer, and role-based SAREA.",
    recommendedFor: "Mid-size bands, broader module selection, and standard workflow depth.",
    setupScope:
      "Deeper ProCrow blueprint review, CyberCrow approval trails, SAREA role mapping, and department modeling.",
    monthlyScope:
      "Medium platform direction reflecting module and workflow expansion.",
    moduleDepth: "Expanded modules (typically 4–7) including finance, procurement, inventory, or logistics.",
    workflowDepth: "Standard approvals, handoffs, and department coordination workflows.",
    cyberCrowDepth:
      "Stronger CyberCrow posture — incidents, evidence-friendly controls, and audit trails.",
    sareaDepth: "Role-based dashboards and department-aware navigation.",
    onboardingDepth: "Structured onboarding playbooks across departments.",
    supportDepth: "Priority onboarding support with operator checkpoints.",
    pricingPosture: "Estimated pricing reflects balanced scope (advisory only).",
    disclaimers: SHARED_DISCLAIMERS,
  },
  enterprise: {
    tier: "enterprise",
    label: "Enterprise package",
    description:
      "Multi-department governance — broad module scope, advanced workflows, deeper reporting, and richer CyberCrow/GRC readiness.",
    recommendedFor: "Large bands, high module/workflow counts, and advanced security/SAREA depth.",
    setupScope:
      "Enterprise blueprint depth, evidence posture, advanced SAREA density, and ProCrow Go/No-Go readiness alignment.",
    monthlyScope:
      "Higher platform direction with enterprise security and experience layers.",
    moduleDepth: "Broad CEM scope (7+ modules) with cross-module reporting expectations.",
    workflowDepth: "Advanced approvals, evidence workflows, and multi-site coordination.",
    cyberCrowDepth:
      "Enterprise CyberCrow/GRC readiness — identity posture, evidence collection, and audit-friendly operations.",
    sareaDepth: "High-density executive and operator views with advanced persona routing.",
    onboardingDepth: "Enterprise onboarding program with staged department rollouts.",
    supportDepth: "Dedicated operator checkpoints and escalation paths during onboarding.",
    pricingPosture: "Estimated pricing reflects enterprise scope (advisory only).",
    disclaimers: SHARED_DISCLAIMERS,
  },
};

export function getPricingPackageTemplate(
  tier: PricingPackageTier
): PricingPackageRecommendation {
  return PRICING_PACKAGE_TEMPLATES[tier];
}

export const PUBLIC_PRICING_PACKAGE_SUMMARY =
  "Startup, Growth, and Enterprise are advisory package templates — your final package follows client-led discovery and ProCrow blueprint review." as const;
