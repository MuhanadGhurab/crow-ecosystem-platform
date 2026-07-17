import type { PublicLifecycleStepId } from "./types";

export type PublicLifecycleStep = {
  id: PublicLifecycleStepId;
  order: number;
  label: string;
  explanation: string;
  engine: string;
  deeperLinkLabel: string;
  diagramCaption: string;
};

/** Canonical six-step public lifecycle for homepage explorer — not story scroll lifecycle. */
export const PUBLIC_LIFECYCLE_STEPS: readonly PublicLifecycleStep[] = [
  {
    id: "understand",
    order: 1,
    label: "Understand",
    explanation:
      "Capture organizational intent, stakeholders, and operating constraints before any module selection.",
    engine: "Discovery intake",
    deeperLinkLabel: "How discovery captures intent",
    diagramCaption: "Purpose, scope, and stakeholder context form the starting signal.",
  },
  {
    id: "map",
    order: 2,
    label: "Map",
    explanation:
      "Document people, responsibilities, workflows, and trust boundaries as an operating map.",
    engine: "Operating model mapping",
    deeperLinkLabel: "Operating map structure",
    diagramCaption: "People, responsibilities, workflows, and trust connect into one map.",
  },
  {
    id: "design",
    order: 3,
    label: "Design",
    explanation:
      "Shape roles, Work Personas, modules, and security posture into an Enterprise Blueprint.",
    engine: "Blueprint design",
    deeperLinkLabel: "Enterprise Blueprint sections",
    diagramCaption: "Blueprint sections align organization, work, trust, and build readiness.",
  },
  {
    id: "review",
    order: 4,
    label: "Review",
    explanation:
      "ProCrow and client stakeholders review provenance, scope, and readiness before build.",
    engine: "ProCrow governance",
    deeperLinkLabel: "Blueprint approval controls",
    diagramCaption: "Review gates ensure accountable approval before tenant build.",
  },
  {
    id: "build",
    order: 5,
    label: "Build",
    explanation:
      "Approved Blueprint becomes the authoritative source for tenant provisioning and module activation.",
    engine: "Tenant build pipeline",
    deeperLinkLabel: "From Blueprint to tenant",
    diagramCaption: "Build compiles organization structure, modules, and trust baselines.",
  },
  {
    id: "operate",
    order: 6,
    label: "Operate",
    explanation:
      "CEM runs work; CyberCrow protects trust; SAREA presents permitted workspaces per role.",
    engine: "CEM runtime",
    deeperLinkLabel: "Runtime work areas",
    diagramCaption: "Attention, work, decisions, evidence, and outcomes stay connected.",
  },
] as const;

export function getPublicLifecycleStep(id: PublicLifecycleStepId): PublicLifecycleStep {
  const step = PUBLIC_LIFECYCLE_STEPS.find((s) => s.id === id);
  if (!step) throw new Error(`Unknown lifecycle step: ${id}`);
  return step;
}
