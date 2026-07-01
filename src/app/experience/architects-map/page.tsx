import dynamic from "next/dynamic";
import Link from "next/link";
import { Suspense } from "react";

import { CROW_STORY_DEFINITION } from "@/lib/crow-story/definition";
import { routes } from "@/lib/routes";

const CrowStoryInteractive = dynamic(
  () => import("@/components/crow-story/crow-story-interactive").then((m) => m.CrowStoryInteractive),
  {
    loading: () => <CrowStoryPageFallback />,
  },
);

function CrowStoryPageFallback() {
  const idea = CROW_STORY_DEFINITION.chapters[0]!;
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <p className="text-xs font-semibold uppercase tracking-wider text-violet-400/90">Loading story…</p>
      <h1 className="mt-4 font-display text-3xl font-bold text-white">{idea.headline}</h1>
      <p className="mt-4 text-lg text-slate-400">{idea.supporting}</p>
      <p className="mt-6 text-sm text-slate-500">
        <Link href={routes.story.architectsMapArticle} className="text-violet-400 hover:text-violet-300">
          Read as article
        </Link>{" "}
        while the interactive experience loads.
      </p>
    </div>
  );
}

export const metadata = {
  title: "The Architect's Map — Crow",
  description:
    "Understand how Crow designs operating models from purpose, Work Personas, workflows, and governed Blueprint.",
};

export default function ArchitectsMapPage() {
  const idea = CROW_STORY_DEFINITION.chapters[0]!;

  return (
    <div className="pb-20">
      <a
        href="#story-chapter-idea"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-slate-900 focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to story content
      </a>

      <header className="cc-safe-x mx-auto max-w-3xl px-4 pb-8 pt-12 text-center lg:max-w-7xl lg:text-left">
        <p className="text-xs font-semibold uppercase tracking-wider text-violet-400/90">
          The Architect&apos;s Map
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">{idea.title}</h1>
        <p className="mx-auto mt-4 max-w-prose text-slate-400 lg:mx-0">{idea.a11ySummary}</p>
      </header>

      <main id="story-content">
        <Suspense fallback={<CrowStoryPageFallback />}>
          <CrowStoryInteractive />
        </Suspense>
      </main>
    </div>
  );
}
