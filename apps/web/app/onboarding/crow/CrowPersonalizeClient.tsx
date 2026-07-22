"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { OnboardingResource } from "@ghuravia/contracts/schemas";
import { OnboardingPageFrame } from "../_components/OnboardingPageFrame";
import {
  ACCESSORY_OPTIONS,
  COLOR_OPTIONS,
  CROW_OPTIONS,
  STYLE_OPTIONS,
} from "../_components/catalogue-options";

export function CrowPersonalizeClient({
  initialOnboarding,
}: {
  initialOnboarding: OnboardingResource;
}) {
  const router = useRouter();
  const p = initialOnboarding.personalization;
  const [crow, setCrow] = useState(p.crowOptionId ?? "crow.classic");
  const [color, setColor] = useState(p.colorOptionId ?? "color.ink_sand");
  const [style, setStyle] = useState(p.styleOptionId ?? "style.calm");
  const [accessory, setAccessory] = useState(
    p.accessoryOptionId ?? "accessory.none",
  );
  const [contrastAck, setContrastAck] = useState(
    p.contrastOverrideAcknowledged,
  );
  const [privacyAck, setPrivacyAck] = useState(p.privacyPreviewAcknowledged);
  const [lockedPreview, setLockedPreview] = useState(false);
  const showReview =
    Boolean(p.habitatOptionId && p.characterOptionId) ||
    p.status === "MINIMUM_COMPLETE" ||
    p.status === "REVIEWED" ||
    p.path === "QUICK_START";

  return (
    <OnboardingPageFrame
      screenId="IDN-001"
      titleKey="idn001Title"
      initialResource={initialOnboarding}
    >
      {({ resource, command, msg, submitting }) => {
        const canReview =
          showReview ||
          Boolean(
            resource.personalization.habitatOptionId &&
            resource.personalization.characterOptionId,
          ) ||
          resource.personalization.path === "QUICK_START" ||
          resource.state === "PERSONALIZATION_MINIMUM_COMPLETE";

        return (
          <>
            <p data-major-state="crow-personalize">{msg("idn001Body")}</p>

            <fieldset>
              <legend>{msg("idn001CrowLegend")}</legend>
              {CROW_OPTIONS.map((opt) => (
                <label key={opt.id}>
                  <input
                    type="radio"
                    name="crow"
                    value={opt.id}
                    checked={crow === opt.id}
                    onChange={() => setCrow(opt.id)}
                  />
                  {msg(opt.labelKey)}
                </label>
              ))}
            </fieldset>

            <fieldset>
              <legend>{msg("idn001ColorLegend")}</legend>
              {COLOR_OPTIONS.map((opt) => (
                <label key={opt.id}>
                  <input
                    type="radio"
                    name="color"
                    value={opt.id}
                    checked={color === opt.id}
                    onChange={() => setColor(opt.id)}
                  />
                  {msg(opt.labelKey)}
                </label>
              ))}
            </fieldset>

            <fieldset>
              <legend>{msg("idn001StyleLegend")}</legend>
              {STYLE_OPTIONS.map((opt) => (
                <label key={opt.id}>
                  <input
                    type="radio"
                    name="style"
                    value={opt.id}
                    checked={style === opt.id}
                    onChange={() => setStyle(opt.id)}
                  />
                  {msg(opt.labelKey)}
                </label>
              ))}
            </fieldset>

            <fieldset>
              <legend>{msg("idn001AccessoryLegend")}</legend>
              {ACCESSORY_OPTIONS.map((opt) => (
                <label key={opt.id}>
                  <input
                    type="radio"
                    name="accessory"
                    value={opt.id}
                    checked={!opt.locked && accessory === opt.id}
                    disabled={opt.locked}
                    onChange={() => {
                      if (!opt.locked) setAccessory(opt.id);
                    }}
                    onFocus={() => {
                      if (opt.locked) setLockedPreview(true);
                    }}
                  />
                  {msg(opt.labelKey)}
                  {opt.locked ? ` — ${msg("idn001LockedAccessory")}` : ""}
                </label>
              ))}
            </fieldset>

            {lockedPreview || ACCESSORY_OPTIONS.some((o) => o.locked) ? (
              <aside
                role="note"
                className="help"
                data-locked-cosmetic="accessory"
              >
                <p>{msg("idn001LockedExplain")}</p>
              </aside>
            ) : null}

            <label>
              <input
                type="checkbox"
                checked={contrastAck}
                onChange={(e) => setContrastAck(e.target.checked)}
              />
              {msg("idn001ContrastAck")}
            </label>

            <p>
              <button
                type="button"
                className="primary"
                disabled={submitting || !contrastAck}
                onClick={() => {
                  void command(
                    "save-crow-basics",
                    {
                      crowOptionId: crow,
                      colorOptionId: color,
                      styleOptionId: style,
                      accessoryOptionId: accessory,
                      contrastOverrideAcknowledged: contrastAck,
                    },
                    { newLogicalOp: true },
                  ).then(() => {
                    router.push("/onboarding/habitat");
                  });
                }}
              >
                {msg("idn001ContinueHabitat")}
              </button>
            </p>

            {canReview ? (
              <section
                aria-labelledby="review-heading"
                data-major-state="personalization-review"
              >
                <h2 id="review-heading">{msg("idn001ReviewTitle")}</h2>
                <label>
                  <input
                    type="checkbox"
                    checked={privacyAck}
                    onChange={(e) => setPrivacyAck(e.target.checked)}
                  />
                  {msg("idn001PrivacyAck")}
                </label>
                <p>
                  <button
                    type="button"
                    disabled={submitting || !privacyAck}
                    onClick={() => {
                      void command(
                        "save-personalization-review",
                        {
                          privacyPreviewAcknowledged: privacyAck,
                        },
                        { newLogicalOp: true },
                      ).then(() => {
                        router.push("/onboarding/origin");
                      });
                    }}
                  >
                    {msg("idn001SaveReview")}
                  </button>
                </p>
              </section>
            ) : null}

            <nav aria-label="onboarding">
              <a href="/onboarding/entry">{msg("onb001Title")}</a>
            </nav>
          </>
        );
      }}
    </OnboardingPageFrame>
  );
}
