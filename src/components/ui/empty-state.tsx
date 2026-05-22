interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="cc-glass-card border-dashed !border-cyan-500/20 !bg-white/[0.02] py-12 text-center">
      <span className="text-2xl text-cc-star/80" aria-hidden>
        ✦
      </span>
      <p className="mt-3 font-medium text-white">{title}</p>
      {description && <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
