type CrowMotifVariant = "silhouette" | "constellation" | "wing";

type CrowMotifProps = {
  variant?: CrowMotifVariant;
  className?: string;
  /** 0–1 opacity multiplier for decorative use */
  opacity?: number;
};

/** Abstract Crow brand motif — geometric SVG, no external assets. */
export function CrowMotif({ variant = "silhouette", className = "", opacity = 1 }: CrowMotifProps) {
  const style = { opacity };

  if (variant === "constellation") {
    return (
      <svg
        viewBox="0 0 120 80"
        className={`pointer-events-none text-cc-star ${className}`}
        style={style}
        aria-hidden
      >
        <circle cx="20" cy="18" r="1.5" fill="currentColor" className="opacity-80" />
        <circle cx="48" cy="8" r="2" fill="currentColor" />
        <circle cx="72" cy="22" r="1.5" fill="currentColor" className="opacity-70" />
        <circle cx="98" cy="14" r="1.5" fill="currentColor" className="opacity-60" />
        <circle cx="60" cy="40" r="2.5" fill="currentColor" className="text-cyan-400" />
        <path
          d="M20 18 L48 8 L72 22 L98 14 L60 40"
          stroke="currentColor"
          strokeWidth="0.5"
          fill="none"
          className="opacity-25"
        />
        <path
          d="M60 40 Q40 55 18 62"
          stroke="currentColor"
          strokeWidth="0.75"
          fill="none"
          className="text-cyan-400/40 opacity-40"
        />
      </svg>
    );
  }

  if (variant === "wing") {
    return (
      <svg
        viewBox="0 0 64 48"
        className={`pointer-events-none text-cyan-400/30 ${className}`}
        style={style}
        aria-hidden
      >
        <path
          d="M4 28 C16 12 28 8 40 14 C52 20 58 32 60 40"
          stroke="currentColor"
          strokeWidth="1.25"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M8 32 C18 22 30 18 42 22"
          stroke="currentColor"
          strokeWidth="0.75"
          fill="none"
          className="opacity-60"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 48 40"
      className={`pointer-events-none text-slate-500/40 ${className}`}
      style={style}
      aria-hidden
    >
      <path
        d="M24 6c1 3 3 5 6 5-3 2-5 5-5 9-2-2-4-3-7-3 2-4 4-7 6-11z"
        fill="currentColor"
        className="text-cc-star/70"
      />
      <path
        d="M10 28c4-8 9-12 14-12s10 4 14 12c-5-2-10-2-14 0-4-2-9-2-14 0z"
        fill="currentColor"
        className="text-cyan-400/25"
      />
      <circle cx="24" cy="26" r="1.25" fill="currentColor" className="text-cyan-300/50" />
    </svg>
  );
}
