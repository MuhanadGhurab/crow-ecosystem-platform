/**
 * L4 — Company stage templates (advisory only; no pricing guarantees).
 */

import type { ClientDiscoveryStageTemplate } from "@/lib/client-portal/client-discovery-contract";

export type ClientDiscoveryStageTemplateDef = {
  key: ClientDiscoveryStageTemplate;
  label: string;
  description: string;
  idealEmployeeBands: readonly string[];
  defaultComplexity: "lean" | "balanced" | "enterprise";
  moduleIntensity: "core" | "expanded" | "full";
  workflowDepth: "lite" | "standard" | "advanced";
  cybercrowPosture: string;
  sareaExperience: string;
  pricingPostureHint: string;
};

export const CLIENT_DISCOVERY_STAGE_TEMPLATES: readonly ClientDiscoveryStageTemplateDef[] = [
  {
    key: "startup",
    label: "Startup",
    description:
      "Lean operating model — core modules first, lighter workflows, and a simpler SAREA experience while CyberCrow baseline stays in place.",
    idealEmployeeBands: ["1-10", "11-50"],
    defaultComplexity: "lean",
    moduleIntensity: "core",
    workflowDepth: "lite",
    cybercrowPosture: "Standard security baseline with essential monitoring and access hygiene.",
    sareaExperience: "Simple navigation, role-light dashboards, minimal density.",
    pricingPostureHint:
      "Estimated pricing favors a smaller module footprint and lighter workflow depth (advisory only).",
  },
  {
    key: "growth",
    label: "Growth",
    description:
      "Scaling operations — more departments, stronger cross-functional workflows, finance/procurement/inventory/reporting modules, and role-based dashboards.",
    idealEmployeeBands: ["11-50", "51-200"],
    defaultComplexity: "balanced",
    moduleIntensity: "expanded",
    workflowDepth: "standard",
    cybercrowPosture:
      "Stronger CyberCrow posture with approval trails, incident readiness, and evidence-friendly controls.",
    sareaExperience: "Role-based dashboards and department-aware navigation.",
    pricingPostureHint:
      "Estimated pricing reflects expanded modules and workflow depth (advisory only).",
  },
  {
    key: "enterprise",
    label: "Enterprise",
    description:
      "Full operating structure — approval workflows, evidence posture, deeper reporting, and advanced SAREA density for multi-department governance.",
    idealEmployeeBands: ["201-500", "500+"],
    defaultComplexity: "enterprise",
    moduleIntensity: "full",
    workflowDepth: "advanced",
    cybercrowPosture:
      "Enterprise CyberCrow posture with evidence collection, stronger access governance, and audit-friendly workflows.",
    sareaExperience: "High-density executive and operator views with advanced persona routing.",
    pricingPostureHint:
      "Estimated pricing reflects broader scope and security/SAREA depth (advisory only).",
  },
] as const;

export function getClientDiscoveryStageTemplate(
  key: ClientDiscoveryStageTemplate | null | undefined
): ClientDiscoveryStageTemplateDef | null {
  if (!key) return null;
  return CLIENT_DISCOVERY_STAGE_TEMPLATES.find((t) => t.key === key) ?? null;
}
