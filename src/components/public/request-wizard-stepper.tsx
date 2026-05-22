"use client";

const STEPS = [
  { id: "01", label: "Organization", entity: null },
  { id: "02", label: "Plan", entity: "cem" as const },
  { id: "03", label: "Modules", entity: "cem" as const },
  { id: "04", label: "Security", entity: "cybercrow" as const },
  { id: "05", label: "Contact", entity: null },
] as const;

type RequestWizardStepperProps = {
  activeStep: string;
  onStepClick?: (step: string) => void;
};

export function RequestWizardStepper({ activeStep, onStepClick }: RequestWizardStepperProps) {
  return (
    <nav className="cc-request-stepper" aria-label="Request wizard steps">
      {STEPS.map((step) => {
        const active = activeStep === step.id;
        const entityClass = step.entity ? `cc-request-stepper-pill--${step.entity}` : "";
        return (
          <button
            key={step.id}
            type="button"
            onClick={() => onStepClick?.(step.id)}
            className={`cc-request-stepper-pill ${
              active ? `cc-request-stepper-pill--active ${entityClass}` : "cc-request-stepper-pill--idle"
            }`}
          >
            <span className="font-mono text-[10px] text-cc-star">{step.id}</span>
            {step.label}
          </button>
        );
      })}
    </nav>
  );
}
