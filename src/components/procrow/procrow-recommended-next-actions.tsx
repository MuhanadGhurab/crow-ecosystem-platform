type ProCrowRecommendedNextActionsProps = {
  actions: string[];
};

export function ProCrowRecommendedNextActions({ actions }: ProCrowRecommendedNextActionsProps) {
  return (
    <section className="cc-glass-card !p-5" data-procrow="operator-next-actions">
      <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-cyan-300">
        Recommended next actions
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-400">
        {actions.map((a) => (
          <li key={a}>{a}</li>
        ))}
      </ol>
    </section>
  );
}
