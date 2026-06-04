import "@/lib/server-only-guard";

import type { User } from "@supabase/supabase-js";
import { CLIENT_DISCOVERY_SECTION } from "@/lib/client-portal/client-discovery-contract";
import type { ClientDiscoveryStageTemplate } from "@/lib/client-portal/client-discovery-contract";
import { getClientDiscoveryStageTemplate } from "@/lib/constants/client-discovery-stage-templates";
import {
  PRICING_PACKAGE_MONTHLY_DIRECTION,
  PRICING_PACKAGE_SETUP_RANGES,
  getPricingPackageTemplate,
} from "@/lib/constants/pricing-package-templates";
import {
  PRICING_PACKAGE_CHANGE_OPTIONS,
  PRICING_PACKAGE_FINAL_QUOTE_NOTE,
  PRICING_PACKAGE_NOT_FINAL_DISCLAIMER,
  type ClientPackageChangeType,
  type ClientPackagePreference,
  type PricingPackageEstimate,
  type PricingPackageSignal,
  type PricingPackageTier,
} from "@/lib/pricing/pricing-package-contract";
import { parseClientDiscoveryStatusFromAnswers } from "@/lib/constants/runtime-readiness-wording";
import { prisma } from "@/lib/db";
import { buildDraftFromContext } from "@/lib/services/client-discovery.service";
import {
  calculateMonthlyEstimate,
  formatSar,
} from "@/lib/services/pricing.service";
import { upsertDiscoveryAnswer } from "@/lib/services/discovery.service";
import { submitClientReviewNote } from "@/lib/services/client-review-notes.service";

export type PricingPackageDiscoveryInput = {
  companyStageTemplate: ClientDiscoveryStageTemplate | null;
  employeeBand: string | null;
  industryTemplate: string | null;
  moduleCount: number;
  departmentCount: number;
  roleCount: number;
  workflowCount: number;
  securityPreference: string | null;
  sareaPreference: string | null;
  clientNotes: string | null;
};

function parseAnswerString(
  answers: { sectionKey: string; questionKey: string; valueJson: unknown }[],
  questionKey: string
): string | null {
  const row = answers.find(
    (a) => a.sectionKey === CLIENT_DISCOVERY_SECTION && a.questionKey === questionKey
  );
  if (!row) return null;
  const v = row.valueJson;
  if (typeof v === "string") return v.trim() || null;
  return null;
}

function employeeBandScore(band: string | null): number {
  if (!band) return 0;
  if (band.includes("500") || band.includes("201")) return 4;
  if (band.includes("200") || band.includes("250") || band.includes("51")) return 2;
  if (band.includes("11") || band.includes("50")) return 1;
  return 0;
}

function depthScore(text: string | null): number {
  if (!text) return 0;
  const t = text.toLowerCase();
  let s = Math.min(text.length / 80, 2);
  if (t.includes("enterprise") || t.includes("evidence") || t.includes("grc")) s += 2;
  if (t.includes("advanced") || t.includes("approval") || t.includes("audit")) s += 1;
  return s;
}

function recommendTier(input: PricingPackageDiscoveryInput): PricingPackageTier {
  if (input.companyStageTemplate === "enterprise") return "enterprise";
  if (input.companyStageTemplate === "growth") {
    if (input.moduleCount >= 7 || input.workflowCount >= 6) return "enterprise";
    return "growth";
  }
  if (input.companyStageTemplate === "startup") {
    if (input.moduleCount <= 3 && input.workflowCount <= 3 && employeeBandScore(input.employeeBand) <= 1) {
      return "startup";
    }
    return input.moduleCount >= 5 ? "growth" : "startup";
  }

  let score = 0;
  score += employeeBandScore(input.employeeBand);
  score += Math.min(input.moduleCount, 10) * 0.6;
  score += Math.min(input.workflowCount, 10) * 0.4;
  score += Math.min(input.departmentCount, 8) * 0.25;
  score += depthScore(input.securityPreference);
  score += depthScore(input.sareaPreference);
  if (input.industryTemplate && input.industryTemplate !== "general") score += 0.5;

  if (score < 4) return "startup";
  if (score < 8) return "growth";
  return "enterprise";
}

function buildSignals(input: PricingPackageDiscoveryInput, tier: PricingPackageTier): PricingPackageSignal[] {
  const signals: PricingPackageSignal[] = [];

  if (input.employeeBand) {
    signals.push({
      key: "employee_band",
      label: "Employee band",
      value: input.employeeBand,
      influence: employeeBandScore(input.employeeBand) >= 2 ? "high" : "medium",
      reason: "Headcount scale affects platform band fees and operating complexity.",
    });
  }

  if (input.companyStageTemplate) {
    const stage = getClientDiscoveryStageTemplate(input.companyStageTemplate);
    signals.push({
      key: "company_stage",
      label: "Company stage",
      value: stage?.label ?? input.companyStageTemplate,
      influence: "high",
      reason: stage?.pricingPostureHint ?? "Stage template anchors advisory package direction.",
    });
  }

  signals.push({
    key: "modules",
    label: "CEM modules",
    value: String(input.moduleCount),
    influence: input.moduleCount >= 6 ? "high" : input.moduleCount >= 3 ? "medium" : "low",
    reason: "Module breadth drives subscription direction and implementation depth.",
  });

  signals.push({
    key: "workflows",
    label: "Workflows",
    value: String(input.workflowCount),
    influence: input.workflowCount >= 5 ? "high" : input.workflowCount >= 2 ? "medium" : "low",
    reason: "Workflow depth affects onboarding effort and operator configuration.",
  });

  if (input.securityPreference) {
    signals.push({
      key: "security",
      label: "Security preference",
      value: input.securityPreference.slice(0, 120),
      influence: depthScore(input.securityPreference) >= 2 ? "high" : "medium",
      reason: "CyberCrow depth follows security and evidence expectations.",
    });
  }

  if (input.sareaPreference) {
    signals.push({
      key: "sarea",
      label: "SAREA experience",
      value: input.sareaPreference.slice(0, 120),
      influence: depthScore(input.sareaPreference) >= 2 ? "high" : "medium",
      reason: "SAREA configuration depth follows experience density requests.",
    });
  }

  if (input.industryTemplate) {
    signals.push({
      key: "industry",
      label: "Industry template",
      value: input.industryTemplate,
      influence: input.industryTemplate === "general" ? "low" : "medium",
      reason: "Sector templates influence default departments and compliance posture.",
    });
  }

  const template = getPricingPackageTemplate(tier);
  signals.push({
    key: "recommendation",
    label: "Recommended package",
    value: template.label,
    influence: "high",
    reason: `Signals align with ${template.label} advisory scope.`,
  });

  return signals;
}

function alternativeTiers(tier: PricingPackageTier): PricingPackageTier[] {
  const order: PricingPackageTier[] = ["startup", "growth", "enterprise"];
  return order.filter((t) => t !== tier);
}

function monthlyRangeForTier(
  tier: PricingPackageTier,
  input: PricingPackageDiscoveryInput,
  moduleKeys: string[]
): string {
  try {
    const keys =
      moduleKeys.length > 0
        ? moduleKeys
        : ["crm"];
    const estimate = calculateMonthlyEstimate({
      planKey: tier,
      moduleKeys: keys,
      securityPackageKeys: depthScore(input.securityPreference) >= 2 ? ["crow_sentinel"] : [],
      employeeBand: input.employeeBand,
      sareaPackageKey: depthScore(input.sareaPreference) >= 2 ? "manager" : "starter",
    });
    const low = Math.round(estimate.totalMonthlySar * 0.85);
    const high = Math.round(estimate.totalMonthlySar * 1.2);
    return `${formatSar(low)} – ${formatSar(high)}/mo estimated direction (excl. VAT)`;
  } catch {
    return PRICING_PACKAGE_MONTHLY_DIRECTION[tier].label;
  }
}

export function buildPricingPackageEstimate(
  input: PricingPackageDiscoveryInput,
  source: PricingPackageEstimate["discoverySource"],
  moduleKeys: string[] = []
): PricingPackageEstimate {
  const recommendedTier = recommendTier(input);
  const recommendation = getPricingPackageTemplate(recommendedTier);

  let discoverySourceNote = "Based on request and discovery fields.";
  if (source === "accepted_into_blueprint") {
    discoverySourceNote = "Based on ProCrow-accepted client discovery (strongest signal).";
  } else if (source === "submitted_or_reviewing") {
    discoverySourceNote =
      "Based on submitted discovery — recommendation strengthens after ProCrow accepts into blueprint.";
  } else if (source === "draft") {
    discoverySourceNote =
      "Based on in-progress discovery — not final; ProCrow review required before proposal pricing.";
  } else {
    discoverySourceNote =
      "Limited discovery data — advisory package direction only until discovery is completed.";
  }

  return {
    recommendedTier,
    alternativeTiers: alternativeTiers(recommendedTier),
    recommendation,
    signals: buildSignals(input, recommendedTier),
    setupEstimateRange: PRICING_PACKAGE_SETUP_RANGES[recommendedTier].label,
    monthlyEstimateRange: monthlyRangeForTier(recommendedTier, input, moduleKeys),
    discoverySource: source,
    discoverySourceNote,
    notFinalQuoteDisclaimer: PRICING_PACKAGE_NOT_FINAL_DISCLAIMER,
    finalQuoteRequiresProCrowReview: PRICING_PACKAGE_FINAL_QUOTE_NOTE,
    packageChangeOptions: PRICING_PACKAGE_CHANGE_OPTIONS,
  };
}

export async function buildPricingPackageEstimateForRequest(
  requestId: string
): Promise<PricingPackageEstimate | null> {
  const request = await prisma.implementationRequest.findUnique({
    where: { id: requestId },
    include: {
      requestedModules: true,
      discoveryProfile: {
        include: {
          answers: true,
          departments: true,
          roles: true,
          workflows: true,
        },
      },
    },
  });
  if (!request) return null;

  const draft = buildDraftFromContext(requestId, request);
  const answers = request.discoveryProfile?.answers ?? [];
  const clientStatus = parseClientDiscoveryStatusFromAnswers(answers);

  let source: PricingPackageEstimate["discoverySource"] = "request_only";
  if (clientStatus === "accepted_into_blueprint") {
    source = "accepted_into_blueprint";
  } else if (
    clientStatus === "submitted_for_procrow_review" ||
    clientStatus === "procrow_reviewing" ||
    clientStatus === "changes_requested"
  ) {
    source = "submitted_or_reviewing";
  } else if (clientStatus === "in_progress" || draft.status === "not_started") {
    source = draft.status === "not_started" ? "request_only" : "draft";
  }

  const input: PricingPackageDiscoveryInput = {
    companyStageTemplate: draft.companyStageTemplate,
    employeeBand: draft.employeeBand,
    industryTemplate: draft.industryTemplate,
    moduleCount: draft.selectedModules.length,
    departmentCount: draft.selectedDepartments.length,
    roleCount: draft.selectedRoles.length,
    workflowCount: draft.selectedWorkflows.length,
    securityPreference: draft.securityPreference,
    sareaPreference: draft.sareaPreference,
    clientNotes: draft.notes,
  };

  return buildPricingPackageEstimate(input, source, draft.selectedModules);
}

export function getClientPackagePreferenceFromAnswers(
  answers: { sectionKey: string; questionKey: string; valueJson: unknown }[]
): ClientPackagePreference | null {
  const changeType = parseAnswerString(answers, "packagePreferenceChangeType");
  if (!changeType) return null;
  const allowed: ClientPackageChangeType[] = [
    "keep_recommended",
    "downscale",
    "upscale",
    "request_custom",
  ];
  if (!allowed.includes(changeType as ClientPackageChangeType)) return null;

  const tierRaw = parseAnswerString(answers, "packagePreferenceTier");
  const tier =
    tierRaw === "startup" || tierRaw === "growth" || tierRaw === "enterprise"
      ? tierRaw
      : null;

  return {
    selectedTier: tier,
    requestedChangeType: changeType as ClientPackageChangeType,
    clientNotes: parseAnswerString(answers, "packagePreferenceNotes"),
    recordedAt: parseAnswerString(answers, "packagePreferenceAt"),
  };
}

function packagePreferenceMessage(
  estimate: PricingPackageEstimate,
  changeType: ClientPackageChangeType,
  notes: string | null,
  targetTier: PricingPackageTier | null
): string {
  const rec = estimate.recommendation.label;
  const lines = [`Package preference (${changeType.replace(/_/g, " ")}).`, `Recommended: ${rec}.`];
  if (targetTier && targetTier !== estimate.recommendedTier) {
    lines.push(`Client indicated tier direction: ${getPricingPackageTemplate(targetTier).label}.`);
  }
  if (changeType === "downscale") {
    lines.push("Client requested downscale from the recommended package.");
  } else if (changeType === "upscale") {
    lines.push("Client requested upscale from the recommended package.");
  } else if (changeType === "request_custom") {
    lines.push("Client requested custom package review.");
  } else {
    lines.push("Client acknowledged the recommended package.");
  }
  if (notes?.trim()) lines.push("", notes.trim());
  lines.push("", PRICING_PACKAGE_NOT_FINAL_DISCLAIMER);
  return lines.join("\n");
}

export async function recordClientPackagePreference(
  user: User,
  requestId: string,
  changeType: ClientPackageChangeType,
  notes: string | null,
  targetTier?: PricingPackageTier | null
): Promise<void> {
  const estimate = await buildPricingPackageEstimateForRequest(requestId);
  if (!estimate) throw new Error("Request not found.");

  const now = new Date().toISOString();
  const tier =
    targetTier ??
    (changeType === "downscale"
      ? estimate.recommendedTier === "enterprise"
        ? "growth"
        : "startup"
      : changeType === "upscale"
        ? estimate.recommendedTier === "startup"
          ? "growth"
          : "enterprise"
        : estimate.recommendedTier);

  await upsertDiscoveryAnswer(requestId, CLIENT_DISCOVERY_SECTION, "packagePreferenceChangeType", changeType);
  await upsertDiscoveryAnswer(requestId, CLIENT_DISCOVERY_SECTION, "packagePreferenceTier", tier);
  if (notes?.trim()) {
    await upsertDiscoveryAnswer(requestId, CLIENT_DISCOVERY_SECTION, "packagePreferenceNotes", notes.trim());
  }
  await upsertDiscoveryAnswer(requestId, CLIENT_DISCOVERY_SECTION, "packagePreferenceAt", now);

  const message = packagePreferenceMessage(estimate, changeType, notes, tier);

  const result = await submitClientReviewNote(user, {
    requestId,
    type: "scope_clarification",
    message,
    relatedSection: "pricing_package",
  });
  if (!result.ok) {
    throw new Error(result.message ?? "Could not send package preference to ProCrow.");
  }
}
