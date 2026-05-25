import {

  USAGE_STATUS_LABELS,

  type TenantUsageSignals,

  type UsageSignalStatus,

} from "@/lib/services/usage-signals.service";



const STATUS_TONE: Record<UsageSignalStatus, string> = {

  healthy: "text-emerald-300 border-emerald-500/25 bg-emerald-500/10",

  near_limit: "text-amber-300 border-amber-500/25 bg-amber-500/10",

  over_recommended_limit: "text-orange-300 border-orange-500/25 bg-orange-500/10",

  upgrade_recommended: "text-violet-300 border-violet-500/25 bg-violet-500/10",

};



export function TenantUsageSignalsPanel({ signals }: { signals: TenantUsageSignals }) {

  return (

    <section className="cc-glass-card space-y-4 !p-6">

      <div className="flex flex-wrap items-center justify-between gap-3">

        <div>

          <h3 className="text-sm font-medium text-cyan-400">Usage signals</h3>

          <p className="mt-1 text-xs text-slate-500">

            Live counts vs {signals.planDisplayName} recommended bands — advisory only, not enforced

            at runtime.

          </p>

        </div>

        <span

          className={`rounded-full border px-3 py-1 text-xs font-medium ${STATUS_TONE[signals.overallStatus]}`}

        >

          {USAGE_STATUS_LABELS[signals.overallStatus]}

        </span>

      </div>



      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

        {signals.metrics.map((m) => (

          <div

            key={m.key}

            className={`rounded-cc-sm border px-3 py-3 ${

              m.status === "healthy"

                ? "border-white/10 bg-white/[0.02]"

                : "border-amber-500/15 bg-amber-500/5"

            }`}

          >

            <div className="flex items-center justify-between gap-2">

              <p className="text-xs text-slate-500">{m.label}</p>

              <span className={`text-[10px] uppercase ${STATUS_TONE[m.status].split(" ")[0]}`}>

                {USAGE_STATUS_LABELS[m.status]}

              </span>

            </div>

            <p className="mt-1 font-mono text-lg font-semibold text-white">

              {m.used}

              <span className="text-sm font-normal text-slate-500">

                {" "}

                / {m.max >= 99 ? "∞" : m.max}

              </span>

            </p>

            {m.max < 99 && (

              <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">

                <div

                  className={`h-full rounded-full ${

                    m.status === "healthy" ? "bg-teal-500/60" : "bg-amber-500/70"

                  }`}

                  style={{ width: `${Math.min(100, m.percent)}%` }}

                />

              </div>

            )}

          </div>

        ))}

      </div>



      {signals.upgradeNote && (

        <p className="rounded-cc-sm border border-cyan-500/20 bg-cyan-500/5 px-4 py-3 text-sm text-slate-300">

          {signals.upgradeNote}

        </p>

      )}

    </section>

  );

}


