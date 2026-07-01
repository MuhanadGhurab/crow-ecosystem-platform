import Link from "next/link";
import { Suspense } from "react";

import { CrowStoryArticleBody, CrowStoryArticleControls } from "@/components/crow-story/crow-story-article";
import { routes } from "@/lib/routes";

export const metadata = {
  title: "The Architect's Map — Article — Crow",
  description: "Read how Crow designs governed operating models — plain-language article.",
};

export default function ArchitectsMapArticlePage() {
  return (
    <div className="pb-20">
      <header className="cc-safe-x mx-auto max-w-3xl px-4 pb-8 pt-12">
        <p className="text-xs font-semibold uppercase tracking-wider text-violet-400/90">Article mode</p>
        <h1 className="mt-3 font-display text-3xl font-bold text-white">The Architect&apos;s Map</h1>
        <p className="mt-4 text-slate-400">
          All seven chapters — readable without animation or client-side story initialization.
        </p>
        <Link
          href={routes.story.architectsMap}
          className="mt-4 inline-block text-sm text-violet-400 hover:text-violet-300"
        >
          ← Back to interactive story
        </Link>
      </header>

      <CrowStoryArticleBody />

      <div className="mx-auto max-w-3xl border-t border-white/[0.06] px-4 py-10">
        <h2 className="font-display text-lg font-semibold text-white">Choose your path</h2>
        <Suspense fallback={<p className="mt-4 text-sm text-slate-500">Loading…</p>}>
          <div className="mt-6">
            <CrowStoryArticleControls />
          </div>
        </Suspense>
      </div>
    </div>
  );
}
