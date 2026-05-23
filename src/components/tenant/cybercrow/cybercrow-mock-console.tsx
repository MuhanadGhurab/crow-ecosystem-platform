import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { MOCK_CYBERCROW_DASHBOARD } from "@/lib/mock/workspace-summary";

const SEVERITY_CLASS: Record<string, string> = {
  info: "border-cyan-500/20 bg-cyan-500/10 text-cyan-300",
  low: "border-teal-500/20 bg-teal-500/10 text-teal-300",
  medium: "border-amber-500/20 bg-amber-500/10 text-amber-200",
  high: "border-rose-500/20 bg-rose-500/10 text-rose-200",
};

interface CybercrowMockConsoleProps {
  title: string;
  description: string;
  slug: string;
  backHref: string;
  variant: "sessions" | "events" | "identity" | "evidence";
}

export function CybercrowMockConsole({
  title,
  description,
  slug,
  backHref,
  variant,
}: CybercrowMockConsoleProps) {
  const mock = MOCK_CYBERCROW_DASHBOARD;

  return (
    <div className="cc-entity-cybercrow space-y-8">
      <div className="cc-alert-warning text-sm text-amber-100">
        Demo metrics — connect Entra / session store for production session and evidence data.
      </div>
      <PageHeader badge="CyberCrow" title={title} description={description} entity="cybercrow" />

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {variant === "sessions" && (
          <>
            <StatCard
              label="Active sessions"
              value={mock.privilegedSessions}
              entity="cybercrow"
              accent="violet"
            />
            <StatCard label="MFA coverage" value={`${mock.mfaCoverage}%`} entity="cybercrow" accent="indigo" />
            <StatCard label="Risk score" value={mock.riskScore} entity="cybercrow" accent="violet" trend="down" />
            <StatCard label="Open incidents" value={mock.openIncidents} entity="cybercrow" accent="star" />
          </>
        )}
        {variant === "events" && (
          <>
            <StatCard label="Events (24h)" value={mock.recentEvents.length * 12} entity="cybercrow" accent="violet" />
            <StatCard label="Correlated" value={3} entity="cybercrow" accent="indigo" />
            <StatCard label="Playbooks run" value={2} entity="cybercrow" accent="violet" />
            <StatCard label="Risk score" value={mock.riskScore} entity="cybercrow" accent="star" trend="down" />
          </>
        )}
        {variant === "identity" && (
          <>
            <StatCard label="Directory users" value={142} entity="cybercrow" accent="violet" />
            <StatCard label="MFA enrolled" value={`${mock.mfaCoverage}%`} entity="cybercrow" accent="indigo" />
            <StatCard label="Privileged roles" value={8} entity="cybercrow" accent="violet" />
            <StatCard label="IdP sync" value="OK" entity="cybercrow" accent="teal" hint="Entra ID" />
          </>
        )}
        {variant === "evidence" && (
          <>
            <StatCard label="Artifacts" value={24} entity="cybercrow" accent="violet" />
            <StatCard label="Attested" value={`${mock.compliancePct}%`} entity="cybercrow" accent="indigo" />
            <StatCard label="Pending review" value={3} entity="cybercrow" accent="star" />
            <StatCard label="Controls mapped" value={mock.controls.length} entity="cybercrow" accent="violet" />
          </>
        )}
      </section>

      <section className="cc-glass-card">
        <h3 className="text-sm font-medium text-violet-300">
          {variant === "sessions" && "Privileged sessions"}
          {variant === "events" && "Recent security events"}
          {variant === "identity" && "Identity posture"}
          {variant === "evidence" && "Evidence & controls"}
        </h3>
        <ul className="mt-4 space-y-2">
          {(variant === "events" ? mock.recentEvents : mock.controls).map((item) => (
            <li
              key={"id" in item ? item.id : item.key}
              className="cc-list-item flex-col !items-start gap-2 sm:flex-row sm:items-center"
            >
              {"action" in item ? (
                <>
                  <span className="font-medium text-white">{item.action}</span>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase ${SEVERITY_CLASS[item.severity] ?? SEVERITY_CLASS.info}`}
                  >
                    {item.severity}
                  </span>
                  <span className="text-xs text-slate-500 sm:ml-auto">{item.at}</span>
                </>
              ) : (
                <>
                  <span className="font-mono text-sm text-white">{item.key}</span>
                  <div className="flex flex-1 items-center gap-3 sm:justify-end">
                    <div className="cc-risk-meter max-w-[8rem] flex-1">
                      <span
                        className={`cc-risk-meter-fill ${item.pct >= 90 ? "cc-risk-meter-fill--low" : item.pct >= 70 ? "cc-risk-meter-fill--mid" : "cc-risk-meter-fill--high"}`}
                        style={{ width: `${item.pct}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-500">{item.status}</span>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
        {variant === "sessions" && (
          <ul className="mt-4 space-y-2">
            {[
              { user: "admin@tenant.local", role: "Global Admin", risk: "medium" },
              { user: "secops@tenant.local", role: "Security Analyst", risk: "low" },
              { user: "svc-provision", role: "Service Principal", risk: "low" },
            ].map((s) => (
              <li key={s.user} className="cc-list-item">
                <span className="text-white">{s.user}</span>
                <span className="text-slate-500">
                  {s.role} · <span className="text-violet-300">{s.risk}</span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="text-xs text-slate-600">
        Mock console UI · tenant <span className="font-mono text-slate-500">/{slug}</span>
      </p>
      <Link href={backHref} className="text-sm text-violet-400 hover:text-violet-300">
        ← CyberCrow dashboard
      </Link>
    </div>
  );
}
