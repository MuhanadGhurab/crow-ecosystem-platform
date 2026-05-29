import Link from "next/link";

type ProCrowNextActionCardProps = {
  title: string;
  description: string;
  href: string;
  ctaLabel?: string;
};

export function ProCrowNextActionCard({
  title,
  description,
  href,
  ctaLabel = "Continue",
}: ProCrowNextActionCardProps) {
  return (
    <div className="cc-glass-card flex flex-wrap items-center justify-between gap-4 border-cyan-500/25 !p-4 sm:!p-5">
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-cyan-300">Next action</p>
        <p className="mt-1 font-medium text-white">{title}</p>
        <p className="mt-1 text-sm text-slate-400">{description}</p>
      </div>
      <Link href={href} className="cc-btn-primary shrink-0 text-sm">
        {ctaLabel} →
      </Link>
    </div>
  );
}
