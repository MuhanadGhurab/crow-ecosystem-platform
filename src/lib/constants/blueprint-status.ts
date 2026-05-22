export type BlueprintStatus = "DRAFT" | "APPROVED" | "ARCHIVED";

export const BLUEPRINT_STATUS_LABELS: Record<BlueprintStatus, string> = {
  DRAFT: "Draft",
  APPROVED: "Approved",
  ARCHIVED: "Archived",
};

export const BLUEPRINT_STATUS_STYLES: Record<BlueprintStatus, string> = {
  DRAFT: "bg-violet-500/10 text-violet-300",
  APPROVED: "bg-green-500/10 text-green-300",
  ARCHIVED: "bg-slate-500/10 text-slate-400",
};
