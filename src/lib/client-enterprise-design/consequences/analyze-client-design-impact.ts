import type {
  ClientDesignCustomization,
  ClientDesignGuardrail,
  ClientDesignImpactAnalysis,
  ClientEnterpriseDesignInput,
  ClientEnterpriseDesignSnapshot,
} from "../types";
import { composeClientEnterpriseDesign } from "../recommendations/compose-client-enterprise-design";

export function analyzeClientDesignImpact(args: {
  baselineInput: ClientEnterpriseDesignInput;
  action: ClientDesignCustomization;
}): ClientDesignImpactAnalysis {
  const before = composeClientEnterpriseDesign(args.baselineInput);
  const afterInput = applyCustomization(args.baselineInput, args.action);
  const after = composeClientEnterpriseDesign(afterInput);

  const guardrail = classifyGuardrail(args.action, args.baselineInput, before);

  const workforceImpact: string[] = [];
  const workflowImpact: string[] = [];
  const approvalImpact: string[] = [];
  const automationImpact: string[] = [];
  const securityImpact: string[] = [];
  const scalabilityImpact: string[] = [];
  const riskImpact: string[] = [];

  if (args.action.kind === "remove_capability") {
    workflowImpact.push(`Capability ${args.action.targetKey} removed — dependent workflows may be simplified or removed.`);
    workforceImpact.push("Fewer specialized responsibilities may be required.");
    riskImpact.push("Removing controls tied to the capability may weaken evidence trails.");
  } else if (args.action.kind === "add_capability") {
    workflowImpact.push(`Capability ${args.action.targetKey} added — supporting workflows recommended.`);
    workforceImpact.push("May require an additional operating responsibility.");
    scalabilityImpact.push("Added capability increases operational surface area.");
  } else if (args.action.kind === "merge_responsibility") {
    workforceImpact.push("Merged responsibilities reduce headcount pressure but increase concentration risk.");
    riskImpact.push("Segregation of duties may weaken for merged financial or approval duties.");
    approvalImpact.push("Approval paths may shorten.");
  } else if (args.action.kind === "change_approval_depth") {
    approvalImpact.push("Approval depth changed — review evidence and cycle time impacts.");
    riskImpact.push(
      Number(args.action.value) < 2
        ? "Shallower approvals increase operational speed but reduce control."
        : "Deeper approvals improve control but slow execution.",
    );
  } else if (args.action.kind === "change_automation") {
    automationImpact.push("Automation preference changed — routine tasks may shift to system routing.");
    securityImpact.push("High-risk decisions still require human approval.");
  } else if (args.action.kind === "change_scale") {
    workforceImpact.push(`Scale change updates estimated core-team range (${before.leanModel.estimatedCoreTeamRange.min}–${before.leanModel.estimatedCoreTeamRange.max} → ${after.leanModel.estimatedCoreTeamRange.min}–${after.leanModel.estimatedCoreTeamRange.max}).`);
    scalabilityImpact.push("Workflow depth and persona granularity may change with scale.");
  }

  return {
    action: `${args.action.kind}:${args.action.targetKey}`,
    guardrail,
    workforceImpact,
    workflowImpact,
    approvalImpact,
    automationImpact,
    securityImpact,
    scalabilityImpact,
    riskImpact,
    simpleSummary: buildSimpleSummary(args.action, guardrail),
    advancedSummary: `Baseline personas=${before.recommendedPersonaKeys.join(",")}; after=${after.recommendedPersonaKeys.join(",")}`,
  };
}

function applyCustomization(
  input: ClientEnterpriseDesignInput,
  action: ClientDesignCustomization,
): ClientEnterpriseDesignInput {
  const customizations = [...(input.customizations ?? []), action];
  const next = { ...input, customizations };
  if (action.kind === "add_capability" && !next.selectedCapabilities.includes(action.targetKey)) {
    next.selectedCapabilities = [...next.selectedCapabilities, action.targetKey];
  }
  if (action.kind === "remove_capability") {
    next.selectedCapabilities = next.selectedCapabilities.filter((k) => k !== action.targetKey);
  }
  if (action.kind === "add_domain" && !next.specialistDomains.includes(action.targetKey)) {
    next.specialistDomains = [...next.specialistDomains, action.targetKey];
  }
  if (action.kind === "remove_domain") {
    next.specialistDomains = next.specialistDomains.filter((k) => k !== action.targetKey);
  }
  if (action.kind === "change_scale" && typeof action.value === "string") {
    next.targetScale = action.value;
  }
  if (action.kind === "hybrid_variant" && typeof action.value === "string") {
    next.selectedModelVariant = "CUSTOM";
  }
  return next;
}

function classifyGuardrail(
  action: ClientDesignCustomization,
  input: ClientEnterpriseDesignInput,
  snapshot: ClientEnterpriseDesignSnapshot,
): ClientDesignGuardrail {
  if (action.kind === "remove_capability") {
    const essential = snapshot.recommendedCapabilities.slice(0, 3);
    if (essential.includes(action.targetKey)) return "NOT_RECOMMENDED";
    return "SUPPORTED_WITH_WARNING";
  }
  if (action.kind === "merge_responsibility" && action.targetKey.includes("finance")) {
    return "REQUIRES_ADDITIONAL_CONTROL";
  }
  if (action.kind === "change_approval_depth" && Number(action.value) === 0) {
    return "REQUIRES_HUMAN_REVIEW";
  }
  if (action.kind === "remove_domain" && input.specialistDomains.length <= 1) {
    return "INCOMPATIBLE";
  }
  return "SUPPORTED";
}

function buildSimpleSummary(action: ClientDesignCustomization, guardrail: ClientDesignGuardrail): string {
  return `Client action ${action.kind.replace(/_/g, " ")} on ${action.targetKey.replace(/_/g, " ")} — ${guardrail.replace(/_/g, " ").toLowerCase()}.`;
}
