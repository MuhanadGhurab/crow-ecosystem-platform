import {
  materializationStateLabel,
  type SareaPersonaMaterializationState,
} from "@/lib/services/sarea-materialization.service";

export function SareaMaterializationBadge({ state }: { state: SareaPersonaMaterializationState }) {
  const cls =
    state === "tenant_backed"
      ? "bg-teal-500/15 text-teal-300"
      : state === "partial"
        ? "bg-amber-500/15 text-amber-300"
        : state === "recommended_fallback"
          ? "bg-violet-500/15 text-violet-300"
          : "bg-slate-500/20 text-slate-400";

  return (
    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${cls}`}>
      {materializationStateLabel(state)}
    </span>
  );
}
