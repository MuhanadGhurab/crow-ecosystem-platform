"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { OnboardingResource } from "@ghuravia/contracts/schemas";
import { OnboardingPageFrame } from "../_components/OnboardingPageFrame";
import { HABITAT_OPTIONS } from "../_components/catalogue-options";

export function HabitatClient({
  initialOnboarding,
}: {
  initialOnboarding: OnboardingResource;
}) {
  const router = useRouter();
  const [habitat, setHabitat] = useState(
    initialOnboarding.personalization.habitatOptionId ??
      "habitat.coastal_shelf",
  );

  return (
    <OnboardingPageFrame
      screenId="IDN-002"
      titleKey="idn002Title"
      initialResource={initialOnboarding}
    >
      {({ command, msg, submitting }) => (
        <>
          <p data-major-state="habitat">{msg("idn002Body")}</p>
          <fieldset>
            <legend>{msg("idn002Title")}</legend>
            {HABITAT_OPTIONS.map((opt) => (
              <label key={opt.id}>
                <input
                  type="radio"
                  name="habitat"
                  value={opt.id}
                  checked={!opt.locked && habitat === opt.id}
                  disabled={opt.locked}
                  onChange={() => {
                    if (!opt.locked) setHabitat(opt.id);
                  }}
                />
                {msg(opt.labelKey)}
                {opt.locked ? ` — ${msg("idn002LockedHabitat")}` : ""}
              </label>
            ))}
          </fieldset>
          <aside role="note" className="help" data-locked-cosmetic="habitat">
            <p>{msg("idn002LockedExplain")}</p>
          </aside>
          <p>
            <button
              type="button"
              className="primary"
              disabled={submitting}
              onClick={() => {
                void command(
                  "select-habitat",
                  { habitatOptionId: habitat },
                  { newLogicalOp: true },
                ).then(() => {
                  router.push("/onboarding/character");
                });
              }}
            >
              {msg("idn002Continue")}
            </button>
          </p>
          <nav aria-label="onboarding">
            <a href="/onboarding/crow">{msg("idn001Title")}</a>
          </nav>
        </>
      )}
    </OnboardingPageFrame>
  );
}
