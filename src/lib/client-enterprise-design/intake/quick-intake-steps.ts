import type { ClientConfigurationMode } from "../types";

export const QUICK_INTAKE_STEPS = [
  "field",
  "purpose",
  "team",
  "mode",
  "recommendations",
  "review",
] as const;

export const GUIDED_EXTRA_STEPS = ["capabilities"] as const;

export const EXPERT_EXTRA_STEPS = ["priority", "compare", "workflows", "customize"] as const;

export type QuickIntakeStep =
  | (typeof QUICK_INTAKE_STEPS)[number]
  | (typeof GUIDED_EXTRA_STEPS)[number]
  | (typeof EXPERT_EXTRA_STEPS)[number];

export function stepsForConfigurationMode(mode: ClientConfigurationMode): QuickIntakeStep[] {
  const base: QuickIntakeStep[] = [...QUICK_INTAKE_STEPS];
  if (mode === "GUIDE_ME") {
    const idx = base.indexOf("recommendations");
    base.splice(idx, 0, "capabilities");
  }
  if (mode === "EXPERT_CONFIGURATION") {
    const idx = base.indexOf("recommendations");
    base.splice(idx, 0, "capabilities", "priority", "compare", "workflows", "customize");
  }
  return base;
}

export function stepLabel(step: QuickIntakeStep): string {
  const labels: Record<QuickIntakeStep, string> = {
    field: "Your business field",
    purpose: "What you want to accomplish",
    team: "Team and growth",
    mode: "How you'd like to configure",
    capabilities: "Operating capabilities",
    priority: "Operating priority",
    compare: "Compare models",
    workflows: "Workflows",
    customize: "Advanced customization",
    recommendations: "Crow recommendations",
    review: "Review and submit",
  };
  return labels[step];
}

export function stepHelp(step: QuickIntakeStep): string {
  const help: Record<QuickIntakeStep, string> = {
    field: "Helps Crow recommend the right operating model for your industry.",
    purpose: "Your goals shape workflows, roles, and capabilities.",
    team: "Team size helps estimate responsibilities — not exact headcount.",
    mode: "Choose how much guidance you want from Crow.",
    capabilities: "Select what your business needs to run day to day.",
    priority: "Balance lean operations against control and automation.",
    compare: "Compare starter, growth, and enterprise operating models.",
    workflows: "Review the workflows that matter most first.",
    customize: "Advanced options for IT and operations specialists.",
    recommendations: "Crow's recommendations based on your answers.",
    review: "Confirm and submit — ProCrow will review before any provisioning.",
  };
  return help[step];
}
