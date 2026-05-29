import Link from "next/link";

type ProductStatusCardProps = {
  status: string;
  title: string;
  why: string;
  nextAction: string;
  href?: string;
  ctaLabel?: string;
};

export function ProductStatusCard({
  status,
  title,
  why,
  nextAction,
  href,
  ctaLabel = "Open",
}: ProductStatusCardProps) {
  const body = (
    <article className="cc-glass-card flex h-full flex-col !p-4 sm:!p-5">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-cyan-400/90">{status}</p>
      <h3 className="mt-1 font-display text-base font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm text-slate-500">{why}</p>
      <p className="mt-3 text-sm text-slate-300">
        <span className="font-medium text-slate-400">Next: </span>
        {nextAction}
      </p>
      {href && (
        <span className="mt-4 inline-block text-sm font-medium text-cyan-400">{ctaLabel} →</span>
      )}
    </article>
  );

  if (href) {
    return (
      <Link href={href} className="block transition hover:opacity-95">
        {body}
      </Link>
    );
  }
  return body;
}
