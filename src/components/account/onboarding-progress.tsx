import { isPhoneVerificationRequired } from "@/lib/account/phone-verification-policy";

export type OnboardingProgressStep = "legal" | "email" | "phone" | "active";

const STEP_LABELS: Record<OnboardingProgressStep, string> = {
  legal: "Legal",
  email: "Email",
  phone: "Phone",
  active: "Active",
};

function stepsForPolicy(): OnboardingProgressStep[] {
  if (isPhoneVerificationRequired()) {
    return ["legal", "email", "phone", "active"];
  }
  return ["legal", "email", "active"];
}

function stepIndex(steps: OnboardingProgressStep[], current: OnboardingProgressStep): number {
  const idx = steps.indexOf(current);
  return idx >= 0 ? idx : 0;
}

export function OnboardingProgress({ current }: { current: OnboardingProgressStep }) {
  const steps = stepsForPolicy();
  const activeIdx = stepIndex(steps, current);

  return (
    <nav
      aria-label="Onboarding progress"
      className="mb-6 flex flex-wrap items-center gap-2 text-xs text-slate-500"
    >
      {steps.map((step, index) => {
        const done = index < activeIdx;
        const currentStep = index === activeIdx;
        return (
          <span key={step} className="inline-flex items-center gap-2">
            {index > 0 ? <span aria-hidden="true">→</span> : null}
            <span
              className={
                currentStep
                  ? "font-semibold text-cyan-400"
                  : done
                    ? "text-slate-300"
                    : undefined
              }
            >
              {STEP_LABELS[step]}
            </span>
          </span>
        );
      })}
    </nav>
  );
}
