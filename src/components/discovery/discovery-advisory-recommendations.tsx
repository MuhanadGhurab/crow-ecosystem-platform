import type { DiscoveryAdvisoryRecommendations } from "@/lib/discovery-intelligence/recommendations";

type Props = {
  recommendations: DiscoveryAdvisoryRecommendations;
};

export function DiscoveryAdvisoryRecommendationsPanel({ recommendations }: Props) {
  return (
    <section className="rounded-xl border border-cyan-500/20 bg-cyan-950/10 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-cyan-300/80">
        Suggested structure
      </p>
      <p className="mt-1 text-sm text-slate-400">
        Based on sector template <span className="text-cyan-200">{recommendations.sectorKey}</span>.
        Edit on structure pages — not AI certainty.
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <ChipList title="Departments" items={recommendations.departments} />
        <ChipList title="Roles" items={recommendations.roles} />
        <ChipList title="Workflows" items={recommendations.workflows} />
        <ChipList title="CyberCrow baselines" items={recommendations.cybercrow} />
        <ChipList title="SAREA profiles" items={recommendations.sarea} />
      </div>

      <ul className="mt-4 space-y-1 border-t border-white/10 pt-3 text-xs text-slate-500">
        {recommendations.blueprintNotes.map((n) => (
          <li key={n}>{n}</li>
        ))}
      </ul>
    </section>
  );
}

function ChipList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="text-xs font-medium text-slate-500">{title}</h3>
      <ul className="mt-2 flex flex-wrap gap-1.5">
        {items.map((item) => (
          <li
            key={item}
            className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-slate-300"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
