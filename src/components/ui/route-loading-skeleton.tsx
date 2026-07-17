export function RouteLoadingSkeleton({ message = "Loading…" }: { message?: string }) {
  return (
    <div className="mx-auto max-w-4xl space-y-4 p-6" role="status" aria-live="polite" aria-busy="true">
      <p className="text-sm text-slate-400">{message}</p>
      <div className="h-8 w-48 animate-pulse rounded-lg bg-slate-800 motion-reduce:animate-none" />
      <div className="space-y-3">
        <div className="h-24 animate-pulse rounded-xl bg-slate-800/80 motion-reduce:animate-none" />
        <div className="h-24 animate-pulse rounded-xl bg-slate-800/80 motion-reduce:animate-none" />
        <div className="h-24 animate-pulse rounded-xl bg-slate-800/80 motion-reduce:animate-none" />
      </div>
    </div>
  );
}
