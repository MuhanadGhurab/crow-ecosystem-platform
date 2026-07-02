"use client";

import { useState } from "react";

import { RepresentativePreviewLabel } from "@/components/public-v2/representative-preview-label";
import { PUBLIC_SAREA_ROLES, REPRESENTATIVE_ORG_NAME } from "@/lib/public-v2/representative-data";
import type { PublicSareaRoleId } from "@/lib/public-v2/types";
import { PUBLIC_V2_MOTION_CLASS } from "@/lib/public-v2/motion";

export function PublicSareaRolePreview() {
  const [activeId, setActiveId] = useState<PublicSareaRoleId>("executive");
  const active = PUBLIC_SAREA_ROLES.find((r) => r.id === activeId) ?? PUBLIC_SAREA_ROLES[0];

  return (
    <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/[0.03] p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-cyan-300/90">
            SAREA role preview
          </p>
          <p className="mt-1 text-sm text-slate-400">{REPRESENTATIVE_ORG_NAME}</p>
        </div>
        <RepresentativePreviewLabel />
      </div>

      <p className="mt-3 text-xs text-amber-200/80">
        SAREA adapts presentation. Authorized roles control access.
      </p>

      <div className="mt-4 flex flex-wrap gap-2" role="radiogroup" aria-label="SAREA roles">
        {PUBLIC_SAREA_ROLES.map((role) => {
          const selected = role.id === activeId;
          return (
            <button
              key={role.id}
              type="button"
              role="radio"
              aria-checked={selected}
              className={`min-h-[44px] rounded-lg border px-3 py-2 text-xs font-medium sm:text-sm ${PUBLIC_V2_MOTION_CLASS.tab} ${
                selected
                  ? "border-cyan-400/40 bg-cyan-500/15 text-cyan-100"
                  : "border-white/[0.08] text-slate-400"
              }`}
              onClick={() => setActiveId(role.id)}
            >
              {role.label}
            </button>
          );
        })}
      </div>

      <div className={`mt-4 grid gap-3 sm:grid-cols-2 ${PUBLIC_V2_MOTION_CLASS.panel}`}>
        <div className="rounded-lg border border-white/[0.06] bg-black/20 p-3">
          <p className="text-[10px] font-semibold uppercase text-slate-500">Emphasis</p>
          <p className="mt-1 text-sm text-slate-200">{active.emphasis}</p>
        </div>
        <div className="rounded-lg border border-white/[0.06] bg-black/20 p-3">
          <p className="text-[10px] font-semibold uppercase text-slate-500">Workspace focus</p>
          <ul className="mt-2 space-y-1 text-sm text-slate-300" role="list">
            {active.workspaceFocus.map((item) => (
              <li key={item}>· {item}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border border-white/[0.06] bg-black/20 p-3 sm:col-span-2">
          <p className="text-[10px] font-semibold uppercase text-slate-500">Navigation highlights</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {active.navHighlights.map((nav) => (
              <span
                key={nav}
                className="rounded-md border border-cyan-500/20 bg-cyan-500/10 px-2 py-1 text-xs text-cyan-100"
              >
                {nav}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
