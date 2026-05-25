import type { CybercrowIdentityTelemetrySummary } from "@/lib/services/cybercrow-identity-telemetry.service";

type Props = {
  summary: CybercrowIdentityTelemetrySummary;
  mfaRequired: boolean;
  idpLabel: string;
};

export function IdentityTelemetrySummary({ summary, mfaRequired, idpLabel }: Props) {
  return (
    <section className="space-y-4">
      <div className="cc-glass-card grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-xs text-slate-500">Login events</p>
          <p className="mt-1 text-lg font-semibold text-white">{summary.loginEventCount}</p>
          {summary.failedLoginCount > 0 ? (
            <p className="text-xs text-amber-400">{summary.failedLoginCount} failed</p>
          ) : null}
        </div>
        <div>
          <p className="text-xs text-slate-500">Session events</p>
          <p className="mt-1 text-lg font-semibold text-white">{summary.sessionEventCount}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Access attempts</p>
          <p className="mt-1 text-lg font-semibold text-white">{summary.accessAttemptCount}</p>
          {summary.deniedAccessCount > 0 ? (
            <p className="text-xs text-rose-400">{summary.deniedAccessCount} denied</p>
          ) : null}
        </div>
        <div>
          <p className="text-xs text-slate-500">Device trust records</p>
          <p className="mt-1 text-lg font-semibold text-white">{summary.deviceTrustCount}</p>
        </div>
      </div>

      <div className="cc-glass-card grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-xs text-slate-500">MFA policy (tenant)</p>
          <p className="mt-1 text-sm text-white">{mfaRequired ? "Required" : "Not enforced"}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">IdP preference (discovery)</p>
          <p className="mt-1 text-sm text-white">{idpLabel}</p>
        </div>
      </div>

      {summary.suspiciousIndicators.length > 0 ? (
        <section className="rounded-lg border border-amber-500/20 bg-amber-950/20 px-4 py-3">
          <p className="text-sm font-medium text-amber-300">Access signals</p>
          <ul className="mt-2 list-inside list-disc text-xs text-slate-400">
            {summary.suspiciousIndicators.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </section>
      ) : (
        <p className="text-xs text-slate-500">
          No suspicious access signals in stored telemetry — posture reflects policy and audit
          supplements below.
        </p>
      )}

      <section className="cc-glass-card">
        <h3 className="text-sm font-medium text-violet-300">Telemetry sources</h3>
        <p className="mt-1 text-xs text-slate-500">
          Identity posture is assembled from tenant-scoped tables and CyberCrow audit — not live
          Entra sync, SIEM export, or AI inference.
        </p>
        <ul className="mt-3 space-y-2">
          {summary.sources.map((s) => (
            <li key={s.table} className="flex items-start gap-2 text-xs">
              <span
                className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${s.available ? "bg-teal-400" : "bg-slate-600"}`}
                aria-hidden
              />
              <span className="text-slate-400">
                <span className="font-mono text-slate-300">{s.table}</span> — {s.description}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </section>
  );
}
