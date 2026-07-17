export function RepresentativePreviewLabel({ className = "" }: { className?: string }) {
  return (
    <p className={`pv2-preview-label ${className}`} role="status">
      <span className="h-1.5 w-1.5 rounded-full bg-[var(--pv2-amber)]" aria-hidden />
      Representative preview — not your organization&apos;s data.
    </p>
  );
}
