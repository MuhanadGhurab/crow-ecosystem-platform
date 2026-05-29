import Link from "next/link";

type ProCrowWorkbenchPageHeaderProps = {
  eyebrow: string;
  title: string;
  purpose: string;
  statusChip?: string;
  backHref?: string;
  backLabel?: string;
  actions?: React.ReactNode;
};

export function ProCrowWorkbenchPageHeader({
  eyebrow,
  title,
  purpose,
  statusChip,
  backHref,
  backLabel = "← Back",
  actions,
}: ProCrowWorkbenchPageHeaderProps) {
  return (
    <header className="space-y-3">
      {backHref && (
        <Link href={backHref} className="text-sm text-cyan-400 hover:text-cyan-300">
          {backLabel}
        </Link>
      )}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400/90">{eyebrow}</p>
            {statusChip && (
              <span className="rounded-full border border-slate-600/60 bg-slate-800/50 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-300">
                {statusChip}
              </span>
            )}
          </div>
          <h1 className="mt-1 font-display text-2xl font-bold text-white sm:text-3xl">{title}</h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-400">{purpose}</p>
        </div>
        {actions}
      </div>
    </header>
  );
}
