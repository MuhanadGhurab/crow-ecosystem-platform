import { TENANT_COMMAND_CENTER_LIFECYCLE_STEPS } from "@/lib/constants/tenant-command-center";

export function TenantLifecycleStepper() {
  return (
    <nav
      className="rounded-xl border border-slate-700/50 bg-slate-900/30 p-4"
      aria-label="Tenant lifecycle"
    >
      <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
        Tenant lifecycle · invite creation belongs at Workforce Activation
      </p>
      <ol className="mt-3 flex flex-wrap gap-2 sm:gap-3">
        {TENANT_COMMAND_CENTER_LIFECYCLE_STEPS.map((step, index) => {
          const isCurrent = step.current === true;
          return (
            <li key={step.id} className="flex min-w-0 items-center gap-2">
              <div
                className={`flex min-w-0 items-center gap-2 rounded-lg border px-3 py-2 ${
                  isCurrent
                    ? "border-cyan-500/50 bg-cyan-500/15 ring-1 ring-cyan-500/25"
                    : "border-slate-700/50 bg-slate-950/30"
                }`}
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${
                    isCurrent ? "bg-cyan-500 text-slate-950" : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {step.order}
                </span>
                <span
                  className={`truncate text-xs font-medium ${
                    isCurrent ? "text-cyan-100" : "text-slate-400"
                  }`}
                >
                  {step.label}
                </span>
                {isCurrent && (
                  <span className="hidden shrink-0 rounded-full border border-cyan-400/40 px-2 py-0.5 text-[10px] uppercase tracking-wide text-cyan-200 sm:inline">
                    You are here
                  </span>
                )}
              </div>
              {index < TENANT_COMMAND_CENTER_LIFECYCLE_STEPS.length - 1 && (
                <span className="hidden text-slate-600 sm:inline" aria-hidden>
                  →
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
