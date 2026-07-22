"use client";

import { useRouter } from "next/navigation";
import type {
  ActivationResource,
  OnboardingResource,
} from "@ghuravia/contracts/schemas";
import { OnboardingPageFrame } from "../_components/OnboardingPageFrame";

export function OnboardingEntryClient({
  activation,
  initialOnboarding,
}: {
  activation: ActivationResource;
  initialOnboarding: OnboardingResource | null;
}) {
  const router = useRouter();

  return (
    <OnboardingPageFrame
      screenId="ONB-001"
      titleKey="onb001Title"
      initialResource={initialOnboarding}
      activationAggregateId={activation.aggregateId}
    >
      {({ resource, command, msg, submitting }) => {
        const path = resource.personalization.path;
        const majorState =
          path === "GUIDED"
            ? "guided"
            : path === "QUICK_START"
              ? "quick-start"
              : "handoff";

        return (
          <>
            <p data-major-state={majorState}>{msg("onb001Body")}</p>
            <p className="help" role="note">
              <strong>{msg("onb001VisualIdentity")}</strong>
            </p>
            <aside role="note" className="legal-disclaimer">
              <p>{msg("onb001LocalNotice")}</p>
            </aside>
            <p className="help">{msg("onb001TimeHint")}</p>

            <div className="cta-stack">
              <button
                type="button"
                className="primary"
                disabled={submitting || path !== null}
                onClick={() => {
                  void command("begin-guided", {}, { newLogicalOp: true }).then(
                    () => {
                      router.push("/onboarding/crow");
                    },
                  );
                }}
              >
                {msg("onb001Guided")}
              </button>
              <button
                type="button"
                disabled={submitting || path !== null}
                onClick={() => {
                  void command(
                    "begin-quick-start",
                    {},
                    { newLogicalOp: true },
                  ).then(() => {
                    router.push("/onboarding/crow");
                  });
                }}
              >
                {msg("onb001QuickStart")}
              </button>
            </div>

            <details className="why-crow">
              <summary>{msg("onb001WhyCrow")}</summary>
              <p>{msg("onb001WhyCrowBody")}</p>
            </details>

            {path ? (
              <nav aria-label="onboarding">
                <a href="/onboarding/crow">{msg("idn001Title")}</a>
                {" · "}
                <a href="/activation/complete">{msg("act006Title")}</a>
              </nav>
            ) : (
              <nav aria-label="activation">
                <a href="/activation/complete">{msg("act006Title")}</a>
                {" · "}
                <a href="/activation/mobile-optional">{msg("act007Title")}</a>
              </nav>
            )}
          </>
        );
      }}
    </OnboardingPageFrame>
  );
}
