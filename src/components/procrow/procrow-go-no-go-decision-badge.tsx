import type { ProCrowGoNoGoDecision } from "@/lib/procrow/procrow-go-no-go-contract";

const DECISION_STYLES: Record<ProCrowGoNoGoDecision, string> = {
  go: "border-emerald-500/40 bg-emerald-500/10 text-emerald-200",
  conditional_go: "border-amber-500/40 bg-amber-500/10 text-amber-100",
  no_go: "border-rose-500/40 bg-rose-500/10 text-rose-100",
  blocked: "border-rose-600/50 bg-rose-600/15 text-rose-50",
  not_evaluated: "border-slate-600/50 bg-slate-800/40 text-slate-300",
};

const DECISION_LABEL: Record<ProCrowGoNoGoDecision, string> = {
  go: "Go (operator-reviewed)",
  conditional_go: "Conditional go",
  no_go: "No-go",
  blocked: "Blocked",
  not_evaluated: "Not evaluated",
};

type ProCrowGoNoGoDecisionBadgeProps = {
  decision: ProCrowGoNoGoDecision;
  subtitle?: string;
};

export function ProCrowGoNoGoDecisionBadge({ decision, subtitle }: ProCrowGoNoGoDecisionBadgeProps) {
  return (
    <div className="flex flex-col gap-1">
      <span
        className={`inline-flex w-fit items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${DECISION_STYLES[decision]}`}
        data-procrow="go-no-go-decision"
      >
        {DECISION_LABEL[decision]}
      </span>
      {subtitle ? <span className="text-xs text-slate-500">{subtitle}</span> : null}
    </div>
  );
}
