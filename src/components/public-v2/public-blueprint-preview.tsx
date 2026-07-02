"use client";

import { useId, useState } from "react";

import { RepresentativePreviewLabel } from "@/components/public-v2/representative-preview-label";
import { PUBLIC_BLUEPRINT_TABS } from "@/lib/public-v2/representative-data";
import type { PublicBlueprintTabId } from "@/lib/public-v2/types";
import { REPRESENTATIVE_ORG_NAME } from "@/lib/public-v2/representative-data";
import { PUBLIC_V2_MOTION_CLASS } from "@/lib/public-v2/motion";

export function PublicBlueprintPreview() {
  const [activeId, setActiveId] = useState<PublicBlueprintTabId>("intent");
  const tablistId = useId();
  const active = PUBLIC_BLUEPRINT_TABS.find((t) => t.id === activeId) ?? PUBLIC_BLUEPRINT_TABS[0];

  return (
    <div className="rounded-2xl border border-violet-500/20 bg-violet-500/[0.03] p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-violet-300/90">
            Enterprise Blueprint
          </p>
          <p className="mt-1 text-sm font-medium text-white">{REPRESENTATIVE_ORG_NAME}</p>
        </div>
        <RepresentativePreviewLabel />
      </div>

      <div
        role="tablist"
        aria-label="Blueprint sections"
        className="mt-4 flex flex-wrap gap-2"
      >
        {PUBLIC_BLUEPRINT_TABS.map((tab) => {
          const selected = tab.id === activeId;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={selected}
              className={`min-h-[44px] rounded-lg border px-3 py-2 text-xs font-medium sm:text-sm ${PUBLIC_V2_MOTION_CLASS.tab} ${
                selected
                  ? "border-violet-400/40 bg-violet-500/15 text-violet-100"
                  : "border-white/[0.08] text-slate-400 hover:text-slate-200"
              }`}
              onClick={() => setActiveId(tab.id)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div role="tabpanel" className={`mt-4 space-y-3 ${PUBLIC_V2_MOTION_CLASS.panel}`}>
        <p className="text-sm text-slate-400">{active.summary}</p>
        <dl className="grid gap-2 sm:grid-cols-2">
          {active.items.map((item) => (
            <div
              key={item.label}
              className="rounded-lg border border-white/[0.06] bg-black/20 px-3 py-2.5"
            >
              <dt className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                {item.label}
              </dt>
              <dd className="mt-1 text-sm text-slate-200">{item.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
