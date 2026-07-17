"use client";

import type { ReactNode } from "react";
import type { ScenarioDiffEntry } from "@/lib/model-forge/domain-types";
import { StudioStatusChip } from "./studio-panel";

const CHANGE_COLORS: Record<ScenarioDiffEntry["change"], string> = {
  added: "text-emerald-400",
  removed: "text-rose-400",
  merged: "text-violet-300",
  split: "text-cyan-300",
  expanded: "text-sky-300",
  reduced: "text-amber-300",
  unchanged: "text-white/40",
};

export function StudioScenarioDiff({ diffs }: { diffs: readonly ScenarioDiffEntry[] }) {
  const visible = diffs.filter((d) => d.change !== "unchanged").slice(0, 40);
  if (visible.length === 0) {
    return <p className="text-sm text-white/50">No meaningful differences detected.</p>;
  }
  return (
    <ul className="max-h-64 space-y-1.5 overflow-y-auto text-sm">
      {visible.map((d, i) => (
        <li key={`${d.category}-${d.label}-${i}`} className="flex items-start gap-2 rounded border border-white/5 bg-black/20 px-2 py-1.5">
          <StudioStatusChip label={d.change} tone={d.change === "added" ? "advisory" : d.change === "removed" ? "warning" : "default"} />
          <div className="min-w-0">
            <span className={`font-medium ${CHANGE_COLORS[d.change]}`}>{d.label}</span>
            <span className="ml-1 text-white/40">({d.category})</span>
            {d.detail ? <p className="text-xs text-white/50">{d.detail}</p> : null}
          </div>
        </li>
      ))}
    </ul>
  );
}

export function StudioInspector({
  title,
  children,
  advisory = true,
}: {
  title: string;
  children: ReactNode;
  advisory?: boolean;
}) {
  return (
    <div className="studio-panel h-full overflow-y-auto rounded-xl border border-white/10 bg-[#0d1117]/90 p-3">
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      {advisory ? (
        <p className="mt-1 text-[10px] uppercase tracking-wide text-amber-400/90">Advisory — not an authority assignment</p>
      ) : null}
      <div className="mt-3 space-y-2 text-sm text-white/80">{children}</div>
    </div>
  );
}
