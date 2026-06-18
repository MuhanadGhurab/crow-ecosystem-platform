import Link from "next/link";

import { CrowMarkSvg } from "@/components/brand/crow-mark-svg";

type CrowMarkProps = {
  href?: string;
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
  className?: string;
};

const sizes = {
  sm: { icon: "h-7 w-7", text: "text-sm", tag: "text-[9px]" },
  md: { icon: "h-9 w-9", text: "text-lg", tag: "text-[10px]" },
  lg: { icon: "h-11 w-11", text: "text-xl", tag: "text-xs" },
};

/** North-star Crow brand mark — shared geometry with canonical brand system. */
export function CrowMark({
  href = "/",
  size = "md",
  showTagline = true,
  className = "",
}: CrowMarkProps) {
  const s = sizes[size];
  const content = (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <span
        className={`relative flex shrink-0 items-center justify-center rounded-cc-sm bg-gradient-to-br from-slate-900 to-crow-feather p-1 ring-1 ring-cyan-500/20 ${s.icon}`}
        aria-hidden
      >
        <CrowMarkSvg variant="primary" className="h-full w-full" labeled={false} />
      </span>
      <span className="flex flex-col leading-tight">
        <span className={`font-display font-bold tracking-tight ${s.text}`}>
          <span className="cc-gradient-text">Crow</span>
          <span className="text-white"> Ecosystem</span>
        </span>
        {showTagline ? (
          <span className={`uppercase tracking-[0.2em] text-slate-500 ${s.tag}`}>
            North-star enterprise
          </span>
        ) : null}
      </span>
    </span>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="transition opacity-95 hover:opacity-100"
        aria-label="Crow Ecosystem home"
      >
        {content}
      </Link>
    );
  }

  return content;
}
