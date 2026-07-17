import type { TenantScaleDimensions } from "@/lib/model-forge/types";

const DIMENSION_LABELS: { key: keyof TenantScaleDimensions; label: string }[] = [
  { key: "workforceScale", label: "Workforce" },
  { key: "branchScale", label: "Branches" },
  { key: "workflowVolume", label: "Volume" },
  { key: "workflowComplexity", label: "Complexity" },
  { key: "approvalDepth", label: "Approvals" },
  { key: "regulatoryIntensity", label: "Regulation" },
];

export function ScaleDimensionProfile({ dimensions }: { dimensions: TenantScaleDimensions }) {
  return (
    <div className="space-y-2" role="img" aria-label="Tenant scale dimension profile">
      {DIMENSION_LABELS.map(({ key, label }) => {
        const value = dimensions[key];
        const pct = Math.min(100, value * 10);
        return (
          <div key={key}>
            <div className="mb-0.5 flex justify-between text-[10px] text-slate-500">
              <span>{label}</span>
              <span>{value}/10</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-600 to-violet-600 transition-all duration-200 motion-reduce:transition-none"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
