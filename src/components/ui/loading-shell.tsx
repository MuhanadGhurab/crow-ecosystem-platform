export function LoadingShell({ rows = 4 }: { rows?: number }) {
  return (
    <div className="animate-pulse space-y-4" aria-hidden>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="h-16 rounded-cc border border-cyan-500/10 bg-gradient-to-r from-white/[0.03] to-transparent"
        />
      ))}
    </div>
  );
}
