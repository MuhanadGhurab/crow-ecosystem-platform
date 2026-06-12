import type { ReactNode } from "react";

type HomepageSectionHeaderProps = {
  eyebrow: string;
  title: string;
  description?: ReactNode;
  align?: "center" | "left";
};

export function HomepageSectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
}: HomepageSectionHeaderProps) {
  const wrap = align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-xl";

  return (
    <div className={wrap}>
      <span className="cc-home-eyebrow">{eyebrow}</span>
      <h2 className="cc-home-section-title mt-4">{title}</h2>
      {description ? <p className="cc-home-section-desc mt-4">{description}</p> : null}
    </div>
  );
}
