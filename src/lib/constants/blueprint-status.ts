export type BlueprintStatus = "DRAFT" | "IN_REVIEW" | "APPROVED" | "ARCHIVED";

export const BLUEPRINT_STATUS_LABELS: Record<BlueprintStatus, string> = {
  DRAFT: "Draft",
  IN_REVIEW: "In review",
  APPROVED: "Approved",
  ARCHIVED: "Archived",
};

export const BLUEPRINT_STATUS_STYLES: Record<BlueprintStatus, string> = {
  DRAFT: "bg-violet-500/10 text-violet-300",
  IN_REVIEW: "bg-amber-500/10 text-amber-300",
  APPROVED: "bg-green-500/10 text-green-300",
  ARCHIVED: "bg-slate-500/10 text-slate-400",
};
