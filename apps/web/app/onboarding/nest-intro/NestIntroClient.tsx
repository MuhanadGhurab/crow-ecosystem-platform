"use client";

import type { OnboardingResource } from "@ghuravia/contracts/schemas";
import { OnboardingPageFrame } from "../_components/OnboardingPageFrame";

export function NestIntroClient({
  initialOnboarding,
}: {
  initialOnboarding: OnboardingResource;
}) {
  return (
    <OnboardingPageFrame
      screenId="ONB-003"
      titleKey="onb003Title"
      initialResource={initialOnboarding}
    >
      {({ command, msg, submitting, resource }) => (
        <>
          <p data-major-state="handoff">{msg("onb003Body")}</p>
          <p className="help">{msg("onb003NestExplain")}</p>
          <aside role="note" className="legal-disclaimer">
            <p>{msg("onb003DeferredNote")}</p>
          </aside>

          <div className="cta-stack">
            <button type="button" disabled>
              {msg("onb003StartDeferred")}
            </button>
            <button type="button" disabled>
              {msg("onb003ReviewDeferred")}
            </button>
            <button type="button" disabled>
              {msg("onb003TestDeferred")}
            </button>
          </div>

          {resource.state !== "NEST_INTRO_HANDOFF" ? (
            <p>
              <button
                type="button"
                disabled={submitting}
                onClick={() => {
                  void command("ack-nest-intro", {}, { newLogicalOp: true });
                }}
              >
                {msg("onb003AckHandoff")}
              </button>
            </p>
          ) : (
            <p role="status" data-nest-ack="true">
              {msg("onb003AckHandoff")} ✓
            </p>
          )}

          <nav aria-label="onboarding">
            <a href="/onboarding/origin">{msg("onb003BackOrigin")}</a>
          </nav>
        </>
      )}
    </OnboardingPageFrame>
  );
}
