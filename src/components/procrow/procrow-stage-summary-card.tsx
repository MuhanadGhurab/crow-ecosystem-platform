type ProCrowStageSummaryCardProps = {
  label: string;
  value: string;
  hint?: string;
  tone?: "default" | "attention" | "success" | "muted";
};

const toneClass = {
  default: "border-cyan-500/20 bg-cyan-500/5 text-cyan-100",
  attention: "border-amber-500/30 bg-amber-500/10 text-amber-100",
  success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-100",
  muted: "border-slate-700/60 bg-white/[0.02] text-slate-300",
} as const;

export function ProCrowStageSummaryCard({
  label,
  value,
  hint,
  tone = "default",
}: ProCrowStageSummaryCardProps) {
  return (
    <div className={`rounded-lg border px-3 py-2.5 ${toneClass[tone]}`}>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{label}</p>
      <p className="mt-0.5 text-sm font-medium">{value}</p>
      {hint && <p className="mt-1 text-[11px] text-slate-500">{hint}</p>}
    </div>
  );
}
