import type { ProCrowOperatorValidationRiskLevel } from "@/lib/procrow/procrow-operator-console-contract";

const STYLES: Record<ProCrowOperatorValidationRiskLevel, string> = {
  read_only: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
  local_only: "border-sky-500/30 bg-sky-500/10 text-sky-200",
  db_write: "border-amber-500/35 bg-amber-500/10 text-amber-200",
  deployment_sensitive: "border-orange-500/35 bg-orange-500/10 text-orange-200",
  do_not_run_casually: "border-rose-500/35 bg-rose-500/10 text-rose-200",
};

const LABELS: Record<ProCrowOperatorValidationRiskLevel, string> = {
  read_only: "Read-only",
  local_only: "Local only",
  db_write: "DB-write",
  deployment_sensitive: "Deploy-sensitive",
  do_not_run_casually: "Do not run casually",
};

type ProCrowCommandRiskBadgeProps = {
  riskLevel: ProCrowOperatorValidationRiskLevel;
};

export function ProCrowCommandRiskBadge({ riskLevel }: ProCrowCommandRiskBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-cc-sm border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${STYLES[riskLevel]}`}
      data-procrow="command-risk"
    >
      {LABELS[riskLevel]}
    </span>
  );
}
