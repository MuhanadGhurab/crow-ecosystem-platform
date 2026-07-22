"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { OnboardingResource } from "@ghuravia/contracts/schemas";
import { OnboardingPageFrame } from "../_components/OnboardingPageFrame";

export function NestIntroClient({
  initialOnboarding,
}: {
  initialOnboarding: OnboardingResource;
}) {
  const router = useRouter();
  const [coversOpen, setCoversOpen] = useState(false);

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

          {coversOpen ? (
            <section data-nest-covers="open" aria-live="polite">
              <h2>{msg("onb003ReviewDeferred")}</h2>
              <p>{msg("onb003CoversBody")}</p>
            </section>
          ) : null}

          <div className="cta-stack">
            <button
              type="button"
              disabled={submitting}
              data-cta="take-readiness"
              onClick={() => {
                void (async () => {
                  if (resource.state !== "NEST_INTRO_HANDOFF") {
                    await command("ack-nest-intro", {}, { newLogicalOp: true });
                  }
                  await command(
                    "start-nest-assessment",
                    {},
                    { newLogicalOp: true },
                  );
                  router.push("/onboarding/nest-assessment");
                })();
              }}
            >
              {msg("onb003TestDeferred")}
            </button>
            <button
              type="button"
              disabled={submitting}
              data-cta="start-nest-path"
              onClick={() => {
                void (async () => {
                  if (resource.state !== "NEST_INTRO_HANDOFF") {
                    await command("ack-nest-intro", {}, { newLogicalOp: true });
                  }
                  await command(
                    "choose-nest-learning-path",
                    {},
                    { newLogicalOp: true },
                  );
                  router.push("/onboarding/nest-learning-path");
                })();
              }}
            >
              {msg("onb003StartDeferred")}
            </button>
            <button
              type="button"
              data-cta="review-covers"
              aria-expanded={coversOpen}
              onClick={() => setCoversOpen((v) => !v)}
            >
              {msg("onb003ReviewDeferred")}
            </button>
          </div>

          {resource.state !== "NEST_INTRO_HANDOFF" &&
          resource.state !== "NEST_ASSESSMENT_IN_PROGRESS" &&
          resource.state !== "NEST_RESULT_READY" &&
          resource.state !== "NEST_LEARNING_HANDOFF" &&
          resource.state !== "HORIZON_CHOICE_HANDOFF" ? (
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
          ) : resource.state === "NEST_INTRO_HANDOFF" ? (
            <p role="status" data-nest-ack="true">
              {msg("onb003AckHandoff")} ✓
            </p>
          ) : null}

          <nav aria-label="onboarding">
            <a href="/onboarding/origin">{msg("onb003BackOrigin")}</a>
          </nav>
        </>
      )}
    </OnboardingPageFrame>
  );
}
