import { CYBERCROW_AUDIT_ACTIONS } from "@/lib/constants/cybercrow-audit-events";
import { MOCK_CYBERCROW_DASHBOARD } from "@/lib/mock/workspace-summary";

const NAV_ITEMS = [
  { label: "Dashboard", short: "Dash" },
  { label: "Audit", short: "Audit" },
  { label: "Events", short: "Events" },
  { label: "GRC", short: "GRC" },
] as const;

const LOGISTICS_AUDIT_LINES = [
  {
    action: CYBERCROW_AUDIT_ACTIONS.ROUTE_ANOMALY_DETECTED,
    time: "14m ago",
    severity: "medium" as const,
  },
  {
    action: CYBERCROW_AUDIT_ACTIONS.LOGISTICS_DISPATCH_APPROVED,
    time: "1h ago",
    severity: "info" as const,
  },
  {
    action: CYBERCROW_AUDIT_ACTIONS.OCR_DOCUMENT_CAPTURED,
    time: "3h ago",
    severity: "info" as const,
  },
] as const;

const SEVERITY_DOT = {
  info: "bg-cyan-400",
  medium: "bg-amber-400",
  high: "bg-rose-400",
  low: "bg-teal-400",
} as const;

function formatAction(action: string): string {
  return action.replace(/_/g, " ").toLowerCase();
}

/** Mini CyberCrow dashboard chrome for public marketing bento cards. */
export function CyberCrowCardPreview() {
  const mock = MOCK_CYBERCROW_DASHBOARD;
  const riskLevel = mock.riskScore >= 80 ? "low" : mock.riskScore >= 60 ? "mid" : "high";

  return (
    <div
      className="cc-cybercrow-card-preview relative mt-4 overflow-hidden rounded-xl border border-violet-500/25 bg-gradient-to-br from-violet-950/50 via-cc-elevated/95 to-indigo-950/40 p-2.5 sm:p-3"
      aria-hidden
    >
      <div
        className="pointer-events-none absolute -right-6 -top-6 h-16 w-16 rounded-full bg-violet-600/20 blur-2xl"
        aria-hidden
      />
      <div className="relative flex gap-2 sm:gap-2.5">
        <div className="flex w-9 shrink-0 flex-col gap-1 rounded-lg border border-violet-500/15 bg-black/25 py-2 px-1 sm:w-10">
          {NAV_ITEMS.map((item, i) => (
            <div
              key={item.label}
              title={item.label}
              className={`rounded px-0.5 py-0.5 text-center text-[7px] font-medium leading-tight sm:text-[8px] ${
                i === 0
                  ? "bg-violet-500/25 text-violet-200"
                  : "text-slate-600"
              }`}
            >
              {item.short}
            </div>
          ))}
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-1.5">
            <div>
              <p className="text-[8px] font-semibold uppercase tracking-[0.15em] text-violet-300/90 sm:text-[9px]">
                Posture
              </p>
              <p className="font-display text-lg font-bold tabular-nums leading-none text-white sm:text-xl">
                {mock.riskScore}
                <span className="ml-0.5 text-[10px] font-medium text-violet-300/70">/100</span>
              </p>
            </div>
            <div className="min-w-[4.5rem] flex-1 max-w-[5.5rem]">
              <div className="cc-risk-meter h-1.5 sm:h-2">
                <span
                  className={`cc-risk-meter-fill cc-risk-meter-fill--${riskLevel}`}
                  style={{ width: `${mock.riskScore}%` }}
                />
              </div>
              <p className="mt-0.5 text-right text-[7px] text-slate-500 sm:text-[8px]">
                NCA-aligned readiness
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-1">
            <span className="rounded-full border border-teal-500/30 bg-teal-500/10 px-1.5 py-0.5 text-[7px] font-medium text-teal-300 sm:text-[8px]">
              Logistics ops
            </span>
            <span className="rounded-full border border-violet-500/20 bg-violet-500/5 px-1.5 py-0.5 text-[7px] text-slate-500 sm:text-[8px]">
              38 events
            </span>
          </div>

          <ul className="space-y-1 border-t border-white/5 pt-1.5">
            {LOGISTICS_AUDIT_LINES.map((line) => (
              <li
                key={line.action}
                className="flex items-center gap-1.5 text-[8px] leading-tight sm:text-[9px]"
              >
                <span
                  className={`h-1 w-1 shrink-0 rounded-full ${SEVERITY_DOT[line.severity]}`}
                  aria-hidden
                />
                <span className="min-w-0 flex-1 truncate text-slate-300">
                  {formatAction(line.action)}
                </span>
                <span className="shrink-0 text-slate-600">{line.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
