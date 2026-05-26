const SCENARIOS = [
  {
    title: "Logistics operations",
    summary:
      "Multi-tenant departments, workflows, CyberCrow posture, and SAREA personas.",
    chip: "Demo operating model",
  },
  {
    title: "Construction operations",
    summary: "Project-style departments, role mapping, tasks, and reporting readiness.",
    chip: "Enterprise-scale flows tested",
  },
  {
    title: "Aviation-style intake",
    summary: "Organic request → discovery → blueprint readiness flow.",
    chip: "Staging validated",
  },
] as const;

export function EnterpriseScenarioProofCard() {
  return (
    <aside
      className="relative w-full max-w-md"
      aria-labelledby="hero-scenario-proof-title"
    >
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br from-cyan-500/20 via-violet-500/15 to-violet-600/10 opacity-80 blur-sm"
        aria-hidden
      />
      <div className="relative overflow-hidden rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-slate-950/90 via-cc-elevated/80 to-violet-950/40 p-5 shadow-[0_12px_48px_rgba(0,0,0,0.35)] backdrop-blur-md sm:p-6">
        <div
          className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-cyan-500/10 blur-2xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-6 -left-6 h-20 w-20 rounded-full bg-violet-600/15 blur-2xl"
          aria-hidden
        />

        <div className="relative">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-400/90">
            Portfolio proof
          </p>
          <h2
            id="hero-scenario-proof-title"
            className="mt-2 font-display text-lg font-bold leading-snug text-white sm:text-xl"
          >
            Validated enterprise scenarios
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            Crow has been tested across multiple operating models without activating paid
            production infrastructure.
          </p>

          <ul className="mt-5 space-y-3" role="list">
            {SCENARIOS.map((scenario) => (
              <li
                key={scenario.title}
                className="rounded-xl border border-white/[0.06] bg-black/20 px-3.5 py-3 sm:px-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold text-slate-100">{scenario.title}</h3>
                  <span className="shrink-0 rounded-full border border-cyan-500/25 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-cyan-200/90">
                    {scenario.chip}
                  </span>
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-500 sm:text-[13px]">
                  {scenario.summary}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-5 flex flex-wrap gap-2 border-t border-white/[0.06] pt-4">
            <span className="inline-flex items-center rounded-full border border-violet-500/30 bg-violet-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-violet-200">
              Portfolio / staging validated
            </span>
            <span className="inline-flex items-center rounded-full border border-slate-500/30 bg-slate-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-300">
              Production launch deferred
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
