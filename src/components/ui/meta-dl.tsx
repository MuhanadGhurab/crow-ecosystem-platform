export type MetaDlItem = {
  label: string;
  value: React.ReactNode;
};

export function MetaDl({ items }: { items: MetaDlItem[] }) {
  return (
    <dl className="cc-meta-dl">
      {items.map((item) => (
        <div key={item.label}>
          <dt>{item.label}</dt>
          <dd>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
