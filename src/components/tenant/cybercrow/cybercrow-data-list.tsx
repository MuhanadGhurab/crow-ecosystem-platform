export function CybercrowDataList({
  title,
  empty,
  children,
}: {
  title: string;
  empty: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h3 className="text-sm font-medium text-cyan-400">{title}</h3>
      {children ?? <p className="text-sm text-slate-500">{empty}</p>}
    </section>
  );
}
