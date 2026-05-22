import Link from "next/link";
import type { ReactNode } from "react";

export type CrowEngineEntity = "cem" | "cybercrow" | "sarea" | "discovery" | "blueprint";

const LINK_CLASS: Record<CrowEngineEntity, string> = {
  cem: "text-cyan-400 hover:text-cyan-300",
  cybercrow: "text-violet-400 hover:text-violet-300",
  sarea: "text-rose-400 hover:text-rose-300",
  discovery: "text-amber-300 hover:text-amber-200",
  blueprint: "text-violet-300 hover:text-violet-200",
};

export type CrowEngineCardProps = {
  entity: CrowEngineEntity;
  name: string;
  fullName: string;
  tagline: string;
  description: string;
  href?: string;
  ctaLabel?: string;
  step?: string;
  className?: string;
  /** Optional embedded UI preview (e.g. CyberCrow dashboard chrome). */
  preview?: ReactNode;
};

/** Entity-tinted engine card for public marketing bento grids. */
export function CrowEngineCard({
  entity,
  name,
  fullName,
  tagline,
  description,
  href,
  ctaLabel,
  step,
  className = "",
  preview,
}: CrowEngineCardProps) {
  const linkClass = LINK_CLASS[entity];

  return (
    <article
      className={`cc-engine-card cc-engine-card--${entity} group relative flex flex-col ${className}`}
    >
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-0 blur-2xl transition duration-500 group-hover:opacity-100"
        style={{
          background:
            entity === "cem"
              ? "radial-gradient(circle, rgba(34,211,238,0.15), transparent 70%)"
              : entity === "cybercrow"
                ? "radial-gradient(circle, rgba(139,92,246,0.18), transparent 70%)"
                : entity === "sarea"
                  ? "radial-gradient(circle, rgba(251,113,133,0.15), transparent 70%)"
                  : entity === "discovery"
                    ? "radial-gradient(circle, rgba(251,191,36,0.12), transparent 70%)"
                    : "radial-gradient(circle, rgba(139,92,246,0.12), transparent 70%)",
        }}
        aria-hidden
      />
      {step && (
        <span className="absolute end-4 top-4 font-mono text-[10px] text-slate-600" aria-hidden>
          {step}
        </span>
      )}
      <span className={`cc-entity-badge cc-entity-badge--${entity} relative w-fit`}>{name}</span>
      <h3 className="relative mt-3 font-display text-lg font-bold text-white sm:text-xl">{fullName}</h3>
      <p className="relative mt-2 text-sm italic text-slate-400">{tagline}</p>
      {preview}
      <p className="relative mt-3 flex-1 text-sm leading-relaxed text-slate-500">{description}</p>
      {href && ctaLabel && (
        <Link
          href={href}
          className={`relative mt-5 inline-flex text-sm font-medium transition group-hover:opacity-90 ${linkClass}`}
        >
          {ctaLabel} →
        </Link>
      )}
    </article>
  );
}
