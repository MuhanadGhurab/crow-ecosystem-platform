"use client";

import Link from "next/link";
import { CROW_STORY_DEFINITION } from "@/lib/crow-story/definition";
import { routes } from "@/lib/routes";

export function CrowStoryNavigation({
  activeIndex,
  total,
  manualReduced,
  onToggleReduced,
  onSkip,
  onChapterSelect,
}: {
  activeIndex: number;
  total: number;
  manualReduced: boolean;
  onToggleReduced: () => void;
  onSkip: () => void;
  onChapterSelect?: (index: number) => void;
}) {
  const chapters = CROW_STORY_DEFINITION.chapters;

  return (
    <nav
      className="sticky top-0 z-30 border-b border-white/[0.06] bg-[#04060c]/90 backdrop-blur-sm"
      aria-label="Story chapters"
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 lg:px-6">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <Link href={routes.public.home} className="text-slate-500 hover:text-slate-300">
            Home
          </Link>
          <span className="text-slate-700">/</span>
          <span className="text-slate-400">Architect&apos;s Map</span>
        </div>

        <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Chapter progress">
          {chapters.map((ch, i) => (
            <button
              key={ch.key}
              type="button"
              role="tab"
              aria-selected={i === activeIndex}
              aria-current={i === activeIndex ? "step" : undefined}
              aria-label={`Chapter ${i + 1}: ${ch.title}`}
              onClick={() => onChapterSelect?.(i)}
              className={`h-2.5 w-2.5 rounded-full motion-reduce:transition-none ${
                i === activeIndex ? "bg-cyan-400" : i < activeIndex ? "bg-violet-500/60" : "bg-slate-700"
              }`}
            />
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
          <Link
            href={routes.story.architectsMapArticle}
            className="min-h-[44px] px-2 py-2 text-slate-400 hover:text-white"
          >
            Read as article
          </Link>
          <button
            type="button"
            onClick={onToggleReduced}
            aria-pressed={manualReduced}
            className="min-h-[44px] px-2 py-2 text-slate-400 hover:text-white"
          >
            Reduced motion
          </button>
          <button
            type="button"
            onClick={onSkip}
            className="min-h-[44px] px-2 py-2 text-violet-400 hover:text-violet-300"
          >
            Skip story
          </button>
        </div>
      </div>
      <div className="h-0.5 bg-slate-800">
        <div
          className="h-full bg-gradient-to-r from-violet-600 to-cyan-500 motion-reduce:transition-none"
          style={{
            width: `${((activeIndex + 1) / total) * 100}%`,
            transition: "width 220ms ease",
          }}
        />
      </div>
    </nav>
  );
}
