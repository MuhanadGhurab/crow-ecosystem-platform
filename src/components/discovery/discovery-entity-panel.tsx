type DiscoveryEntityPanelProps = {
  title: string;
  description: string;
  emptyLabel: string;
  items: { id: string; primary: string; secondary?: string }[];
  requestId: string;
  addAction?: (requestId: string, formData: FormData) => Promise<void>;
  removeAction?: (requestId: string, id: string) => Promise<void>;
  children?: React.ReactNode;
};

export function DiscoveryEntityPanel({
  title,
  description,
  emptyLabel,
  items,
  requestId,
  addAction,
  removeAction,
  children,
}: DiscoveryEntityPanelProps) {
  const readOnly = !addAction || !removeAction;
  const boundAdd = addAction?.bind(null, requestId);

  return (
    <section className="cc-glass-card space-y-4">
      <header>
        <h3 className="text-sm font-medium text-cyan-400">{title}</h3>
        <p className="mt-1 text-sm text-slate-400">{description}</p>
      </header>

      {items.length === 0 ? (
        <p className="text-sm text-slate-500">{emptyLabel}</p>
      ) : (
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.id} className="cc-list-item">
              <div>
                <p className="text-sm text-white">{item.primary}</p>
                {item.secondary && <p className="text-xs text-slate-500">{item.secondary}</p>}
              </div>
              {!readOnly && removeAction && (
                <form action={removeAction.bind(null, requestId, item.id)}>
                  <button
                    type="submit"
                    className="text-xs text-red-400 hover:text-red-300"
                    aria-label={`Remove ${item.primary}`}
                  >
                    Remove
                  </button>
                </form>
              )}
            </li>
          ))}
        </ul>
      )}

      {!readOnly && boundAdd && (
        <form action={boundAdd} className="grid gap-3 border-t border-cyan-500/10 pt-4 sm:grid-cols-2">
          {children}
          <div className="sm:col-span-2">
            <button type="submit" className="cc-btn-secondary text-sm">
              Add {title.toLowerCase().replace(/s$/, "")}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
