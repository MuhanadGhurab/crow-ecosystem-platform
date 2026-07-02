export function RepresentativePreviewLabel({ className = "" }: { className?: string }) {
  return (
    <p
      className={`inline-flex items-center gap-2 rounded-full border border-amber-500/25 bg-amber-500/[0.08] px-3 py-1 text-xs font-medium text-amber-200/90 ${className}`}
      role="status"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-amber-400" aria-hidden />
      Representative preview — not your organization&apos;s data.
    </p>
  );
}
