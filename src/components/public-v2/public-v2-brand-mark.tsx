import Link from "next/link";

import { CrowMarkSvg } from "@/components/brand/crow-mark-svg";

type PublicV2BrandMarkProps = {
  href?: string;
};

/** Bright-preview logo — does not modify global CrowMark. */
export function PublicV2BrandMark({ href = "/" }: PublicV2BrandMarkProps) {
  const content = (
    <span className="inline-flex items-center gap-2.5">
      <span
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] border border-[var(--pv2-border)] bg-[var(--pv2-surface)] shadow-sm"
        aria-hidden
      >
        <CrowMarkSvg variant="primary" className="h-5 w-5" labeled={false} />
      </span>
      <span className="flex flex-col leading-tight">
        <span className="font-display text-sm font-bold tracking-tight text-[var(--pv2-text-primary)]">
          Crow
        </span>
        <span className="text-[9px] font-medium uppercase tracking-[0.16em] text-[var(--pv2-text-muted)]">
          Ecosystem
        </span>
      </span>
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="rounded-lg focus-visible:outline-offset-4">
        {content}
      </Link>
    );
  }

  return content;
}
