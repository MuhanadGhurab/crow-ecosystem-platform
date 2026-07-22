"use client";

import { useRouter } from "next/navigation";
import type { OnboardingResource } from "@ghuravia/contracts/schemas";
import { OnboardingPageFrame } from "../_components/OnboardingPageFrame";

export function NestResultClient({
  initialOnboarding,
}: {
  initialOnboarding: OnboardingResource;
}) {
  const router = useRouter();

  return (
    <OnboardingPageFrame
      screenId="ONB-005"
      titleKey="onb005Title"
      initialResource={initialOnboarding}
    >
      {({ resource, command, msg, submitting }) => {
        const band = resource.nestReadiness.band;
        const score = resource.nestReadiness.score;
        const bandKey =
          band === "READY_TO_FLY"
            ? "onb005BandReady"
            : band === "GUIDED_SKIP"
              ? "onb005BandGuided"
              : "onb005BandNest";
        const canHorizon = band === "READY_TO_FLY" || band === "GUIDED_SKIP";

        return (
          <>
            <p data-major-state="nest-result" data-nest-band={band ?? ""}>
              {msg("onb005Body")}
            </p>
            <p role="status" data-nest-score={score ?? ""}>
              {msg("onb005ScoreLabel")}: {score ?? "—"}
            </p>
            <h2 data-band-label={band ?? ""}>{msg(bandKey)}</h2>
            <p>{msg("onb005BandExplain")}</p>
            <aside role="note" className="legal-disclaimer">
              <p>{msg("onb005Disclaimer")}</p>
            </aside>

            <div className="cta-stack">
              {!resource.nestReadiness.resultAcknowledged ? (
                <button
                  type="button"
                  disabled={submitting}
                  data-cta="ack-nest-result"
                  onClick={() => {
                    void command("ack-nest-result", {}, { newLogicalOp: true });
                  }}
                >
                  {msg("onb005AckResult")}
                </button>
              ) : null}
              <button
                type="button"
                disabled={submitting}
                data-cta="choose-nest-path"
                onClick={() => {
                  void (async () => {
                    await command(
                      "choose-nest-learning-path",
                      {},
                      { newLogicalOp: true },
                    );
                    router.push("/onboarding/nest-learning-path");
                  })();
                }}
              >
                {msg("onb005ChooseNest")}
              </button>
              {canHorizon ? (
                <button
                  type="button"
                  disabled={submitting}
                  data-cta="continue-horizon"
                  onClick={() => {
                    void (async () => {
                      await command(
                        "continue-to-horizon-handoff",
                        {},
                        { newLogicalOp: true },
                      );
                      router.push("/onboarding/choose-horizon");
                    })();
                  }}
                >
                  {msg("onb005ContinueHorizon")}
                </button>
              ) : (
                <p role="status" data-horizon-blocked="true">
                  {msg("onb005HorizonBlocked")}
                </p>
              )}
            </div>

            <nav aria-label="onboarding">
              <a href="/onboarding/nest-intro">{msg("onb003Title")}</a>
            </nav>
          </>
        );
      }}
    </OnboardingPageFrame>
  );
}
