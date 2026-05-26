const PIPELINE = ["Request", "Discovery", "Blueprint", "Runtime"] as const;

const RUNTIME_ENGINES = [
  { id: "cem", label: "CEM", role: "Operations", accent: "cyan" as const },
  { id: "cybercrow", label: "CyberCrow", role: "Trust", accent: "violet" as const },
  { id: "sarea", label: "SAREA", role: "Experience", accent: "teal" as const },
] as const;

const SCENARIO_CHIPS = ["Logistics", "Construction", "Aviation-style intake"] as const;

const ACCENT_STYLES = {
  cyan: {
    node: "border-cyan-500/35 bg-cyan-500/10 shadow-[0_0_20px_rgba(34,211,238,0.12)]",
    dot: "bg-cyan-400",
    text: "text-cyan-200/90",
  },
  violet: {
    node: "border-violet-500/35 bg-violet-500/10 shadow-[0_0_20px_rgba(139,92,246,0.12)]",
    dot: "bg-violet-400",
    text: "text-violet-200/90",
  },
  teal: {
    node: "border-teal-500/35 bg-teal-500/10 shadow-[0_0_20px_rgba(45,212,191,0.12)]",
    dot: "bg-teal-400",
    text: "text-teal-200/90",
  },
} as const;

function FlowArrow() {
  return (
    <div className="flex shrink-0 items-center px-0.5 sm:px-1" aria-hidden>
      <div className="h-px w-2 bg-gradient-to-r from-cyan-500/50 to-violet-500/40 sm:w-3" />
      <span className="text-[10px] text-cyan-400/60">›</span>
    </div>
  );
}

function PipelineNode({
  label,
  highlight = false,
}: {
  label: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex min-w-0 flex-1 flex-col items-center gap-1 rounded-lg border px-1 py-2 text-center sm:px-2 sm:py-2.5 ${
        highlight
          ? "border-violet-400/40 bg-violet-500/15 shadow-[0_0_24px_rgba(139,92,246,0.18)]"
          : "border-white/[0.08] bg-white/[0.03]"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${highlight ? "bg-violet-300 shadow-[0_0_8px_rgba(167,139,250,0.8)]" : "bg-cyan-400/70"}`}
        aria-hidden
      />
      <span
        className={`text-[9px] font-semibold uppercase leading-tight tracking-wide sm:text-[10px] ${
          highlight ? "text-violet-100" : "text-slate-300"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

function EngineNode({
  label,
  role,
  accent,
}: {
  label: string;
  role: string;
  accent: keyof typeof ACCENT_STYLES;
}) {
  const styles = ACCENT_STYLES[accent];
  return (
    <div
      className={`flex flex-col items-center gap-1 rounded-xl border px-1.5 py-2.5 text-center sm:px-2 ${styles.node}`}
    >
      <span className={`h-1 w-1 rounded-full ${styles.dot}`} aria-hidden />
      <span className={`text-[10px] font-bold leading-none sm:text-[11px] ${styles.text}`}>
        {label}
      </span>
      <span className="text-[8px] font-medium uppercase tracking-wider text-slate-500 sm:text-[9px]">
        {role}
      </span>
    </div>
  );
}

export function EnterpriseOperatingModelCard() {
  return (
    <aside
      className="relative w-full max-w-md"
      aria-labelledby="hero-os-map-title"
      aria-describedby="hero-os-map-desc"
    >
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br from-cyan-500/20 via-violet-500/15 to-teal-500/10 opacity-90 blur-sm"
        aria-hidden
      />
      <div className="relative overflow-hidden rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-slate-950/95 via-cc-elevated/75 to-violet-950/35 p-4 shadow-[0_12px_48px_rgba(0,0,0,0.4)] backdrop-blur-md sm:p-5">
        <div
          className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-cyan-500/10 blur-2xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-8 left-1/4 h-24 w-24 rounded-full bg-violet-600/12 blur-2xl"
          aria-hidden
        />

        <div className="relative">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-400/90">
            Operating model map
          </p>
          <h2
            id="hero-os-map-title"
            className="mt-1 font-display text-base font-bold text-white sm:text-lg"
          >
            Platform flow
          </h2>
          <p id="hero-os-map-desc" className="sr-only">
            Request to discovery to blueprint to runtime, then CEM for operations, CyberCrow for
            trust, and SAREA for experience. Demo scenarios include logistics, construction, and
            aviation-style intake. Portfolio staging validated; production launch deferred.
          </p>

          <div className="mt-4">
            <div className="flex items-stretch">
              {PIPELINE.map((step, index) => (
                <div key={step} className="flex min-w-0 flex-1 items-center">
                  <PipelineNode label={step} highlight={step === "Runtime"} />
                  {index < PIPELINE.length - 1 ? <FlowArrow /> : null}
                </div>
              ))}
            </div>

            <div className="relative mx-auto mt-1 flex h-7 w-full max-w-[72%] justify-center" aria-hidden>
              <svg
                className="h-full w-full overflow-visible"
                viewBox="0 0 200 28"
                preserveAspectRatio="none"
                fill="none"
              >
                <path
                  d="M100 0 L100 10"
                  stroke="url(#fork-stem)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M100 10 L32 26 M100 10 L100 26 M100 10 L168 26"
                  stroke="url(#fork-branch)"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="fork-stem" x1="0" y1="0" x2="0" y2="1">
                    <stop stopColor="rgb(139, 92, 246)" stopOpacity="0.7" />
                    <stop offset="1" stopColor="rgb(34, 211, 238)" stopOpacity="0.4" />
                  </linearGradient>
                  <linearGradient id="fork-branch" x1="0" y1="0" x2="1" y2="0">
                    <stop stopColor="rgb(34, 211, 238)" stopOpacity="0.45" />
                    <stop offset="0.5" stopColor="rgb(139, 92, 246)" stopOpacity="0.55" />
                    <stop offset="1" stopColor="rgb(45, 212, 191)" stopOpacity="0.45" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {RUNTIME_ENGINES.map((engine) => (
                <EngineNode
                  key={engine.id}
                  label={engine.label}
                  role={engine.role}
                  accent={engine.accent}
                />
              ))}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap justify-center gap-1.5 border-t border-white/[0.06] pt-3.5">
            {SCENARIO_CHIPS.map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-white/[0.08] bg-black/25 px-2 py-0.5 text-[9px] font-medium text-slate-400 sm:text-[10px]"
              >
                {chip}
              </span>
            ))}
          </div>

          <p className="mt-3 text-center text-[9px] font-medium leading-relaxed text-slate-500 sm:text-[10px]">
            <span className="text-slate-400">Portfolio / staging validated</span>
            <span className="mx-1.5 text-slate-600" aria-hidden>
              ·
            </span>
            <span>Production launch deferred</span>
          </p>
        </div>
      </div>
    </aside>
  );
}
