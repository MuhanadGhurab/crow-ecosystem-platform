type ProCrowReleaseBlockersPanelProps = {
  blockers: string[];
  warnings: string[];
};

export function ProCrowReleaseBlockersPanel({ blockers, warnings }: ProCrowReleaseBlockersPanelProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-2" data-procrow="release-blockers-panel">
      <section className="cc-glass-card !p-5">
        <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-rose-300">
          Blockers · production path
        </h2>
        {blockers.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">No scripted blockers listed — still review F23 before any production launch.</p>
        ) : (
          <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-rose-100/90">
            {blockers.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        )}
      </section>
      <section className="cc-glass-card !p-5">
        <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-amber-200">
          Warnings · demo / push
        </h2>
        <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-amber-100/80">
          {warnings.map((w) => (
            <li key={w}>{w}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
