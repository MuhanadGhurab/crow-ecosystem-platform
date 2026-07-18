/**
 * CROW.DISCOVERY.4 — pure mapper: Discovery D3 answers → Operating Model input draft.
 * Local/test-safe only — no Prisma, no hosted writes, no Blueprint.
 */

import { getDiscoveryMvpD3Catalog } from "@/lib/discovery/discovery-mvp-d3-catalog";
import { computeDiscoveryMvpD3ReviewSummary } from "@/lib/discovery/discovery-mvp-d3-summary";
import type {
  DiscoveryMvpAdaptiveContext,
  DiscoveryMvpAnswerMap,
} from "@/lib/discovery/discovery-mvp-d3-types";
import { isAnswerPresent } from "@/lib/discovery/discovery-mvp-d3-validation";
import {
  isDiscoveryMvpFieldRequired,
  isDiscoveryMvpFieldVisible,
} from "@/lib/discovery/discovery-mvp-d3-visibility";
import {
  OPERATING_MODEL_DRAFT_AUTHORITY,
  OPERATING_MODEL_INPUT_DRAFT_VERSION,
  type OperatingModelDraftSection,
  type OperatingModelInputDraft,
} from "@/lib/discovery/discovery-mvp-d4-types";

function textOf(answers: DiscoveryMvpAnswerMap, key: string): string | null {
  const v = answers[key];
  if (!isAnswerPresent(v)) return null;
  return String(v).trim();
}

function joinParts(parts: Array<string | null | undefined>): string | null {
  const cleaned = parts.map((p) => p?.trim()).filter((p): p is string => Boolean(p && p.length > 0));
  return cleaned.length ? cleaned.join("\n\n") : null;
}

function section(
  content: string | null,
  sourceQuestionKeys: string[],
  status: OperatingModelDraftSection["status"],
): OperatingModelDraftSection {
  return { content, sourceQuestionKeys, status };
}

function sectionFromKeys(
  answers: DiscoveryMvpAnswerMap,
  ctx: DiscoveryMvpAdaptiveContext,
  keys: string[],
  join?: boolean,
): OperatingModelDraftSection {
  const catalog = getDiscoveryMvpD3Catalog();
  const applicable = keys.filter((key) => {
    const field = catalog.find((f) => f.fieldKey === key);
    if (!field) return false;
    return isDiscoveryMvpFieldVisible(field, ctx);
  });

  if (applicable.length === 0) {
    return section(null, keys, "not_applicable");
  }

  const present = applicable.filter((k) => isAnswerPresent(answers[k]));
  if (present.length === 0) {
    const anyRequired = applicable.some((key) => {
      const field = catalog.find((f) => f.fieldKey === key);
      return field ? isDiscoveryMvpFieldRequired(field, ctx) : false;
    });
    return section(null, applicable, anyRequired ? "missing" : "missing");
  }

  const content = join
    ? joinParts(present.map((k) => textOf(answers, k)))
    : textOf(answers, present[0]!);
  return section(content, present, "captured");
}

function stagePercent(stageId: 1 | 2 | 3, answers: DiscoveryMvpAnswerMap, ctx: DiscoveryMvpAdaptiveContext): number {
  const catalog = getDiscoveryMvpD3Catalog();
  const fields = catalog.filter((f) => f.stageId === stageId && isDiscoveryMvpFieldVisible(f, ctx));
  if (fields.length === 0) return 100;
  const answered = fields.filter((f) => isAnswerPresent(answers[f.fieldKey])).length;
  return Math.round((answered / fields.length) * 100);
}

/**
 * Derive a draft Operating Model input from local Discovery answers.
 * readyForBlueprintDraft is always false.
 */
export function buildOperatingModelInputDraft(
  answers: DiscoveryMvpAnswerMap,
  ctx: DiscoveryMvpAdaptiveContext,
): OperatingModelInputDraft {
  const catalog = getDiscoveryMvpD3Catalog();
  const d3 = computeDiscoveryMvpD3ReviewSummary(catalog, answers, ctx);

  const purpose = sectionFromKeys(answers, ctx, ["purpose_mission", "build_transform_objective"], true);
  const operatingContext = section(
    joinParts([
      ctx.journeyKind ? `Journey: ${ctx.journeyKind}` : null,
      ctx.organizationContext ? `Organization context: ${ctx.organizationContext}` : null,
      textOf(answers, "organization_display_name")
        ? `Display name: ${textOf(answers, "organization_display_name")}`
        : null,
      textOf(answers, "primary_contact_role")
        ? `Primary contact role: ${textOf(answers, "primary_contact_role")}`
        : null,
      textOf(answers, "expected_operating_start")
        ? `Expected operating start: ${textOf(answers, "expected_operating_start")}`
        : null,
    ]),
    [
      "organization_display_name",
      "primary_contact_role",
      "expected_operating_start",
    ].filter((k) => isAnswerPresent(answers[k])),
    textOf(answers, "organization_display_name") || ctx.journeyKind ? "captured" : "missing",
  );

  const organizationShape = sectionFromKeys(
    answers,
    ctx,
    [
      "industry_sector",
      "organization_size_range",
      "location_model",
      "branch_site_count",
      "department_division_scope",
      "customer_beneficiary_type",
      "parent_organization_relationship",
    ],
    true,
  );

  const peopleAndTeams = sectionFromKeys(answers, ctx, ["key_teams_or_groups"]);
  const responsibilities = sectionFromKeys(answers, ctx, ["core_responsibilities"]);
  const workflows = sectionFromKeys(answers, ctx, ["main_workflows"]);

  // Decisions/approvals not yet a dedicated D3 field — flag as missing for deeper modeling.
  const decisionsAndApprovals = section(
    null,
    [],
    "missing",
  );

  const systemsAndTools = sectionFromKeys(
    answers,
    ctx,
    ["current_systems_tools", "legacy_systems_modernization", "target_systems_intent"],
    true,
  );

  const dataAndRecords = sectionFromKeys(answers, ctx, ["important_records_data"]);

  const trustAndRiskSignals = sectionFromKeys(answers, ctx, ["major_pain_points", "important_records_data"], true);
  // For NEW without pain points visible, trust/risk from records only; pain is N/A.
  if (ctx.journeyKind === "NEW") {
    const painVisible = isDiscoveryMvpFieldVisible(
      catalog.find((f) => f.fieldKey === "major_pain_points")!,
      ctx,
    );
    if (!painVisible && trustAndRiskSignals.status === "captured" && !textOf(answers, "major_pain_points")) {
      // keep records-only content
    }
  }

  const transformationIntent =
    ctx.journeyKind === "TRANSFORM"
      ? sectionFromKeys(answers, ctx, ["transformation_target", "major_pain_points", "build_transform_objective"], true)
      : ctx.journeyKind === "NEW"
        ? sectionFromKeys(answers, ctx, ["expected_operating_start", "build_transform_objective", "target_systems_intent"], true)
        : section(null, [], "missing");

  const evidenceReferences = sectionFromKeys(answers, ctx, ["evidence_reference_note"]);

  const missingInformation: string[] = [];
  if (purpose.status === "missing") missingInformation.push("Purpose / mission objective incomplete");
  if (organizationShape.status === "missing") missingInformation.push("Organization shape incomplete");
  if (peopleAndTeams.status === "missing") missingInformation.push("People / teams not captured");
  if (responsibilities.status === "missing") missingInformation.push("Responsibilities not captured");
  if (workflows.status === "missing") missingInformation.push("Workflows not captured");
  if (systemsAndTools.status === "missing") missingInformation.push("Systems / tools not captured");
  if (dataAndRecords.status === "missing") missingInformation.push("Important records / data not captured");
  if (transformationIntent.status === "missing") missingInformation.push("Transformation / launch intent incomplete");
  if (decisionsAndApprovals.status === "missing") {
    missingInformation.push("Decisions / approvals not yet captured (Stage 4 planned)");
  }
  for (const key of d3.missingRequiredKeys) {
    const label = catalog.find((f) => f.fieldKey === key)?.label ?? key;
    if (!missingInformation.some((m) => m.includes(label))) {
      missingInformation.push(`Required Discovery field missing: ${label} (${key})`);
    }
  }

  const assumptions: string[] = [
    "Draft is derived from local Discovery answers only — not an approved Operating Model.",
    "Stages 4–7 (trust depth, evidence package, ProCrow modeling review) are not complete.",
    "Blueprint generation remains blocked until a future owner-authorized milestone.",
  ];
  if (ctx.journeyKind === "NEW") {
    assumptions.push("NEW journey: legacy pain-point inventory is not required for this draft.");
  }
  if (ctx.journeyKind === "TRANSFORM") {
    assumptions.push("TRANSFORM journey: current-state systems and pain points inform transition planning.");
  }

  const riskFlags: string[] = [];
  if (d3.missingRequiredCount > 0) {
    riskFlags.push(`${d3.missingRequiredCount} required Discovery field(s) still missing`);
  }
  if (ctx.journeyKind === "TRANSFORM" && systemsAndTools.status !== "captured") {
    riskFlags.push("Transform journey without current systems/tools inventory");
  }
  if (ctx.journeyKind === "TRANSFORM" && !textOf(answers, "major_pain_points")) {
    riskFlags.push("Transform journey without major pain points");
  }
  if (textOf(answers, "important_records_data") && /secret|password|ssn|api[_-]?key/i.test(textOf(answers, "important_records_data")!)) {
    riskFlags.push("Data/records answer may contain sensitive sample values — ProCrow should sanitize");
  }
  if (organizationShape.status === "captured" && peopleAndTeams.status === "missing") {
    riskFlags.push("Organization shape present but people/teams not yet described");
  }

  const clarificationPrompts: string[] = [];
  if (decisionsAndApprovals.status === "missing") {
    clarificationPrompts.push("Ask who approves key decisions and where segregation of duties is required.");
  }
  if (systemsAndTools.status === "missing" && ctx.journeyKind === "TRANSFORM") {
    clarificationPrompts.push("Clarify current systems of record before modeling integrations.");
  }
  if (peopleAndTeams.status === "missing") {
    clarificationPrompts.push("Clarify key teams before proposing role/persona candidates.");
  }
  if (d3.missingRequiredCount === 0 && riskFlags.length === 0) {
    clarificationPrompts.push("Core Stages 1–3 look complete — ProCrow can begin deeper modeling review (D5).");
  }

  const stage1 = stagePercent(1, answers, ctx);
  const stage2 = stagePercent(2, answers, ctx);
  const stage3 = stagePercent(3, answers, ctx);

  const omSectionsMissing = [
    purpose,
    organizationShape,
    peopleAndTeams,
    responsibilities,
    workflows,
    systemsAndTools,
    dataAndRecords,
    transformationIntent,
  ].filter((s) => s.status === "missing").length;

  const readyForProCrowReview =
    d3.missingRequiredCount === 0 &&
    purpose.status === "captured" &&
    organizationShape.status === "captured" &&
    peopleAndTeams.status === "captured" &&
    responsibilities.status === "captured" &&
    workflows.status === "captured";

  const sourceQuestionKeys = [
    ...new Set(
      [
        purpose,
        operatingContext,
        organizationShape,
        peopleAndTeams,
        responsibilities,
        workflows,
        systemsAndTools,
        dataAndRecords,
        trustAndRiskSignals,
        transformationIntent,
        evidenceReferences,
      ].flatMap((s) => s.sourceQuestionKeys),
    ),
  ];

  return {
    version: OPERATING_MODEL_INPUT_DRAFT_VERSION,
    productLabel: "Draft Operating Model Input",
    lifecycle: "draft_local_pre_blueprint",
    approved: false,
    tenantRuntime: false,
    forProCrowReview: true,
    purpose,
    operatingContext,
    organizationShape,
    peopleAndTeams,
    responsibilities,
    workflows,
    decisionsAndApprovals,
    systemsAndTools,
    dataAndRecords,
    trustAndRiskSignals,
    transformationIntent,
    evidenceReferences,
    missingInformation,
    assumptions,
    riskFlags,
    readinessSignals: {
      stageCompletenessPercent: { stage1, stage2, stage3 },
      overallCompletionPercent: d3.completionPercent,
      missingCoreFieldCount: d3.missingRequiredCount,
      missingOperatingModelFieldCount: omSectionsMissing,
      riskFlagCount: riskFlags.length,
      readyForProCrowReview,
      readyForBlueprintDraft: false,
    },
    sourceQuestionKeys,
    authority: OPERATING_MODEL_DRAFT_AUTHORITY,
    clarificationPrompts,
  };
}
