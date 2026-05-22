import {
  BLUEPRINT_STATUS_LABELS,
  BLUEPRINT_STATUS_STYLES,
  type BlueprintStatus,
} from "@/lib/constants/blueprint-status";

export function BlueprintStatusBadge({ status }: { status: string }) {
  const key = status as BlueprintStatus;
  const label = BLUEPRINT_STATUS_LABELS[key] ?? status;
  const style = BLUEPRINT_STATUS_STYLES[key] ?? "bg-slate-500/10 text-slate-300";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-medium ${style}`}>{label}</span>
  );
}
