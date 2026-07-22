"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { OnboardingResource } from "@ghuravia/contracts/schemas";
import { NEST_READINESS_ITEMS } from "@ghuravia/domain";
import { useLocale } from "../../../lib/locale-context";
import { OnboardingPageFrame } from "../_components/OnboardingPageFrame";

export function NestAssessmentClient({
  initialOnboarding,
}: {
  initialOnboarding: OnboardingResource;
}) {
  const router = useRouter();
  const { locale } = useLocale();
  const answered = initialOnboarding.nestReadiness.answeredItemIds;
  const startIndex = Math.min(answered.length, NEST_READINESS_ITEMS.length - 1);
  const [index, setIndex] = useState(startIndex);
  const [selected, setSelected] = useState<string | null>(null);

  const item = NEST_READINESS_ITEMS[index]!;

  return (
    <OnboardingPageFrame
      screenId="ONB-004"
      titleKey="onb004Title"
      initialResource={initialOnboarding}
    >
      {({ resource, command, msg, submitting }) => {
        const nest = resource.nestReadiness;
        const canSubmit = nest.canSubmit || nest.answerCount === 10;
        const prompt = locale === "ar" ? item.promptAr : item.promptEn;

        return (
          <>
            <p data-major-state="nest-assessment">{msg("onb004Body")}</p>
            <p
              role="status"
              data-nest-progress={`${index + 1}/${NEST_READINESS_ITEMS.length}`}
            >
              {msg("onb004Progress")
                .replace("{n}", String(index + 1))
                .replace("{total}", String(NEST_READINESS_ITEMS.length))}
            </p>

            <fieldset>
              <legend>{prompt}</legend>
              {item.options.map((opt) => {
                const label = locale === "ar" ? opt.labelAr : opt.labelEn;
                return (
                  <label key={opt.id}>
                    <input
                      type="radio"
                      name={`nest-item-${item.id}`}
                      value={opt.id}
                      checked={selected === opt.id}
                      onChange={() => setSelected(opt.id)}
                    />
                    {label}
                  </label>
                );
              })}
            </fieldset>

            <div className="cta-stack">
              <button
                type="button"
                disabled={submitting || index === 0}
                onClick={() => {
                  setSelected(null);
                  setIndex((i) => Math.max(0, i - 1));
                }}
              >
                {msg("onb004Previous")}
              </button>
              <button
                type="button"
                disabled={submitting || !selected}
                data-cta="nest-save-next"
                onClick={() => {
                  if (!selected) return;
                  void (async () => {
                    await command(
                      "save-nest-answer",
                      {
                        nestItemId: item.id,
                        nestOptionId: selected,
                      },
                      { newLogicalOp: true },
                    );
                    if (index < NEST_READINESS_ITEMS.length - 1) {
                      setSelected(null);
                      setIndex((i) => i + 1);
                    }
                  })();
                }}
              >
                {msg("onb004SaveNext")}
              </button>
              {canSubmit ||
              (index === NEST_READINESS_ITEMS.length - 1 && selected) ? (
                <button
                  type="button"
                  disabled={submitting}
                  data-cta="nest-submit"
                  onClick={() => {
                    void (async () => {
                      if (selected) {
                        await command(
                          "save-nest-answer",
                          {
                            nestItemId: item.id,
                            nestOptionId: selected,
                          },
                          { newLogicalOp: true },
                        );
                      }
                      await command(
                        "submit-nest-assessment",
                        {},
                        { newLogicalOp: true },
                      );
                      router.push("/onboarding/nest-result");
                    })();
                  }}
                >
                  {msg("onb004Submit")}
                </button>
              ) : null}
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
