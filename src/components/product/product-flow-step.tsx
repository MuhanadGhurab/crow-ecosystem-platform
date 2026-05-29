import Link from "next/link";

type ProductFlowStepProps = {
  index: number;
  label: string;
  href?: string;
  active?: boolean;
};

export function ProductFlowStep({ index, label, href, active }: ProductFlowStepProps) {
  const chip = (
    <span
      className={`flex shrink-0 items-center gap-2 rounded-lg border px-2.5 py-1.5 text-xs ${
        active
          ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-100"
          : "border-slate-700/60 bg-white/[0.03] text-slate-400"
      }`}
    >
      <span className="font-mono text-[10px] font-bold text-cc-star">{String(index).padStart(2, "0")}</span>
      <span className="whitespace-nowrap">{label}</span>
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="transition hover:opacity-90">
        {chip}
      </Link>
    );
  }
  return chip;
}
