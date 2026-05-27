import type { ReactNode } from "react";

type Props = {
  title: string;
  description?: string;
  badge?: string;
  badgeTone?: "neutral" | "info" | "warning" | "success";
  children?: ReactNode;
};

const toneClass: Record<NonNullable<Props["badgeTone"]>, string> = {
  neutral: "bg-slate-500/15 text-slate-300",
  info: "bg-cyan-500/15 text-cyan-300",
  warning: "bg-amber-500/15 text-amber-300",
  success: "bg-teal-500/15 text-teal-300",
};

export function ClientPortalStatusCard({
  title,
  description,
  badge,
  badgeTone = "neutral",
  children,
}: Props) {
  return (
    <section className="cc-glass-card space-y-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h2 className="font-display text-lg font-semibold text-white">{title}</h2>
        {badge && (
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${toneClass[badgeTone]}`}>
            {badge}
          </span>
        )}
      </div>
      {description && <p className="text-sm text-slate-400">{description}</p>}
      {children}
    </section>
  );
}
