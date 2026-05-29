type ProCrowBlockerListProps = {
  blockers: string[];
  emptyLabel?: string;
};

export function ProCrowBlockerList({
  blockers,
  emptyLabel = "No blockers flagged from current signals.",
}: ProCrowBlockerListProps) {
  if (blockers.length === 0) {
    return <p className="text-sm text-slate-500">{emptyLabel}</p>;
  }
  return (
    <ul className="space-y-2">
      {blockers.map((b) => (
        <li
          key={b}
          className="rounded-lg border border-amber-500/25 bg-amber-500/5 px-3 py-2 text-sm text-amber-100/90"
        >
          {b}
        </li>
      ))}
    </ul>
  );
}
