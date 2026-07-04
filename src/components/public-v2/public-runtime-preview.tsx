"use client";

import { useState } from "react";

import { RepresentativePreviewLabel } from "@/components/public-v2/representative-preview-label";
import { PUBLIC_RUNTIME_AREAS } from "@/lib/public-v2/representative-data";
import type { PublicRuntimeAreaId } from "@/lib/public-v2/types";
import { PUBLIC_V2_MOTION_CLASS } from "@/lib/public-v2/motion";

const STATUS_STYLE = {
  active: "border-[color-mix(in_srgb,var(--pv2-cyan)_30%,var(--pv2-border))] text-[#0e7490] bg-[var(--pv2-cyan-soft)]",
  complete:
    "border-[color-mix(in_srgb,#16a34a_30%,var(--pv2-border))] text-[#15803d] bg-[#f0fdf4]",
  critical:
    "border-[color-mix(in_srgb,#dc2626_30%,var(--pv2-border))] text-[#b91c1c] bg-[#fef2f2]",
} as const;

export function PublicRuntimePreview() {
  const [activeId, setActiveId] = useState<PublicRuntimeAreaId>("attention");
  const active = PUBLIC_RUNTIME_AREAS.find((a) => a.id === activeId) ?? PUBLIC_RUNTIME_AREAS[0];

  return (
    <div className="p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--pv2-text-muted)]">
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
              className={`pv2-tab text-xs sm:text-sm ${selected ? "pv2-tab-active" : ""} ${PUBLIC_V2_MOTION_CLASS.tab}`}
              onClick={() => setActiveId(area.id)}
            >
              {area.label}
            </button>
          );
        })}
      </div>

      <div role="tabpanel" className={`mt-4 ${PUBLIC_V2_MOTION_CLASS.panel}`}>
        <p className="pv2-body">{active.description}</p>
        <ul className="mt-4 space-y-2" role="list">
          {active.sampleItems.map((item) => (
            <li
              key={item.title}
              className="flex flex-col gap-1 rounded-lg border border-[var(--pv2-border)] bg-[var(--pv2-surface-muted)] px-3 py-2.5 transition-shadow duration-[180ms] hover:shadow-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-sm font-medium text-[var(--pv2-text-primary)]">{item.title}</p>
                <p className="text-xs text-[var(--pv2-text-muted)]">{item.meta}</p>
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
