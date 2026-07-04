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
    <div className="border-b border-[var(--pv2-border)] bg-[var(--pv2-surface-muted)] p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--pv2-cyan)]">
            SAREA role preview
          </p>
          <p className="mt-1 text-sm text-[var(--pv2-text-secondary)]">{REPRESENTATIVE_ORG_NAME}</p>
        </div>
        <RepresentativePreviewLabel />
      </div>

      <p className="mt-3 rounded-lg border border-[color-mix(in_srgb,var(--pv2-amber)_22%,var(--pv2-border))] bg-[var(--pv2-amber-soft)] px-3 py-2 text-xs text-[var(--pv2-amber)]">
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
              className={`pv2-tab text-xs sm:text-sm ${selected ? "pv2-tab-active" : ""} ${PUBLIC_V2_MOTION_CLASS.tab}`}
              onClick={() => setActiveId(role.id)}
            >
              {role.label}
            </button>
          );
        })}
      </div>

      <div className={`mt-4 grid gap-3 sm:grid-cols-2 ${PUBLIC_V2_MOTION_CLASS.panel}`}>
        <div className="rounded-lg border border-[var(--pv2-border)] bg-[var(--pv2-surface)] p-3">
          <p className="text-[10px] font-semibold uppercase text-[var(--pv2-text-muted)]">Emphasis</p>
          <p className="mt-1 text-sm text-[var(--pv2-text-primary)]">{active.emphasis}</p>
        </div>
        <div className="rounded-lg border border-[var(--pv2-border)] bg-[var(--pv2-surface)] p-3">
          <p className="text-[10px] font-semibold uppercase text-[var(--pv2-text-muted)]">
            Workspace focus
          </p>
          <ul className="mt-2 space-y-1 text-sm text-[var(--pv2-text-secondary)]" role="list">
            {active.workspaceFocus.map((item) => (
              <li key={item}>· {item}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border border-[var(--pv2-border)] bg-[var(--pv2-surface)] p-3 sm:col-span-2">
          <p className="text-[10px] font-semibold uppercase text-[var(--pv2-text-muted)]">
            Navigation highlights
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {active.navHighlights.map((nav) => (
              <span
                key={nav}
                className="rounded-md border border-[color-mix(in_srgb,var(--pv2-cyan)_22%,var(--pv2-border))] bg-[var(--pv2-cyan-soft)] px-2 py-1 text-xs text-[#0e7490]"
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
