type ProCrowWorkbenchSectionProps = {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  collapsible?: boolean;
};

export function ProCrowWorkbenchSection({
  title,
  description,
  action,
  children,
  defaultOpen = true,
  collapsible = false,
}: ProCrowWorkbenchSectionProps) {
  if (collapsible) {
    return (
      <details className="cc-glass-card group !p-0" open={defaultOpen}>
        <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-2 px-5 py-4 marker:content-none [&::-webkit-details-marker]:hidden">
          <div>
            <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-slate-400">{title}</h2>
            {description && <p className="mt-1 text-xs text-slate-500">{description}</p>}
          </div>
          {action}
        </summary>
        <div className="space-y-4 border-t border-slate-700/50 px-5 pb-5 pt-4">{children}</div>
      </details>
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-slate-400">{title}</h2>
          {description && <p className="mt-1 text-xs text-slate-500">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
