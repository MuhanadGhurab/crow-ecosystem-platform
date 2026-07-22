"use client";

import type { OnboardingResource } from "@ghuravia/contracts/schemas";
import { OnboardingPageFrame } from "../_components/OnboardingPageFrame";

export function NestLearningPathClient({
  initialOnboarding,
}: {
  initialOnboarding: OnboardingResource;
}) {
  return (
    <OnboardingPageFrame
      screenId="ONB-006"
      titleKey="onb006Title"
      initialResource={initialOnboarding}
    >
      {({ msg }) => (
        <>
          <p data-major-state="nest-learning-handoff">{msg("onb006Body")}</p>
          <aside role="note" className="legal-disclaimer">
            <p>{msg("onb006HandoffNote")}</p>
          </aside>
          <nav aria-label="onboarding">
            <a href="/onboarding/nest-intro">{msg("onb003Title")}</a>
          </nav>
        </>
      )}
    </OnboardingPageFrame>
  );
}
