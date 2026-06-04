import {
  BUSINESS_PORTAL_RUNTIME_NOTE,
  TENANT_RUNTIME_DEFINITION,
  TENANT_RUNTIME_DEMO_BEATS,
  TENANT_RUNTIME_PROCROW_NOTE,
  type TenantRuntimeDemoBeat,
} from "@/lib/constants/tenant-runtime-demo";

type TenantRuntimeDemoHintProps = {
  beat?: TenantRuntimeDemoBeat;
  compact?: boolean;
};

/** K1 — scannable runtime context for demo pages (informational). */
export function TenantRuntimeDemoHint({ beat, compact }: TenantRuntimeDemoHintProps) {
  const beatLine = beat ? TENANT_RUNTIME_DEMO_BEATS[beat] : null;

  return (
    <aside
      className={`rounded-lg border border-cyan-500/15 bg-cyan-950/20 text-slate-400 ${
        compact ? "px-3 py-2 text-[11px]" : "px-4 py-3 text-xs"
      }`}
      aria-label="Tenant runtime context"
    >
      <p>
        <span className="font-semibold text-cyan-300/90">Business Portal · CEM</span>
        {" — "}
        {TENANT_RUNTIME_DEFINITION}
      </p>
      {beatLine && <p className="mt-1 text-slate-500">{beatLine}</p>}
      {!compact && (
        <>
          <p className="mt-2 text-[10px] text-slate-600">{BUSINESS_PORTAL_RUNTIME_NOTE}</p>
          <p className="mt-1 text-[10px] text-slate-600">{TENANT_RUNTIME_PROCROW_NOTE}</p>
        </>
      )}
    </aside>
  );
}
