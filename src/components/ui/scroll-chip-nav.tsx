interface ScrollChipNavProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  "aria-label"?: string;
}

/** Horizontal scroll row for step chips / sub-nav on narrow viewports. */
export function ScrollChipNav({
  children,
  className = "",
  style,
  "aria-label": ariaLabel,
}: ScrollChipNavProps) {
  return (
    <div className={`cc-scroll-chips ${className}`.trim()} style={style} aria-label={ariaLabel}>
      {children}
    </div>
  );
}
