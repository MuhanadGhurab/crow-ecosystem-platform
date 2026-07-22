"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { OnboardingResource } from "@ghuravia/contracts/schemas";
import { OnboardingPageFrame } from "../_components/OnboardingPageFrame";
import { CHARACTER_OPTIONS } from "../_components/catalogue-options";

export function CharacterClient({
  initialOnboarding,
}: {
  initialOnboarding: OnboardingResource;
}) {
  const router = useRouter();
  const [character, setCharacter] = useState(
    initialOnboarding.personalization.characterOptionId ??
      "character.curious_scout",
  );

  return (
    <OnboardingPageFrame
      screenId="IDN-003"
      titleKey="idn003Title"
      initialResource={initialOnboarding}
    >
      {({ command, msg, submitting }) => (
        <>
          <p data-major-state="character">{msg("idn003Body")}</p>
          <fieldset>
            <legend>{msg("idn003Title")}</legend>
            {CHARACTER_OPTIONS.map((opt) => (
              <label key={opt.id}>
                <input
                  type="radio"
                  name="character"
                  value={opt.id}
                  checked={!opt.locked && character === opt.id}
                  disabled={opt.locked}
                  onChange={() => {
                    if (!opt.locked) setCharacter(opt.id);
                  }}
                />
                {msg(opt.labelKey)}
                {opt.locked ? ` — ${msg("idn003LockedCharacter")}` : ""}
              </label>
            ))}
          </fieldset>
          <aside role="note" className="help" data-locked-cosmetic="character">
            <p>{msg("idn003LockedExplain")}</p>
          </aside>
          <p>
            <button
              type="button"
              className="primary"
              disabled={submitting}
              onClick={() => {
                void command(
                  "select-character",
                  { characterOptionId: character },
                  { newLogicalOp: true },
                ).then(() => {
                  router.push("/onboarding/crow");
                });
              }}
            >
              {msg("idn003Continue")}
            </button>
          </p>
          <nav aria-label="onboarding">
            <a href="/onboarding/habitat">{msg("idn002Title")}</a>
          </nav>
        </>
      )}
    </OnboardingPageFrame>
  );
}
