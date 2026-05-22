import {
  REQUEST_STATUS_LABELS,
  REQUEST_STATUS_STYLES,
} from "@/lib/constants/request-status";
import type { ImplementationRequestStatus } from "@/lib/types/platform";

export function RequestStatusBadge({ status }: { status: ImplementationRequestStatus }) {
  const label = REQUEST_STATUS_LABELS[status] ?? status;
  const style = REQUEST_STATUS_STYLES[status] ?? "bg-slate-500/10 text-slate-300";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-medium ${style}`}>{label}</span>
  );
}
