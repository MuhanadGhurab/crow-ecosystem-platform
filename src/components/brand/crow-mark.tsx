import Link from "next/link";
import { CrowMarkSvg } from "@/components/brand/crow-mark-svg";
import type { CrowMarkVariant } from "@/components/brand/types";

export type CrowMarkProps = {
  variant?: CrowMarkVariant;
  href?: string;
  className?: string;
  showWordmark?: boolean;
  labeled?: boolean;
};

export function CrowMark({
  variant = "primary",
  href = "/",
  className = "",
  showWordmark = true,
  labeled = true,
}: CrowMarkProps) {
  const mark = (
    <CrowMarkSvg
      variant={variant}
      className="h-9 w-9 shrink-0"
      labeled={labeled}
    />
  );

  const label = showWordmark ? (
    <span className="font-display text-sm font-bold tracking-tight text-white sm:text-base">
      Crow Ecosystem
    </span>
  ) : null;

  if (!href) {
    return (
      <div className={`inline-flex items-center gap-2.5 ${className}`}>
        {mark}
        {label}
      </div>
    );
  }

  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2.5 transition-opacity hover:opacity-90 ${className}`}
      aria-label={labeled ? undefined : "Crow Ecosystem home"}
    >
      {mark}
      {label}
    </Link>
  );
}
