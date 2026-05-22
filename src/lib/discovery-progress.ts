import { getDiscoveryAnswer, type DiscoveryAnswerRow } from "@/lib/discovery-answers";

export const DISCOVERY_STEPS = [
  { id: "organization", label: "Organization", pathKey: "organization" as const },
  { id: "modules", label: "Modules", pathKey: "modules" as const },
  { id: "security", label: "Security", pathKey: "security" as const },
  { id: "structure", label: "Structure", pathKey: "departments" as const },
  { id: "roles", label: "Roles", pathKey: "roles" as const },
  { id: "workflows", label: "Workflows", pathKey: "workflows" as const },
  { id: "summary", label: "Summary", pathKey: "summary" as const },
] as const;

export type DiscoveryStepId = (typeof DISCOVERY_STEPS)[number]["id"];

type ProfileSlice = {
  answers: DiscoveryAnswerRow[];
  departments: { id: string }[];
  branches: { id: string }[];
  roles: { id: string }[];
  workflows: { id: string }[];
  securityRequirements: { id: string }[];
};

export function getDiscoveryStepCompletion(profile: ProfileSlice) {
  const { answers } = profile;
  const operatingModel = getDiscoveryAnswer<string>(answers, "organization", "operatingModel");
  const moduleKeys = getDiscoveryAnswer<string[]>(answers, "modules", "confirmedKeys");
  const securityReviewed = getDiscoveryAnswer<boolean>(answers, "security", "reviewed");

  return {
    organization: Boolean(operatingModel),
    modules: Boolean(moduleKeys?.length),
    security: Boolean(securityReviewed || profile.securityRequirements.length > 0),
    structure: profile.departments.length > 0 || profile.branches.length > 0,
    roles: profile.roles.length > 0,
    workflows: profile.workflows.length > 0,
    summary: false,
  } satisfies Record<DiscoveryStepId, boolean>;
}

export function discoveryProgressPercent(completion: Record<DiscoveryStepId, boolean>): number {
  const core: DiscoveryStepId[] = [
    "organization",
    "modules",
    "security",
    "structure",
    "roles",
  ];
  const done = core.filter((id) => completion[id]).length;
  return Math.round((done / core.length) * 100);
}
