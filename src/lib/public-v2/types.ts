/** Public homepage v2 — isolated preview types. */

export type PublicJourneyKind = "NEW" | "TRANSFORM";

export type PublicOperatingStageId = "intent" | "operating" | "blueprint" | "runtime";

export type PublicLifecycleStepId =
  | "understand"
  | "map"
  | "design"
  | "review"
  | "build"
  | "operate";

export type PublicBlueprintTabId =
  | "intent"
  | "organization"
  | "work"
  | "trust"
  | "build";

export type PublicSareaRoleId =
  | "executive"
  | "manager"
  | "specialist"
  | "frontline"
  | "analyst";

export type PublicRuntimeAreaId =
  | "attention"
  | "work"
  | "decisions"
  | "evidence"
  | "outcomes";

export type PublicFoundationLayerId = "cem" | "cybercrow" | "sarea" | "procrow";
