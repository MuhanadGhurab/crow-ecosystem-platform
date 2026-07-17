"use client";

import type { ReactNode } from "react";

type PublicSectionProps = {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  variant?: "default" | "inset" | "emphasis";
  band?: "none" | "muted" | "emphasis" | "teal" | "gold" | "navy" | "purple";
};

const VARIANT_CLASS = {
  default: "",
  inset: "pv2-card-inset p-6 sm:p-8 lg:p-10",
  emphasis: "pv2-card-emphasis p-6 sm:p-8 lg:p-10",
};

const BAND_CLASS: Record<NonNullable<PublicSectionProps["band"]>, string> = {
  none: "",
  muted: "pv2-section-band pv2-section-band-muted",
  emphasis: "pv2-section-band pv2-section-band-emphasis",
  teal: "pv2-section-band pv2-section-band-teal",
  gold: "pv2-section-band pv2-section-band-gold",
  navy: "pv2-section-band pv2-section-band-navy",
  purple: "pv2-section-band pv2-section-band-purple",
};

export function PublicSection({
  id,
  eyebrow,
  title,
  description,
  children,
  className = "",
  variant = "default",
  band = "none",
}: PublicSectionProps) {
  const bandClass = BAND_CLASS[band];

  return (
    <section
      id={id}
      className={`scroll-mt-24 ${bandClass} ${className}`}
      aria-labelledby={id ? `${id}-heading` : undefined}
    >
      <div className={`${band ? "pv2-section-inner" : "mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8"} py-14 sm:py-16 lg:py-20`}>
        <header className="mb-8 max-w-3xl sm:mb-10">
          {eyebrow ? <p className="pv2-eyebrow mb-3">{eyebrow}</p> : null}
          <h2 id={id ? `${id}-heading` : undefined} className="pv2-h2">
            {title}
          </h2>
          {description ? <p className="pv2-lead mt-4">{description}</p> : null}
        </header>
        <div className={VARIANT_CLASS[variant]}>{children}</div>
      </div>
    </section>
  );
}
