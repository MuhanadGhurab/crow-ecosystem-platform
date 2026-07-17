"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { CROW_STORY_DEFINITION, resolveChapterCopy } from "@/lib/crow-story/definition";
import {
  buildLoginHandoffUrl,
  buildSignupHandoffUrl,
  parseJourneyUrlParam,
  persistCommittedJourney,
  persistSoftJourney,
  resetJourneySelection,
  resolveJourneyState,
} from "@/lib/crow-story/journey-state";
import type { JourneyKind } from "@/lib/crow-story/types";
import { routes } from "@/lib/routes";
import { CrowStoryDecision } from "@/components/crow-story/crow-story-decision";
import { CrowStoryJourneyLabel } from "@/components/crow-story/crow-story-journey-label";

export function CrowStoryArticleControls() {
  const searchParams = useSearchParams();
  const [journey, setJourney] = useState<JourneyKind | null>(null);

  useEffect(() => {
    const resolved = resolveJourneyState(searchParams.get("journey"));
    setJourney(resolved.journey);
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
    <div className="space-y-4">
      {journey ? <CrowStoryJourneyLabel journey={journey} onChangePath={onReset} /> : null}
      <CrowStoryDecision selected={journey} onSelect={onSelect} />
      <div className="flex flex-wrap gap-3">
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
          Start designing
        </button>
        <Link
          href={journey ? buildLoginHandoffUrl(journey) : routes.auth.login}
          className="cc-btn-secondary min-h-[48px] text-sm"
        >
          Sign in
        </Link>
        <Link href={routes.story.architectsMap} className="cc-btn-secondary min-h-[48px] text-sm">
          Back to interactive story
        </Link>
      </div>
    </div>
  );
}

export function CrowStoryArticleBody() {
  const chapters = CROW_STORY_DEFINITION.chapters;

  return (
    <article className="prose-crow mx-auto max-w-3xl space-y-12 px-4 py-12">
      {chapters.map((ch, i) => {
        const copy = resolveChapterCopy(ch.key, null);
        return (
          <section key={ch.key} aria-labelledby={`article-${ch.key}`}>
            <p className="text-xs font-semibold uppercase tracking-wider text-violet-400/90">
              Chapter {i + 1}
            </p>
            <h2 id={`article-${ch.key}`} className="mt-2 font-display text-2xl font-bold text-white">
              {copy.title}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-300">{copy.headline}</p>
            <p className="mt-3 leading-relaxed text-slate-400">{copy.supporting}</p>
            {copy.detail ? <p className="mt-2 text-sm text-slate-500">{copy.detail}</p> : null}
            <p className="mt-3 text-sm text-slate-600">{ch.a11ySummary}</p>
          </section>
        );
      })}
    </article>
  );
}
