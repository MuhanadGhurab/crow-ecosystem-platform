import type { ReactNode } from "react";
import { studioMotion } from "./studio-motion";

export function StudioPanel({
  title,
  description,
  children,
  className = "",
}: {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`studio-surface p-4 sm:p-5 ${studioMotion.panelEnter} ${studioMotion.reducedMotion} ${className}`}
      aria-labelledby={`panel-${title.replace(/\s+/g, "-").toLowerCase()}`}
    >
      <header className="mb-3 border-b border-slate-800/80 pb-2">
        <h3 id={`panel-${title.replace(/\s+/g, "-").toLowerCase()}`} className="text-sm font-semibold text-white">
          {title}
        </h3>
        {description && <p className="mt-0.5 text-xs text-slate-500">{description}</p>}
      </header>
      {children}
    </section>
  );
}

export function StudioStatusChip({ label, tone = "default" }: { label: string; tone?: "default" | "warning" | "advisory" }) {
  const toneClass =
    tone === "warning"
      ? "bg-amber-500/15 text-amber-100 ring-amber-500/30"
      : tone === "advisory"
        ? "bg-violet-500/15 text-violet-100 ring-violet-500/30"
        : "bg-slate-800 text-slate-300 ring-slate-600/40";
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ${toneClass}`}>
      {label}
    </span>
  );
}

export function StudioEmptyState({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-700 bg-slate-900/40 px-4 py-8 text-center">
      <p className="text-sm font-medium text-slate-300">{title}</p>
      <p className="mt-1 text-xs text-slate-500">{detail}</p>
    </div>
  );
}
