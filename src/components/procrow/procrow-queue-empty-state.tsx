export function ProCrowQueueEmptyState({ message }: { message?: string }) {
  return (
    <div className="cc-glass-card border border-slate-700/50 !p-5 text-sm text-slate-500">
      <p className="font-medium text-slate-400">No queue items in this view</p>
      <p className="mt-2 text-xs leading-relaxed text-slate-500">
        {message ??
          "Derived operator queue is empty — triage intake, connect staging data, or refresh after client portal activity."}
      </p>
    </div>
  );
}
