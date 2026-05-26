type StatItem = {
  label: string;
  value: string | number;
  hint?: string;
  accent?: "cyan" | "teal" | "violet" | "amber" | "rose";
};

const accentText: Record<NonNullable<StatItem["accent"]>, string> = {
  cyan: "text-cyan-300",
  teal: "text-teal-300",
  violet: "text-violet-300",
  amber: "text-amber-300",
  rose: "text-rose-300",
};

export function TenantRuntimeStatStrip({ items }: { items: StatItem[] }) {
  return (
    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <article
          key={item.label}
          className="rounded-cc border border-cyan-500/10 bg-gradient-to-br from-white/[0.04] to-transparent p-4"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {item.label}
          </p>
          <p
            className={`mt-2 font-display text-3xl font-bold tabular-nums ${
              accentText[item.accent ?? "cyan"]
            }`}
          >
            {item.value}
          </p>
          {item.hint && <p className="mt-1 text-xs text-slate-500">{item.hint}</p>}
        </article>
      ))}
    </section>
  );
}
