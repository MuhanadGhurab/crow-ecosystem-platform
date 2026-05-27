type CompletenessProps = {
  title: string;
  percent: number;
  missingFields: string[];
  completedFields: string[];
};

export function ClientProfileCompleteness({
  title,
  percent,
  missingFields,
  completedFields,
}: CompletenessProps) {
  const tone =
    percent >= 100 ? "text-emerald-400" : percent >= 60 ? "text-amber-300" : "text-amber-200";

  return (
    <section className="cc-glass-card">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">{title}</h2>
        <span className={`text-lg font-semibold ${tone}`}>{percent}%</span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
        <div
          className={`h-full rounded-full transition-all ${
            percent >= 100 ? "bg-emerald-500/80" : "bg-teal-500/70"
          }`}
          style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      {missingFields.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-medium uppercase tracking-wide text-amber-200/90">
            Missing
          </p>
          <ul className="mt-2 list-inside list-disc text-sm text-slate-400">
            {missingFields.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>
      )}
      {completedFields.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Complete</p>
          <p className="mt-1 text-sm text-slate-400">{completedFields.join(" · ")}</p>
        </div>
      )}
    </section>
  );
}
