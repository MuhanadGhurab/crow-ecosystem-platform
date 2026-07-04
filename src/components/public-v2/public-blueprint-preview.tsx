"use client";

import { useState } from "react";

import { RepresentativePreviewLabel } from "@/components/public-v2/representative-preview-label";
import { PUBLIC_BLUEPRINT_TABS } from "@/lib/public-v2/representative-data";
import type { PublicBlueprintTabId } from "@/lib/public-v2/types";
import { REPRESENTATIVE_ORG_NAME } from "@/lib/public-v2/representative-data";
import { PUBLIC_V2_MOTION_CLASS } from "@/lib/public-v2/motion";

export function PublicBlueprintPreview() {
  const [activeId, setActiveId] = useState<PublicBlueprintTabId>("intent");
  const active = PUBLIC_BLUEPRINT_TABS.find((t) => t.id === activeId) ?? PUBLIC_BLUEPRINT_TABS[0];

  return (
    <div className="border-b border-[var(--pv2-border)] p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--pv2-violet)]">
            Enterprise Blueprint
          </p>
          <p className="mt-1 text-sm font-medium text-[var(--pv2-text-primary)]">
            {REPRESENTATIVE_ORG_NAME}
          </p>
        </div>
        <RepresentativePreviewLabel />
      </div>

      <div role="tablist" aria-label="Blueprint sections" className="mt-4 flex flex-wrap gap-2">
        {PUBLIC_BLUEPRINT_TABS.map((tab) => {
          const selected = tab.id === activeId;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={selected}
              className={`pv2-tab pv2-tab-violet text-xs sm:text-sm ${selected ? "pv2-tab-active" : ""} ${PUBLIC_V2_MOTION_CLASS.tab}`}
              onClick={() => setActiveId(tab.id)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div role="tabpanel" className={`mt-4 space-y-3 ${PUBLIC_V2_MOTION_CLASS.panel}`}>
        <p className="pv2-body">{active.summary}</p>
        <dl className="grid gap-2 sm:grid-cols-2">
          {active.items.map((item) => (
            <div
              key={item.label}
              className="rounded-lg border border-[var(--pv2-border)] bg-[var(--pv2-surface-muted)] px-3 py-2.5"
            >
              <dt className="text-[10px] font-semibold uppercase tracking-wide text-[var(--pv2-text-muted)]">
                {item.label}
              </dt>
              <dd className="mt-1 text-sm text-[var(--pv2-text-primary)]">{item.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
