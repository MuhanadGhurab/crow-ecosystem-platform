type ProCrowOperatorSafetyWarningsProps = {
  warnings: string[];
};

export function ProCrowOperatorSafetyWarnings({ warnings }: ProCrowOperatorSafetyWarningsProps) {
  return (
    <section
      className="rounded-cc-sm border border-amber-500/25 bg-amber-500/5 p-4"
      data-procrow="operator-safety-warnings"
    >
      <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-amber-200/90">
        Safety & manual execution
      </h2>
      <p className="mt-1 text-xs text-slate-500">
        Manual command execution only — this UI is a validation index and runbook guide, not a script runner.
      </p>
      <ul className="mt-3 list-inside list-disc space-y-1.5 text-xs text-slate-400">
        {warnings.map((w) => (
          <li key={w}>{w}</li>
        ))}
      </ul>
    </section>
  );
}
