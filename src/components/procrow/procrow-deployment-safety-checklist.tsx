type ProCrowDeploymentSafetyChecklistProps = {
  items: string[];
};

export function ProCrowDeploymentSafetyChecklist({ items }: ProCrowDeploymentSafetyChecklistProps) {
  return (
    <section className="cc-glass-card !p-5" data-procrow="deployment-safety-checklist">
      <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-cyan-300">
        Deployment safety (advisory)
      </h2>
      <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-slate-400">
        {items.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </section>
  );
}
