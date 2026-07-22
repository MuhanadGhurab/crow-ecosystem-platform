"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { OnboardingResource } from "@ghuravia/contracts/schemas";
import { OnboardingPageFrame } from "../_components/OnboardingPageFrame";
import {
  EXPERIENCE_OPTIONS,
  GOAL_OPTIONS,
  REGION_OPTIONS,
} from "../_components/catalogue-options";

export function OriginClient({
  initialOnboarding,
}: {
  initialOnboarding: OnboardingResource;
}) {
  const router = useRouter();
  const o = initialOnboarding.origin;
  const [region, setRegion] = useState(o.regionOption ?? "region.gulf");
  const [experience, setExperience] = useState(
    o.experienceOption ?? "exp.exploring",
  );
  const [goals, setGoals] = useState<string[]>([...o.goalsOptions]);

  const toggleGoal = (id: string) => {
    setGoals((prev) => {
      if (prev.includes(id)) return prev.filter((g) => g !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  return (
    <OnboardingPageFrame
      screenId="ONB-002"
      titleKey="onb002Title"
      initialResource={initialOnboarding}
    >
      {({ resource, command, msg, submitting }) => {
        const originStatus = resource.origin.status;
        const majorState =
          originStatus === "REVIEW_LATER"
            ? "origin-review-later"
            : originStatus === "COMPLETE"
              ? "origin-complete"
              : originStatus === "DRAFT"
                ? "origin-draft"
                : "origin-ready";

        return (
          <>
            <p data-major-state={majorState}>{msg("onb002Body")}</p>

            <fieldset>
              <legend>{msg("onb002RegionLegend")}</legend>
              {REGION_OPTIONS.map((opt) => (
                <label key={opt.id}>
                  <input
                    type="radio"
                    name="region"
                    value={opt.id}
                    checked={region === opt.id}
                    onChange={() => setRegion(opt.id)}
                  />
                  {msg(opt.labelKey)}
                </label>
              ))}
            </fieldset>

            <fieldset>
              <legend>{msg("onb002ExperienceLegend")}</legend>
              {EXPERIENCE_OPTIONS.map((opt) => (
                <label key={opt.id}>
                  <input
                    type="radio"
                    name="experience"
                    value={opt.id}
                    checked={experience === opt.id}
                    onChange={() => setExperience(opt.id)}
                  />
                  {msg(opt.labelKey)}
                </label>
              ))}
            </fieldset>

            <fieldset>
              <legend>{msg("onb002GoalsLegend")}</legend>
              <p className="help">{msg("onb002GoalsHint")}</p>
              {GOAL_OPTIONS.map((opt) => (
                <label key={opt.id}>
                  <input
                    type="checkbox"
                    name="goals"
                    value={opt.id}
                    checked={goals.includes(opt.id)}
                    disabled={!goals.includes(opt.id) && goals.length >= 3}
                    onChange={() => toggleGoal(opt.id)}
                  />
                  {msg(opt.labelKey)}
                </label>
              ))}
            </fieldset>

            <div className="cta-stack">
              <button
                type="button"
                disabled={submitting}
                onClick={() => {
                  void command(
                    "save-origin-draft",
                    {
                      originRegionOption: region,
                      originExperienceOption: experience,
                      originGoalsOptions: goals,
                    },
                    { newLogicalOp: true },
                  );
                }}
              >
                {msg("onb002SaveDraft")}
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={() => {
                  void command(
                    "mark-origin-review-later",
                    {
                      originRegionOption: region,
                      originExperienceOption: experience,
                      originGoalsOptions: goals,
                    },
                    { newLogicalOp: true },
                  ).then(() => {
                    router.push("/onboarding/nest-intro");
                  });
                }}
              >
                {msg("onb002ReviewLater")}
              </button>
              <button
                type="button"
                className="primary"
                disabled={submitting}
                onClick={() => {
                  void command(
                    "complete-origin",
                    {
                      originRegionOption: region,
                      originExperienceOption: experience,
                      originGoalsOptions: goals,
                    },
                    { newLogicalOp: true },
                  ).then(() => {
                    router.push("/onboarding/nest-intro");
                  });
                }}
              >
                {msg("onb002Complete")}
              </button>
            </div>

            <nav aria-label="onboarding">
              <a href="/onboarding/crow">{msg("onb002BackCrow")}</a>
            </nav>
          </>
        );
      }}
    </OnboardingPageFrame>
  );
}
