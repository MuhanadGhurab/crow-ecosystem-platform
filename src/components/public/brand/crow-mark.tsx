import Link from "next/link";

type CrowMarkProps = {
  href?: string;
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
  className?: string;
};

const sizes = {
  sm: { icon: 28, text: "text-sm", tag: "text-[9px]" },
  md: { icon: 36, text: "text-lg", tag: "text-[10px]" },
  lg: { icon: 44, text: "text-xl", tag: "text-xs" },
};

/** North-star Crow brand mark — used in headers and app shells. */
export function CrowMark({ href = "/", size = "md", showTagline = true, className = "" }: CrowMarkProps) {
  const s = sizes[size];
  const content = (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <span
        className="relative flex shrink-0 items-center justify-center rounded-cc-sm bg-gradient-to-br from-slate-900 to-crow-feather ring-1 ring-cyan-500/20"
        style={{ width: s.icon, height: s.icon }}
        aria-hidden
      >
        <svg viewBox="0 0 32 32" className="h-[70%] w-[70%]" fill="none">
          <path
            d="M16 4l1.2 4.8L22 10l-4 2.2L19 17l-3-3.5L13 17l1-4.8L10 10l4.8-1.2L16 4z"
            fill="currentColor"
            className="text-cc-star"
          />
          <path
            d="M8 22c2-6 6-9 8-9s6 3 8 9"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            className="text-cyan-400/90"
          />
          <circle cx="16" cy="20" r="1.5" fill="currentColor" className="text-cyan-300" />
        </svg>
      </span>
      <span className="flex flex-col leading-tight">
        <span className={`font-display font-bold tracking-tight ${s.text}`}>
          <span className="cc-gradient-text">Crow</span>
          <span className="text-white"> Ecosystem</span>
        </span>
        {showTagline && (
          <span className={`uppercase tracking-[0.2em] text-slate-500 ${s.tag}`}>
            North-star enterprise
          </span>
        )}
      </span>
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="transition opacity-95 hover:opacity-100">
        {content}
      </Link>
    );
  }

  return content;
}
