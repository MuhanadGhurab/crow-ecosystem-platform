import type { ReactNode } from "react";

type PricingTierCardProps = {
  entity: "cem" | "cybercrow" | "sarea";
  badge: string;
  icon?: ReactNode;
  title: string;
  subtitle?: string;
  price: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
  highlight?: boolean;
};

const entityClass = {
  cem: "cc-engine-card--cem border-l-cyan-500/50",
  cybercrow: "cc-engine-card--cybercrow border-l-violet-500/50",
  sarea: "cc-engine-card--sarea border-l-rose-500/50",
} as const;

const badgeClass = {
  cem: "cc-entity-badge--cem",
  cybercrow: "cc-entity-badge--cybercrow",
  sarea: "cc-entity-badge--sarea",
} as const;

export function PricingTierCard({
  entity,
  badge,
  icon,
  title,
  subtitle,
  price,
  footer,
  children,
  highlight,
}: PricingTierCardProps) {
  return (
    <article
      className={`cc-glass-card flex flex-col border-l-2 transition hover:border-opacity-80 hover:shadow-[0_0_32px_rgba(34,211,238,0.08)] ${entityClass[entity]} ${
        highlight ? "ring-1 ring-cc-star/30" : ""
      }`}
    >
      <span className={`cc-entity-badge ${badgeClass[entity]}`}>{badge}</span>
      {icon && <span className="mt-3 text-3xl">{icon}</span>}
      <h3 className="mt-2 font-display text-xl font-semibold text-white">{title}</h3>
      {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
      <div className="mt-4 font-display text-2xl font-bold text-cc-star">{price}</div>
      {children && <div className="mt-3 flex-1 text-sm text-slate-400">{children}</div>}
      {footer && <p className="mt-4 text-xs font-medium text-cyan-400">{footer}</p>}
    </article>
  );
}
