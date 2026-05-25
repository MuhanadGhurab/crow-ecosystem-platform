import {
  lifecycleIndexFromRequestStatus,
  PIPELINE_LIFECYCLE_LABELS,
} from "@/lib/pipeline-lifecycle";
import type {
  TenantHealthSummary,
  TenantPostureSummary,
} from "@/lib/services/tenant-health.service";
import type { ImplementationRequestStatus } from "@/lib/types/platform";

export function TenantPosturePills({
  posture,
  health,
  requestStatus,
}: {
  posture: TenantPostureSummary;
  health: TenantHealthSummary;
  requestStatus?: ImplementationRequestStatus | null;
}) {
  const lifecycleIdx = requestStatus ? lifecycleIndexFromRequestStatus(requestStatus) : -1;
  const lifecycleLabel =
    lifecycleIdx >= 0 ? PIPELINE_LIFECYCLE_LABELS[lifecycleIdx] : null;

  return (
    <div className="flex flex-wrap gap-2">
      {lifecycleLabel && (
        <span className="rounded-full border border-cyan-500/25 bg-cyan-500/10 px-2.5 py-0.5 text-[10px] font-medium text-cyan-200">
          {lifecycleLabel}
        </span>
      )}
      <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-0.5 text-[10px] text-slate-300">
        {posture.enabledModuleCount} CEM modules
      </span>
      <span
        className={`rounded-full border px-2.5 py-0.5 text-[10px] ${
          posture.cybercrowInitialized
            ? "border-violet-500/30 bg-violet-500/10 text-violet-200"
            : "border-white/10 bg-white/[0.02] text-slate-500"
        }`}
      >
        CyberCrow {posture.cybercrowInitialized ? "baseline ✓" : "pending"}
      </span>
      <span
        className={`rounded-full border px-2.5 py-0.5 text-[10px] ${
          posture.sareaProfileCount > 0
            ? "border-rose-500/30 bg-rose-500/10 text-rose-200"
            : "border-white/10 bg-white/[0.02] text-slate-500"
        }`}
      >
        SAREA {posture.sareaProfileCount} profile{posture.sareaProfileCount === 1 ? "" : "s"}
      </span>
      <span
        className={`rounded-full border px-2.5 py-0.5 text-[10px] ${
          health.healthScore === "good"
            ? "border-teal-500/30 bg-teal-500/10 text-teal-200"
            : health.healthScore === "watch"
              ? "border-amber-500/30 bg-amber-500/10 text-amber-200"
              : "border-red-500/30 bg-red-500/10 text-red-300"
        }`}
      >
        {health.healthLabel}
      </span>
    </div>
  );
}
