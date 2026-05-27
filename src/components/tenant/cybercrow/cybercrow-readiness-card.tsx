import type { CyberCrowEvidenceReadinessStatus } from "@/lib/constants/cybercrow-ux-depth";
import { CYBERCROW_READINESS_STATUS_LABELS } from "@/lib/constants/cybercrow-ux-depth";

const STATUS_CLASS: Record<CyberCrowEvidenceReadinessStatus, string> = {
  ready: "text-teal-300",
  needs_review: "text-amber-300",
  missing: "text-rose-300",
  advisory: "text-slate-400",
  not_applicable: "text-slate-600",
};

type CybercrowReadinessCardProps = {
  label: string;
  value: string | number;
  hint?: string;
  status?: CyberCrowEvidenceReadinessStatus;
};

export function CybercrowReadinessCard({
  label,
  value,
  hint,
  status,
}: CybercrowReadinessCardProps) {
  return (
    <div className="rounded-cc-sm border border-violet-500/20 bg-violet-500/5 p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold tabular-nums text-violet-200">{value}</p>
      {status ? (
        <p className={`mt-1 text-[10px] font-medium ${STATUS_CLASS[status]}`}>
          {CYBERCROW_READINESS_STATUS_LABELS[status]}
        </p>
      ) : null}
      {hint ? <p className="mt-1 text-[10px] text-slate-600">{hint}</p> : null}
    </div>
  );
}
