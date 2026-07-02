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
};

const VARIANT_CLASS = {
  default: "",
  inset: "rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 sm:p-8 lg:p-10",
  emphasis:
    "rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/[0.06] via-transparent to-violet-500/[0.05] p-6 sm:p-8 lg:p-10",
};

export function PublicSection({
  id,
  eyebrow,
  title,
  description,
  children,
  className = "",
  variant = "default",
}: PublicSectionProps) {
  return (
    <section
      id={id}
      className={`scroll-mt-24 px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20 ${className}`}
      aria-labelledby={id ? `${id}-heading` : undefined}
    >
      <div className="mx-auto max-w-[1280px]">
        <header className="mb-8 max-w-3xl sm:mb-10">
          {eyebrow ? (
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400/90">
              {eyebrow}
            </p>
          ) : null}
          <h2
            id={id ? `${id}-heading` : undefined}
            className="text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:text-[2rem] lg:leading-tight"
          >
            {title}
          </h2>
          {description ? (
            <p className="mt-4 text-base leading-relaxed text-slate-400 sm:text-lg">{description}</p>
          ) : null}
        </header>
        <div className={VARIANT_CLASS[variant]}>{children}</div>
      </div>
    </section>
  );
}
