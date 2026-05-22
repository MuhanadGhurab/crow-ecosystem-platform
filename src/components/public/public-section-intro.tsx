import type { ReactNode } from "react";

type PublicSectionIntroProps = {
  badge: string;
  title: string;
  description?: ReactNode;
  centered?: boolean;
};

/** Shared section header for public marketing pages. */
export function PublicSectionIntro({
  badge,
  title,
  description,
  centered = true,
}: PublicSectionIntroProps) {
  const align = centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl";

  return (
    <div className={align}>
      <span className="cc-star-badge">{badge}</span>
      <h2 className="cc-section-title mt-4">{title}</h2>
      {description && <p className="mt-4 text-slate-400">{description}</p>}
    </div>
  );
}
