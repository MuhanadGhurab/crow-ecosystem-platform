import type { BlueprintTraceTimeline } from "@/lib/crow-core/traceability";

type Props = {
  timeline: BlueprintTraceTimeline;
};

export function BlueprintStudioTraceabilityDrawer({ timeline }: Props) {
  return (
    <aside className="cc-glass-card sticky top-4 max-h-[70vh] overflow-y-auto p-4">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
        Traceability
      </h2>
      <p className="mt-1 text-xs text-slate-500">
        Chain {timeline.chainComplete ? "complete" : "incomplete"} · {timeline.events.length}{" "}
        events
      </p>
      {(timeline.missingStages?.length ?? 0) > 0 && (
        <p className="mt-2 text-xs text-amber-300">
          Missing stages: {timeline.missingStages?.join(", ")}
        </p>
      )}
      <ol className="mt-4 space-y-3">
        {timeline.events.length === 0 ? (
          <li className="text-sm text-slate-500">No trace events recorded yet.</li>
        ) : (
          timeline.events.map((event) => (
            <li key={event.id} className="border-l-2 border-cyan-500/40 pl-3">
              <p className="text-xs text-slate-500">
                {new Date(event.timestamp).toLocaleString()} · {event.stage}
              </p>
              <p className="text-sm text-slate-200">{event.summary}</p>
              <p className="text-xs text-slate-500">
                {event.actor.displayName}
                {event.actor.isNonHuman ? " (non-human)" : ""}
                {event.aiAssisted ? " · AI-assisted" : ""}
              </p>
            </li>
          ))
        )}
      </ol>
    </aside>
  );
}
