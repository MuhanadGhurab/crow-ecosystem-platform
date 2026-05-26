import { getDiscoveryAnswer, type DiscoveryAnswerRow } from "@/lib/discovery-answers";
import { discoveryProgressPercent, getDiscoveryStepCompletion } from "@/lib/discovery-progress";
import { resolveSectorTemplateKey } from "@/lib/org-intelligence/resolve-sector";
import { sectorConfidenceLabel } from "@/lib/discovery-intelligence/sector-guidance";

export type DiscoveryReadinessLabel =
  | "ready_for_blueprint"
  | "needs_review"
  | "missing_critical"
  | "draft_only";

export type DiscoverySectionStatus = {
  key: string;
  label: string;
  required: boolean;
  complete: boolean;
  detail?: string;
};

export type DiscoveryCompletenessResult = {
  essentialsPercent: number;
  readinessLabel: DiscoveryReadinessLabel;
  readinessTitle: string;
  sections: DiscoverySectionStatus[];
  missingInputs: string[];
  optionalAnswered: number;
  optionalTotal: number;
  sectorConfidence: { level: "high" | "medium" | "low"; detail: string };
  moduleConfidence: { level: "high" | "medium" | "low"; detail: string };
  orgModelConfidence: { level: "high" | "medium" | "low"; detail: string };
  blueprintReadinessHint: string;
};

export type DiscoveryCompletenessInput = {
  answers: DiscoveryAnswerRow[];
  departments: { id: string }[];
  branches: { id: string }[];
  roles: { id: string }[];
  workflows: { id: string }[];
  securityRequirements: { id: string }[];
  orgIntelligence?: {
    status: string;
    sectorTemplateKey: string;
  } | null;
  industry?: string | null;
  requestedModuleKeys: string[];
  requestedSecurityCount: number;
  hasExperienceAnswer?: boolean;
  hasIdentityAnswer?: boolean;
};

function confidenceFromChecks(passed: number, total: number): {
  level: "high" | "medium" | "low";
  detail: string;
} {
  if (total === 0) return { level: "low", detail: "Nothing captured yet" };
  const ratio = passed / total;
  if (ratio >= 1) return { level: "high", detail: "All checks passed" };
  if (ratio >= 0.6) return { level: "medium", detail: `${passed}/${total} checks passed` };
  return { level: "low", detail: `${passed}/${total} checks passed` };
}

export function computeDiscoveryCompleteness(
  input: DiscoveryCompletenessInput
): DiscoveryCompletenessResult {
  const completion = getDiscoveryStepCompletion({
    answers: input.answers,
    departments: input.departments,
    branches: input.branches,
    roles: input.roles,
    workflows: input.workflows,
    securityRequirements: input.securityRequirements,
  });

  const essentialsPercent = discoveryProgressPercent(completion);
  const operatingModel = getDiscoveryAnswer<string>(input.answers, "organization", "operatingModel");
  const moduleKeys = getDiscoveryAnswer<string[]>(input.answers, "modules", "confirmedKeys");
  const securityReviewed = getDiscoveryAnswer<boolean>(input.answers, "security", "reviewed");

  const sectorKey =
    getDiscoveryAnswer<string>(input.answers, "org_intelligence", "sectorTemplateKey") ??
    input.orgIntelligence?.sectorTemplateKey ??
    resolveSectorTemplateKey({
      industry: input.industry ?? "",
      moduleKeys: input.requestedModuleKeys,
    });

  const sections: DiscoverySectionStatus[] = [
    {
      key: "organization",
      label: "Organization context",
      required: true,
      complete: completion.organization,
      detail: operatingModel ? `Operating model: ${operatingModel}` : undefined,
    },
    {
      key: "modules",
      label: "CEM modules",
      required: true,
      complete: completion.modules,
      detail:
        moduleKeys?.length || input.requestedModuleKeys.length
          ? `${moduleKeys?.length ?? input.requestedModuleKeys.length} module(s)`
          : undefined,
    },
    {
      key: "security",
      label: "Security posture",
      required: true,
      complete: completion.security,
      detail:
        input.requestedSecurityCount > 0
          ? `${input.requestedSecurityCount} package(s) on request`
          : securityReviewed
            ? "Reviewed in discovery"
            : undefined,
    },
    {
      key: "structure",
      label: "Structure (depts / branches)",
      required: true,
      complete: completion.structure,
      detail: `${input.departments.length} dept · ${input.branches.length} branch`,
    },
    {
      key: "roles",
      label: "Roles",
      required: true,
      complete: completion.roles,
      detail: `${input.roles.length} role(s)`,
    },
    {
      key: "workflows",
      label: "Workflows",
      required: false,
      complete: completion.workflows,
      detail: `${input.workflows.length} workflow(s)`,
    },
    {
      key: "org_intel",
      label: "Org intelligence",
      required: false,
      complete: Boolean(input.orgIntelligence),
      detail: input.orgIntelligence
        ? `${input.orgIntelligence.status} · ${input.orgIntelligence.sectorTemplateKey}`
        : "Generate from sector template",
    },
    {
      key: "org_accept",
      label: "Org model accepted",
      required: false,
      complete: input.orgIntelligence?.status === "ACCEPTED",
      detail:
        input.orgIntelligence?.status === "ACCEPTED"
          ? "Ready to seed blueprint org contract"
          : "Review organization model page",
    },
    {
      key: "experience",
      label: "SAREA experience",
      required: false,
      complete: Boolean(input.hasExperienceAnswer),
    },
    {
      key: "identity",
      label: "Identity notes",
      required: false,
      complete: Boolean(input.hasIdentityAnswer),
    },
  ];

  const requiredSections = sections.filter((s) => s.required);
  const optionalSections = sections.filter((s) => !s.required);
  const missingInputs: string[] = [];

  if (!completion.organization) missingInputs.push("Select operating model and employee band");
  if (!completion.modules) missingInputs.push("Confirm CEM modules for this request");
  if (!completion.security) missingInputs.push("Review security package or add requirements");
  if (!completion.structure) missingInputs.push("Add departments or branches (or apply sector template)");
  if (!completion.roles) missingInputs.push("Add at least one role for RBAC seeding");
  if (!input.orgIntelligence) {
    missingInputs.push("Generate organizational intelligence from sector template");
  } else if (input.orgIntelligence.status !== "ACCEPTED") {
    missingInputs.push("Accept org intelligence model before blueprint (recommended)");
  }
  if (!completion.workflows) {
    missingInputs.push("Optional: add workflows for richer blueprint depth");
  }

  const requiredComplete = requiredSections.every((s) => s.complete);
  const criticalMissing = missingInputs.filter((m) =>
    ["operating", "modules", "security", "departments", "roles", "org intelligence"].some((k) =>
      m.toLowerCase().includes(k.split(" ")[0])
    )
  );

  let readinessLabel: DiscoveryReadinessLabel;
  let readinessTitle: string;
  let blueprintReadinessHint: string;

  if (!requiredComplete || criticalMissing.length >= 3) {
    readinessLabel = essentialsPercent < 40 ? "draft_only" : "missing_critical";
    readinessTitle =
      essentialsPercent < 40 ? "Draft only" : "Missing critical inputs";
    blueprintReadinessHint =
      "Complete required discovery sections before generating a blueprint — advisory gate will flag blockers.";
  } else if (
    !input.orgIntelligence ||
    input.orgIntelligence.status !== "ACCEPTED" ||
    !completion.workflows
  ) {
    readinessLabel = "needs_review";
    readinessTitle = "Needs review";
    blueprintReadinessHint =
      "Core sections are present — operator should review org intelligence and optional workflows before blueprint.";
  } else {
    readinessLabel = "ready_for_blueprint";
    readinessTitle = "Ready for blueprint";
    blueprintReadinessHint =
      "Advisory readiness is strong — run discovery complete on Summary to link blueprint (idempotent).";
  }

  const modulePassed =
    (moduleKeys?.length ?? 0) > 0 || input.requestedModuleKeys.length > 0 ? 1 : 0;
  const orgPassed =
    (input.orgIntelligence ? 1 : 0) + (input.orgIntelligence?.status === "ACCEPTED" ? 1 : 0);

  return {
    essentialsPercent,
    readinessLabel,
    readinessTitle,
    sections,
    missingInputs,
    optionalAnswered: optionalSections.filter((s) => s.complete).length,
    optionalTotal: optionalSections.length,
    sectorConfidence: sectorConfidenceLabel({
      industry: input.industry,
      sectorTemplateKey: sectorKey,
    }),
    moduleConfidence: confidenceFromChecks(modulePassed, 1),
    orgModelConfidence: confidenceFromChecks(orgPassed, 2),
    blueprintReadinessHint,
  };
}

export function readinessLabelStyles(label: DiscoveryReadinessLabel): {
  border: string;
  text: string;
} {
  switch (label) {
    case "ready_for_blueprint":
      return { border: "border-teal-500/25 bg-teal-950/20", text: "text-teal-300" };
    case "needs_review":
      return { border: "border-amber-500/25 bg-amber-950/15", text: "text-amber-200" };
    case "missing_critical":
      return { border: "border-red-500/30 bg-red-950/20", text: "text-red-300" };
    case "draft_only":
      return { border: "border-slate-500/25 bg-slate-950/20", text: "text-slate-400" };
  }
}

export type ConfidenceLevel = "high" | "medium" | "low";

export function confidenceBadgeClass(level: ConfidenceLevel): string {
  switch (level) {
    case "high":
      return "border-teal-500/30 bg-teal-500/10 text-teal-200";
    case "medium":
      return "border-amber-500/30 bg-amber-500/10 text-amber-200";
    case "low":
      return "border-slate-500/30 bg-white/5 text-slate-400";
  }
}
