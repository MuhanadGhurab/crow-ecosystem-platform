import { PROCROW_OPERATOR_WORKFLOW_STEPS } from "@/lib/constants/procrow-admin-nav";
import { ProductFlowStep } from "@/components/product/product-flow-step";
import { ProductSection } from "@/components/product/product-section";

type ProCrowWorkflowStripProps = {
  activeStepId?: string;
  compact?: boolean;
};

export function ProCrowWorkflowStrip({ activeStepId, compact }: ProCrowWorkflowStripProps) {
  return (
    <ProductSection
      title="Request-to-tenant workflow"
      description="Operator guidance only — no automation. ProCrow prepares; tenant runtime operates."
    >
      <div
        className={`flex gap-2 ${compact ? "flex-wrap" : "overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"}`}
      >
        {PROCROW_OPERATOR_WORKFLOW_STEPS.map((step, i) => (
          <ProductFlowStep
            key={step.id}
            index={i + 1}
            label={step.label}
            href={step.href}
            active={activeStepId === step.id}
          />
        ))}
      </div>
    </ProductSection>
  );
}
