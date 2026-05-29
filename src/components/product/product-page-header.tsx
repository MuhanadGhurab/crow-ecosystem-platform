type ProductPageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  statusChip?: { label: string; tone?: "default" | "success" | "warning" | "info" };
};

const toneClass = {
  default: "border-slate-600/50 bg-slate-800/50 text-slate-300",
  success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
  warning: "border-amber-500/30 bg-amber-500/10 text-amber-100",
  info: "border-cyan-500/30 bg-cyan-500/10 text-cyan-100",
} as const;

export function ProductPageHeader({ eyebrow, title, description, statusChip }: ProductPageHeaderProps) {
  return (
    <header className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400/90">{eyebrow}</p>
        )}
        {statusChip && (
          <span
            className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${toneClass[statusChip.tone ?? "default"]}`}
          >
            {statusChip.label}
          </span>
        )}
      </div>
      <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">{title}</h1>
      {description && <p className="max-w-3xl text-sm leading-relaxed text-slate-400 sm:text-base">{description}</p>}
    </header>
  );
}
