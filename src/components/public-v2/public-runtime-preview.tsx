"use client";

import { useState } from "react";

import { RepresentativePreviewLabel } from "@/components/public-v2/representative-preview-label";
import { PUBLIC_RUNTIME_AREAS } from "@/lib/public-v2/representative-data";
import type { PublicRuntimeAreaId } from "@/lib/public-v2/types";
import { PUBLIC_V2_MOTION_CLASS } from "@/lib/public-v2/motion";

const STATUS_STYLE = {
  active: "border-cyan-500/30 text-cyan-200",
  complete: "border-emerald-500/30 text-emerald-200",
  critical: "border-red-500/35 text-red-200",
} as const;

export function PublicRuntimePreview() {
  const [activeId, setActiveId] = useState<PublicRuntimeAreaId>("attention");
  const active = PUBLIC_RUNTIME_AREAS.find((a) => a.id === activeId) ?? PUBLIC_RUNTIME_AREAS[0];

  return (
    <div className="rounded-2xl border border-white/[0.1] bg-white/[0.02] p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Runtime work preview
        </p>
        <RepresentativePreviewLabel />
      </div>

      <div className="mt-4 flex flex-wrap gap-2" role="tablist" aria-label="Runtime work areas">
        {PUBLIC_RUNTIME_AREAS.map((area) => {
          const selected = area.id === activeId;
          return (
            <button
              key={area.id}
              type="button"
              role="tab"
              aria-selected={selected}
              className={`min-h-[44px] rounded-lg border px-3 py-2 text-xs font-medium sm:text-sm ${PUBLIC_V2_MOTION_CLASS.tab} ${
                selected
                  ? "border-cyan-400/35 bg-cyan-500/10 text-cyan-100"
                  : "border-white/[0.08] text-slate-400"
              }`}
              onClick={() => setActiveId(area.id)}
            >
              {area.label}
            </button>
          );
        })}
      </div>

      <div role="tabpanel" className={`mt-4 ${PUBLIC_V2_MOTION_CLASS.panel}`}>
        <p className="text-sm text-slate-400">{active.description}</p>
        <ul className="mt-4 space-y-2" role="list">
          {active.sampleItems.map((item) => (
            <li
              key={item.title}
              className="flex flex-col gap-1 rounded-lg border border-white/[0.06] bg-black/25 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-sm font-medium text-slate-200">{item.title}</p>
                <p className="text-xs text-slate-500">{item.meta}</p>
              </div>
              {item.status ? (
                <span
                  className={`inline-flex w-fit rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase ${STATUS_STYLE[item.status]}`}
                >
                  {item.status}
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
