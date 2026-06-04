/**
 * L7 — Advisory Startup / Growth / Enterprise pricing package templates.
 * Not live payments, checkout, or final legal quotes.
 */

export type PricingPackageTier = "startup" | "growth" | "enterprise";

export type ClientPackageChangeType =
  | "keep_recommended"
  | "downscale"
  | "upscale"
  | "request_custom";

export type PricingPackageRecommendation = {
  tier: PricingPackageTier;
  label: string;
  description: string;
  recommendedFor: string;
  setupScope: string;
  monthlyScope: string;
  moduleDepth: string;
  workflowDepth: string;
  cyberCrowDepth: string;
  sareaDepth: string;
  onboardingDepth: string;
  supportDepth: string;
  pricingPosture: string;
  disclaimers: readonly string[];
};

export type PricingPackageSignal = {
  key: string;
  label: string;
  value: string;
  influence: "low" | "medium" | "high";
  reason: string;
};

export type PricingPackageEstimate = {
  recommendedTier: PricingPackageTier;
  alternativeTiers: PricingPackageTier[];
  recommendation: PricingPackageRecommendation;
  signals: PricingPackageSignal[];
  setupEstimateRange: string;
  monthlyEstimateRange: string;
  discoverySource: "accepted_into_blueprint" | "submitted_or_reviewing" | "draft" | "request_only";
  discoverySourceNote: string;
  notFinalQuoteDisclaimer: string;
  finalQuoteRequiresProCrowReview: string;
  packageChangeOptions: readonly ClientPackageChangeType[];
};

export type ClientPackagePreference = {
  selectedTier: PricingPackageTier | null;
  requestedChangeType: ClientPackageChangeType;
  clientNotes: string | null;
  recordedAt: string | null;
};

export const PRICING_PACKAGE_NOT_FINAL_DISCLAIMER =
  "Estimated ranges are advisory. Final proposal pricing is issued by ProCrow after discovery review and blueprint alignment." as const;

export const PRICING_PACKAGE_FINAL_QUOTE_NOTE =
  "Final quote requires ProCrow review — not a guaranteed price or binding offer." as const;

export const PRICING_PACKAGE_CHANGE_OPTIONS: readonly ClientPackageChangeType[] = [
  "keep_recommended",
  "downscale",
  "upscale",
  "request_custom",
] as const;

export const CLIENT_PACKAGE_CHANGE_LABELS: Record<ClientPackageChangeType, string> = {
  keep_recommended: "Keep recommended package",
  downscale: "Request downscale",
  upscale: "Request upscale",
  request_custom: "Request custom package review",
};
