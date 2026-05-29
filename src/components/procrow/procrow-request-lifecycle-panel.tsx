import { requestStatusToOperatorQueueHint } from "@/lib/procrow/procrow-request-status-queue-hint";
import { PROCROW_OPERATOR_WORKFLOW_STEPS } from "@/lib/constants/procrow-admin-nav";
import type { ImplementationRequestStatus } from "@/lib/types/platform";
import { ProductFlowStep } from "@/components/product/product-flow-step";

/** Map request status to approximate workflow step id for highlighting. */
function activeStepIdForStatus(status: ImplementationRequestStatus): string {
  switch (status) {
    case "PENDING_REVIEW":
    case "DRAFT":
    case "APPROVED":
      return "intake";
    case "UNDER_DISCOVERY":
      return "discovery";
    case "BLUEPRINT_BUILD":
      return "proposal";
    case "TENANT_PROVISIONING":
    case "SECURITY_INIT":
    case "SAREA_INIT":
      return "onboarding";
    case "GO_LIVE":
      return "handoff";
    case "REJECTED":
    case "CANCELLED":
      return "gono";
    default:
      return "intake";
  }
}

type ProCrowRequestLifecyclePanelProps = {
  status: ImplementationRequestStatus;
  proposalStatus?: string | null;
};

export function ProCrowRequestLifecyclePanel({ status, proposalStatus }: ProCrowRequestLifecyclePanelProps) {
  const activeId = activeStepIdForStatus(status);
  const stageLabel = requestStatusToOperatorQueueHint(status);

  return (
    <div className="cc-glass-card space-y-4 !p-4 sm:!p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Lifecycle stage</p>
          <p className="mt-1 text-lg font-medium text-white">{stageLabel}</p>
        </div>
        {proposalStatus && (
          <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-violet-200">
            Proposal: {proposalStatus.replace(/_/g, " ")}
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {PROCROW_OPERATOR_WORKFLOW_STEPS.map((step, i) => (
          <ProductFlowStep
            key={step.id}
            index={i + 1}
            label={step.label}
            href={step.href}
            active={step.id === activeId}
          />
        ))}
      </div>
      <p className="text-[11px] text-slate-600">
        Operator guidance only — statuses are not mutated from this panel. Production remains F23-gated.
      </p>
    </div>
  );
}
