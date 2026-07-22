"use client";

import type { OnboardingResource } from "@ghuravia/contracts/schemas";
import { OnboardingPageFrame } from "../_components/OnboardingPageFrame";

export function ChooseHorizonClient({
  initialOnboarding,
}: {
  initialOnboarding: OnboardingResource;
}) {
  return (
    <OnboardingPageFrame
      screenId="ONB-007"
      titleKey="onb007Title"
      initialResource={initialOnboarding}
    >
      {({ msg, command, submitting }) => (
        <>
          <p data-major-state="horizon-choice-handoff">{msg("onb007Body")}</p>
          <aside role="note" className="legal-disclaimer">
            <p>{msg("onb007HandoffNote")}</p>
          </aside>
          <p>
            <button
              type="button"
              disabled={submitting}
              data-cta="return-nest-path"
              onClick={() => {
                void command(
                  "choose-nest-learning-path",
                  {},
                  { newLogicalOp: true },
                );
              }}
            >
              {msg("onb007ReturnNest")}
            </button>
          </p>
          <nav aria-label="onboarding">
            <a href="/onboarding/nest-result">{msg("onb005Title")}</a>
          </nav>
        </>
      )}
    </OnboardingPageFrame>
  );
}
