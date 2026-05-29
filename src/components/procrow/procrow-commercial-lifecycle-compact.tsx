import { COMMERCIAL_LIFECYCLE_SAFETY_COPY, COMMERCIAL_LIFECYCLE_STEPS } from "@/lib/constants/commercial-lifecycle";

/** L2 — compact commercial lifecycle for request workspace (no payments). */
export function ProCrowCommercialLifecycleCompact() {
  const highlightIds = new Set([
    "scope_approval",
    "setup_invoice",
    "tenant_build",
    "go_no_go",
    "runtime_ready",
    "subscription",
  ]);

  return (
    <div className="cc-glass-card space-y-3 !p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Commercial lifecycle</p>
      <ol className="space-y-2">
        {COMMERCIAL_LIFECYCLE_STEPS.filter((s) => highlightIds.has(s.id)).map((step) => (
          <li key={step.id} className="text-xs text-slate-400">
            <span className="font-medium text-slate-300">{step.label}</span>
            <span className="text-slate-600"> — </span>
            {step.summary}
          </li>
        ))}
      </ol>
      <p className="text-[10px] text-slate-600">{COMMERCIAL_LIFECYCLE_SAFETY_COPY}</p>
    </div>
  );
}
