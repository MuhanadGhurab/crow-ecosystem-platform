import Link from "next/link";

export function PermissionDenied({
  title = "Access denied",
  description = "Your account does not have permission to view this page.",
  backHref = "/",
  backLabel = "Home",
}: {
  title?: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
}) {
  return (
    <div className="cc-glass-card mx-auto max-w-lg space-y-4 p-8 text-center">
      <p className="font-display text-lg font-semibold text-rose-300">{title}</p>
      <p className="text-sm text-slate-400">{description}</p>
      <Link href={backHref} className="inline-block text-sm text-cyan-400 hover:text-cyan-300">
        ← {backLabel}
      </Link>
    </div>
  );
}
