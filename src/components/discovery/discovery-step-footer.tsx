import Link from "next/link";

export function DiscoveryStepFooter({
  backHref,
  backLabel = "← Back",
  nextHref,
  nextLabel = "Continue →",
}: {
  backHref?: string;
  backLabel?: string;
  nextHref?: string;
  nextLabel?: string;
}) {
  return (
    <div className="mt-8 flex flex-col-reverse gap-3 border-t border-cyan-500/10 pt-6 sm:flex-row sm:flex-wrap sm:justify-between">
      {backHref ? (
        <Link href={backHref} className="cc-btn-secondary text-sm">
          {backLabel}
        </Link>
      ) : (
        <span />
      )}
      {nextHref ? (
        <Link href={nextHref} className="cc-btn-primary w-full text-center text-sm sm:w-auto">
          {nextLabel}
        </Link>
      ) : (
        <span />
      )}
    </div>
  );
}
