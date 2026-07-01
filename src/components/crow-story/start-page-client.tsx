"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { CrowStoryDecision } from "@/components/crow-story/crow-story-decision";
import { CrowStoryJourneyLabel } from "@/components/crow-story/crow-story-journey-label";
import {
  buildLoginHandoffUrl,
  buildSignupHandoffUrl,
  persistCommittedJourney,
  persistSoftJourney,
  resetJourneySelection,
  resolveJourneyState,
} from "@/lib/crow-story/journey-state";
import type { JourneyKind } from "@/lib/crow-story/types";
import { routes } from "@/lib/routes";

export function StartPageClient() {
  const searchParams = useSearchParams();
  const [journey, setJourney] = useState<JourneyKind | null>(null);

  useEffect(() => {
    setJourney(resolveJourneyState(searchParams.get("journey")).journey);
  }, [searchParams]);

  const onSelect = useCallback((kind: JourneyKind) => {
    setJourney(kind);
    persistSoftJourney(kind);
    const url = new URL(window.location.href);
    url.searchParams.set("journey", kind === "NEW" ? "new" : "transform");
    window.history.replaceState({}, "", url.toString());
  }, []);

  const onReset = useCallback(() => {
    resetJourneySelection();
    setJourney(null);
    const url = new URL(window.location.href);
    url.searchParams.delete("journey");
    window.history.replaceState({}, "", url.toString());
  }, []);

  return (
    <div className="cc-safe-x mx-auto max-w-2xl px-4 py-16 pb-28">
      <p className="text-xs font-semibold uppercase tracking-wider text-violet-400/90">Start</p>
      <h1 className="mt-4 font-display text-3xl font-bold text-white">
        How will Crow help your organization?
      </h1>
      <p className="mt-4 text-slate-400">
        Choose a path to preview your journey. You can change this before creating an account.
      </p>

      {journey ? <CrowStoryJourneyLabel journey={journey} onChangePath={onReset} /> : null}

      <CrowStoryDecision selected={journey} onSelect={onSelect} className="mt-8" />

      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <button
          type="button"
          className="cc-btn-primary min-h-[48px] text-sm"
          disabled={!journey}
          onClick={() => {
            if (!journey) return;
            persistCommittedJourney(journey);
            window.location.href = buildSignupHandoffUrl(journey);
          }}
        >
          {journey === "TRANSFORM"
            ? "Transform an Existing Organization"
            : journey === "NEW"
              ? "Build a New Organization"
              : "Select a path above"}
        </button>
        <Link
          href={journey ? buildLoginHandoffUrl(journey) : routes.auth.login}
          className="cc-btn-secondary min-h-[48px] text-sm"
        >
          Sign In
        </Link>
      </div>

      <div className="mt-10 flex flex-wrap gap-4 text-sm">
        <Link href={routes.public.home} className="text-slate-500 hover:text-slate-300">
          Back to Home
        </Link>
        <Link href={routes.story.architectsMap} className="text-violet-400 hover:text-violet-300">
          Explore the Story
        </Link>
      </div>
    </div>
  );
}
