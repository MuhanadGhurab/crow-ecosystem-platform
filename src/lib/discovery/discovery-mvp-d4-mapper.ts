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

function stagePercent(
  stageId: 1 | 2 | 3 | 4 | 5 | 6 | 7,
  answers: DiscoveryMvpAnswerMap,
  ctx: DiscoveryMvpAdaptiveContext,
): number {
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

  // Decisions/approvals from Stage 4 depth.
  const decisionsAndApprovals = sectionFromKeys(
    answers,
    ctx,
    ["approval_risk_areas", "segregation_of_duties_concerns"],
    true,
  );

  const systemsAndTools = sectionFromKeys(
    answers,
    ctx,
    ["current_systems_tools", "legacy_systems_modernization", "target_systems_intent", "legacy_system_constraints"],
    true,
  );

  const dataAndRecords = sectionFromKeys(answers, ctx, [
    "important_records_data",
    "sensitive_data_types",
  ], true);

  const trustAndRiskSignals = sectionFromKeys(
    answers,
    ctx,
    [
      "sensitive_data_types",
      "identity_access_concerns",
      "approval_risk_areas",
      "audit_requirements",
      "compliance_regulation_notes",
      "segregation_of_duties_concerns",
      "operational_risk_areas",
      "security_priorities",
      "trust_constraints",
      "trust_risk_priority",
      "new_business_foundation_risks",
      "major_pain_points",
      "stage7_trust_risk_flags_notes",
    ],
    true,
  );

  const transformationIntent =
    ctx.journeyKind === "TRANSFORM"
      ? sectionFromKeys(
          answers,
          ctx,
          [
            "transformation_target",
            "major_pain_points",
            "build_transform_objective",
            "current_state_problems",
            "legacy_system_constraints",
            "process_change_goals",
            "migration_concerns",
            "change_readiness_notes",
            "target_state_improvements",
            "modernization_program_notes",
          ],
          true,
        )
      : ctx.journeyKind === "NEW"
        ? sectionFromKeys(
            answers,
            ctx,
            [
              "expected_operating_start",
              "build_transform_objective",
              "target_systems_intent",
              "target_launch_model",
              "initial_operating_capabilities",
              "first_teams_to_activate",
              "required_go_live_readiness",
              "expected_constraints_new",
              "modernization_program_notes",
            ],
            true,
          )
        : section(null, [], "missing");

  const evidenceReferences = sectionFromKeys(
    answers,
    ctx,
    [
      "evidence_reference_note",
      "evidence_title",
      "evidence_type",
      "evidence_reference_description",
      "evidence_related_question_keys",
      "evidence_availability_status",
      "evidence_not_available_reason",
      "evidence_local_metadata_note",
    ],
    true,
  );

  const missingInformation: string[] = [];
  if (purpose.status === "missing") missingInformation.push("Purpose / mission objective incomplete");
  if (organizationShape.status === "missing") missingInformation.push("Organization shape incomplete");
  if (peopleAndTeams.status === "missing") missingInformation.push("People / teams not captured");
  if (responsibilities.status === "missing") missingInformation.push("Responsibilities not captured");
  if (workflows.status === "missing") missingInformation.push("Workflows not captured");
  if (systemsAndTools.status === "missing") missingInformation.push("Systems / tools not captured");
  if (dataAndRecords.status === "missing") missingInformation.push("Important records / data not captured");
  if (transformationIntent.status === "missing") missingInformation.push("Transformation / launch intent incomplete");
  if (trustAndRiskSignals.status === "missing") missingInformation.push("Trust and risk signals incomplete (Stage 4)");
  if (evidenceReferences.status === "missing") missingInformation.push("Evidence references incomplete (Stage 6)");
  if (decisionsAndApprovals.status === "missing") {
    missingInformation.push("Decisions / approvals / SoD concerns not captured (Stage 4)");
  }
  if (textOf(answers, "stage7_missing_information_notes")) {
    missingInformation.push(`Stage 7 notes: ${textOf(answers, "stage7_missing_information_notes")}`);
  }
  for (const key of d3.missingRequiredKeys) {
    const label = catalog.find((f) => f.fieldKey === key)?.label ?? key;
    if (!missingInformation.some((m) => m.includes(label))) {
      missingInformation.push(`Required Discovery field missing: ${label} (${key})`);
    }
  }

  const assumptions: string[] = [
    "Draft is derived from local Discovery answers only — not an approved Operating Model.",
    "Stage 7 is ProCrow review preparation — not Blueprint approval or generation.",
    "Blueprint generation remains blocked until a future owner-authorized milestone.",
  ];
  if (textOf(answers, "stage7_handoff_readiness_notes")) {
    assumptions.push(`Handoff readiness notes: ${textOf(answers, "stage7_handoff_readiness_notes")}`);
  }
  if (textOf(answers, "evidence_availability_status") === "not_available_yet") {
    assumptions.push(
      textOf(answers, "evidence_not_available_reason")
        ? `Evidence not available yet: ${textOf(answers, "evidence_not_available_reason")}`
        : "Evidence marked not available yet without a detailed reason.",
    );
  }
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
  if (textOf(answers, "trust_risk_priority") === "high") {
    riskFlags.push("Trust/risk priority marked high — ProCrow should prioritize Stage 4 signals");
  }
  if (textOf(answers, "important_records_data") && /secret|password|ssn|api[_-]?key/i.test(textOf(answers, "important_records_data")!)) {
    riskFlags.push("Data/records answer may contain sensitive sample values — ProCrow should sanitize");
  }
  if (textOf(answers, "sensitive_data_types") && /secret|password|ssn|api[_-]?key/i.test(textOf(answers, "sensitive_data_types")!)) {
    riskFlags.push("Sensitive data types answer may contain sample secrets — ProCrow should sanitize");
  }
  if (organizationShape.status === "captured" && peopleAndTeams.status === "missing") {
    riskFlags.push("Organization shape present but people/teams not yet described");
  }
  if (textOf(answers, "stage7_critical_blockers_notes")) {
    riskFlags.push(`Stage 7 critical blockers noted: ${textOf(answers, "stage7_critical_blockers_notes")}`);
  }
  if (textOf(answers, "stage7_trust_risk_flags_notes")) {
    riskFlags.push(`Stage 7 trust/risk flags: ${textOf(answers, "stage7_trust_risk_flags_notes")}`);
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
  if (trustAndRiskSignals.status === "missing") {
    clarificationPrompts.push("Complete Stage 4 trust and risk fields before modeling security baselines.");
  }
  if (textOf(answers, "stage7_clarification_questions_local")) {
    clarificationPrompts.push(textOf(answers, "stage7_clarification_questions_local")!);
  }
  if (d3.missingRequiredCount === 0 && riskFlags.length === 0) {
    clarificationPrompts.push(
      "Core Stages 1–7 required fields look complete — ProCrow can deepen modeling review (D5).",
    );
  }

  const stage1 = stagePercent(1, answers, ctx);
  const stage2 = stagePercent(2, answers, ctx);
  const stage3 = stagePercent(3, answers, ctx);
  const stage4 = stagePercent(4, answers, ctx);
  const stage5 = stagePercent(5, answers, ctx);
  const stage6 = stagePercent(6, answers, ctx);
  const stage7 = stagePercent(7, answers, ctx);

  const omSectionsMissing = [
    purpose,
    organizationShape,
    peopleAndTeams,
    responsibilities,
    workflows,
    systemsAndTools,
    dataAndRecords,
    transformationIntent,
    trustAndRiskSignals,
    evidenceReferences,
    decisionsAndApprovals,
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
        decisionsAndApprovals,
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
      stageCompletenessPercent: {
        stage1,
        stage2,
        stage3,
        stage4,
        stage5,
        stage6,
        stage7,
      },
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
