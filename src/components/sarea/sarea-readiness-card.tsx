import type { SareaProfileReadinessStatus } from "@/lib/constants/sarea-ux-depth";
import { SAREA_PROFILE_READINESS_LABELS } from "@/lib/constants/sarea-ux-depth";

type SareaReadinessCardProps = {
  label: string;
  value: string | number;
  status?: SareaProfileReadinessStatus;
  hint?: string;
};

const STATUS_RING: Record<SareaProfileReadinessStatus, string> = {
  tenant_backed: "border-teal-500/30 text-teal-200",
  fallback: "border-violet-500/30 text-violet-200",
  needs_mapping: "border-amber-500/30 text-amber-200",
  needs_review: "border-amber-500/30 text-amber-200",
  incomplete: "border-slate-500/30 text-slate-300",
};

export function SareaReadinessCard({ label, value, status, hint }: SareaReadinessCardProps) {
  const ring = status ? STATUS_RING[status] : "border-rose-500/20 text-slate-200";

  return (
    <div className={`rounded-cc border bg-white/5 px-4 py-3 ${ring}`}>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{label}</p>
      <p className="mt-1 font-mono text-xl font-semibold">{value}</p>
      {status ? (
        <p className="mt-1 text-[10px] text-slate-500">{SAREA_PROFILE_READINESS_LABELS[status]}</p>
      ) : null}
      {hint ? <p className="mt-1 text-[10px] text-slate-600">{hint}</p> : null}
    </div>
  );
}
