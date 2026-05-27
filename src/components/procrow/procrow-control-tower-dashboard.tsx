import Link from "next/link";
import type { ProCrowControlTowerSnapshot, ProCrowReadinessStatus } from "@/lib/procrow/procrow-control-tower-contract";
import { ProCrowOperatorQueuePanel } from "@/components/procrow/procrow-operator-queue-panel";
import { routes } from "@/lib/routes";
import { MEEM_TENANT_SLUG } from "@/lib/constants/meem";

function readinessChip(status: ProCrowReadinessStatus): string {
  switch (status) {
    case "healthy":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-200";
    case "needs_review":
      return "border-amber-500/30 bg-amber-500/10 text-amber-100";
    case "blocked":
      return "border-rose-500/40 bg-rose-500/10 text-rose-200";
    case "not_enabled":
      return "border-slate-600 bg-slate-800/60 text-slate-400";
    default:
      return "border-slate-600/50 bg-slate-800/40 text-slate-400";
  }
}

function formatGeneratedAt(d: Date): string {
  try {
    return d.toISOString().slice(0, 16).replace("T", " ") + " UTC";
  } catch {
    return "—";
  }
}

type ProCrowControlTowerDashboardProps = {
  snapshot: ProCrowControlTowerSnapshot;
};

export function ProCrowControlTowerDashboard({ snapshot: s }: ProCrowControlTowerDashboardProps) {
  const cf = s.customerFlow;
  const cyberSlug = s.trustPosture.primaryTenantSlugForCyberCrow ?? MEEM_TENANT_SLUG;

  const flow = [
    { label: "Request", count: cf.totalRequests, hint: `${cf.pendingReview} ready for review`, href: routes.admin.requests },
    {
      label: "Discovery / blueprint",
      count: cf.discoveryBlueprint,
      hint: "Operator-guided blueprint work",
      href: routes.admin.blueprints,
    },
    {
      label: "Proposal",
      count: cf.proposalReady + cf.proposalSentWaitingClient,
      hint: `${cf.proposalSentWaitingClient} waiting for client`,
      href: routes.admin.requests,
    },
    {
      label: "Client approval",
      count: cf.clientApprovedScope,
      hint: "Approved for ProCrow review",
      href: routes.admin.requests,
    },
    {
      label: "Onboarding",
      count: cf.onboardingInProgress,
      hint: "ProCrow-controlled progression",
      href: routes.admin.requests,
    },
    {
      label: "Tenant runtime",
      count: s.tenantRuntime.tenantCount,
      hint: `${cf.tenantPending} in go-live readiness · ${s.tenantRuntime.tenantsNeedingHealthReview} health review`,
      href: routes.admin.tenants,
    },
    {
      label: "Trust / SAREA",
      count: s.trustPosture.openIncidents + (s.experiencePosture.mappingNeedsReview ? 1 : 0),
      hint: "Advisory signals — human interpretation only; no machine triage",
      href: routes.sarea.overview,
    },
  ];

  return (
    <div className="space-y-8">
      <section className="cc-glass-card border border-cyan-500/15 !p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-cyan-300">
              ProCrow control tower
            </h2>
            <p className="mt-1 max-w-3xl text-sm text-slate-400">
              Operator-guided priorities from existing platform signals — staging / portfolio mode. Production remains
              F23-gated; no paid infra activation; no hands-off automation.
            </p>
          </div>
          <div className="text-right text-xs text-slate-500">
            <p>
              Mode:{" "}
              <span className="font-mono text-cyan-300/90">
                {s.mode === "staging_portfolio" ? "staging / demo" : "limited data"}
              </span>
            </p>
            <p className="mt-0.5 font-mono text-slate-500">Snapshot {formatGeneratedAt(s.generatedAt)}</p>
            {!s.dataLive && <p className="mt-1 text-amber-200/80">Signals unavailable — showing safe empty posture.</p>}
          </div>
        </div>

        {s.nextActions.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Suggested next</span>
            {s.nextActions.map((a) => (
              <span
                key={a}
                className="rounded-full border border-cyan-500/20 bg-cyan-500/5 px-3 py-1 text-xs text-cyan-100/90"
              >
                {a}
              </span>
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="flex flex-wrap items-end justify-between gap-2">
          <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-slate-400">
            Customer → tenant flow
          </h2>
          <span className="text-xs text-slate-500">{cf.blockedItems} pipeline item(s) outside happy path · advisory</span>
        </div>
        <div className="mt-3 overflow-x-auto pb-1">
          <div className="flex min-w-[720px] gap-1">
            {flow.map((step, i) => (
              <div key={step.label} className="flex min-w-0 flex-1 items-stretch">
                <Link
                  href={step.href}
                  className="cc-glass-card flex flex-1 flex-col !p-3 transition hover:border-cyan-500/30"
                >
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{step.label}</p>
                  <p className="mt-1 font-mono text-xl font-semibold text-white">{step.count}</p>
                  <p className="mt-1 text-[11px] leading-snug text-slate-500">{step.hint}</p>
                </Link>
                {i < flow.length - 1 && (
                  <div className="flex w-4 shrink-0 items-center justify-center text-slate-600" aria-hidden>
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <ProCrowOperatorQueuePanel
        snapshot={s.operatorQueueSnapshot}
        compact
        fullQueueHref={routes.admin.queue}
        title="Operator queue"
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="cc-glass-card !p-5">
          <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-teal-300">Client portal</h2>
          <p className="mt-1 text-xs text-slate-500">
            Aggregated signals — does not replace per-request ownership checks. Internal admin only.
          </p>
          <dl className="mt-4 grid gap-2 text-sm">
            <div className="flex justify-between gap-2 border-b border-white/5 py-1">
              <dt className="text-slate-500">Requests with submitter</dt>
              <dd className="font-mono text-white">{s.clientPortal.requestsWithSubmitter}</dd>
            </div>
            <div className="flex justify-between gap-2 border-b border-white/5 py-1">
              <dt className="text-slate-500">Client org linkage</dt>
              <dd className="font-mono text-white">{s.clientPortal.clientOrganizationLinks}</dd>
            </div>
            <div className="flex justify-between gap-2 border-b border-white/5 py-1">
              <dt className="text-slate-500">Approved scope (blueprints)</dt>
              <dd className="font-mono text-white">{s.clientPortal.approvedScopeBlueprints}</dd>
            </div>
            <div className="flex justify-between gap-2 border-b border-white/5 py-1">
              <dt className="text-slate-500">Open review notes</dt>
              <dd className="font-mono text-white">{s.clientPortal.openReviewNotesCount}</dd>
            </div>
            <div className="flex justify-between gap-2 border-b border-white/5 py-1">
              <dt className="text-slate-500">Request-changes (open)</dt>
              <dd className="font-mono text-white">{s.clientPortal.openRequestChangesCount}</dd>
            </div>
            <div className="flex justify-between gap-2 py-1">
              <dt className="text-slate-500">Onboarding attention</dt>
              <dd className="font-mono text-white">{s.clientPortal.onboardingAttentionRequests}</dd>
            </div>
          </dl>
          <p className="mt-3 text-xs text-slate-500">{s.clientPortal.advisoryNote}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${readinessChip(s.clientPortal.profileLinkageReadiness)}`}>
              Profile linkage: {s.clientPortal.profileLinkageReadiness.replace("_", " ")}
            </span>
            <Link href={routes.admin.requests} className="text-xs text-cyan-400 hover:text-cyan-300">
              Open requests →
            </Link>
          </div>
        </section>

        <section className="cc-glass-card !p-5">
          <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-cyan-300">Tenant runtime</h2>
          <p className="mt-1 text-xs text-slate-500">CEM runtime and module posture — advisory; open a tenant for depth.</p>
          <dl className="mt-4 grid gap-2 text-sm">
            <div className="flex justify-between gap-2 border-b border-white/5 py-1">
              <dt className="text-slate-500">Tenants</dt>
              <dd className="font-mono text-white">{s.tenantRuntime.tenantCount}</dd>
            </div>
            <div className="flex justify-between gap-2 border-b border-white/5 py-1">
              <dt className="text-slate-500">Health / posture review</dt>
              <dd className="font-mono text-white">{s.tenantRuntime.tenantsNeedingHealthReview}</dd>
            </div>
            <div className="flex justify-between gap-2 border-b border-white/5 py-1">
              <dt className="text-slate-500">Tenants with modules enabled</dt>
              <dd className="font-mono text-white">{s.tenantRuntime.tenantsWithModules}</dd>
            </div>
            <div className="flex justify-between gap-2 border-b border-white/5 py-1">
              <dt className="text-slate-500">Avg enabled modules</dt>
              <dd className="font-mono text-white">{s.tenantRuntime.avgEnabledModules}</dd>
            </div>
            <div className="flex justify-between gap-2 py-1">
              <dt className="text-slate-500">Provisioning in flight (platform)</dt>
              <dd className="font-mono text-white">{s.tenantRuntime.provisioningInFlight}</dd>
            </div>
          </dl>
          <p className="mt-3 text-xs text-slate-500">{s.tenantRuntime.runtimeCohesionNote}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${readinessChip(s.tenantRuntime.cohesionReadiness)}`}>
              Cohesion: {s.tenantRuntime.cohesionReadiness.replace("_", " ")}
            </span>
            <Link href={routes.admin.tenants} className="text-xs text-cyan-400 hover:text-cyan-300">
              All tenants →
            </Link>
          </div>
        </section>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="cc-glass-card cc-entity-block--cybercrow !p-5">
          <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-violet-300">CyberCrow trust</h2>
          <p className="mt-1 text-xs text-slate-500">{s.trustPosture.advisoryNote}</p>
          <dl className="mt-4 grid gap-2 text-sm">
            <div className="flex justify-between gap-2 border-b border-white/5 py-1">
              <dt className="text-slate-500">Initialized / evidence-ready tenants</dt>
              <dd className="font-mono text-white">{s.trustPosture.evidenceReadyCount}</dd>
            </div>
            <div className="flex justify-between gap-2 border-b border-white/5 py-1">
              <dt className="text-slate-500">Open incidents (review)</dt>
              <dd className="font-mono text-white">{s.trustPosture.openIncidents}</dd>
            </div>
            <div className="flex justify-between gap-2 py-1">
              <dt className="text-slate-500">Security events (signal)</dt>
              <dd className="font-mono text-white">{s.trustPosture.securityEvents}</dd>
            </div>
          </dl>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${readinessChip(s.trustPosture.auditSignalStatus)}`}>
              Audit trail signal: {s.trustPosture.auditSignalStatus.replace("_", " ")}
            </span>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${readinessChip(s.trustPosture.grcStatus)}`}>
              GRC posture: {s.trustPosture.grcStatus.replace("_", " ")}
            </span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <Link href={routes.tenant(cyberSlug).cybercrow.dashboard} className="text-violet-300 hover:text-violet-200">
              Trust cockpit →
            </Link>
            <Link href={routes.tenant(cyberSlug).cybercrow.evidence} className="text-violet-300 hover:text-violet-200">
              Evidence →
            </Link>
            <Link href={routes.tenant(cyberSlug).cybercrow.grc} className="text-violet-300 hover:text-violet-200">
              GRC →
            </Link>
            <Link href={routes.tenant(cyberSlug).cybercrow.risk} className="text-violet-300 hover:text-violet-200">
              Risk →
            </Link>
            <Link href={routes.tenant(cyberSlug).cybercrow.securityEvents} className="text-violet-300 hover:text-violet-200">
              Security events →
            </Link>
            <Link href={routes.tenant(cyberSlug).cybercrow.auditLogs} className="text-violet-300 hover:text-violet-200">
              Audit logs →
            </Link>
            <Link href={routes.tenant(cyberSlug).cybercrow.incidents} className="text-violet-300 hover:text-violet-200">
              Incidents →
            </Link>
          </div>
        </section>

        <section className="cc-glass-card cc-entity-block--sarea !p-5">
          <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-rose-300">SAREA experience</h2>
          <p className="mt-1 text-xs text-slate-500">{s.experiencePosture.advisoryNote}</p>
          <dl className="mt-4 grid gap-2 text-sm">
            <div className="flex justify-between gap-2 border-b border-white/5 py-1">
              <dt className="text-slate-500">Profiles</dt>
              <dd className="font-mono text-white">{s.experiencePosture.sareaProfilesReady}</dd>
            </div>
            <div className="flex justify-between gap-2 border-b border-white/5 py-1">
              <dt className="text-slate-500">Tenant-backed / fallback</dt>
              <dd className="font-mono text-white">
                {s.experiencePosture.tenantBackedProfiles} / {s.experiencePosture.fallbackProfiles}
              </dd>
            </div>
            <div className="flex justify-between gap-2 border-b border-white/5 py-1">
              <dt className="text-slate-500">Navigation profiles</dt>
              <dd className="font-mono text-white">{s.experiencePosture.navigationProfiles}</dd>
            </div>
            <div className="flex justify-between gap-2 py-1">
              <dt className="text-slate-500">Widget rules</dt>
              <dd className="font-mono text-white">{s.experiencePosture.widgetRules}</dd>
            </div>
          </dl>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${readinessChip(s.experiencePosture.previewReadiness)}`}>
              Preview readiness: {s.experiencePosture.previewReadiness.replace("_", " ")}
            </span>
            {s.experiencePosture.mappingNeedsReview && (
              <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-100">
                Mapping needs review
              </span>
            )}
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <Link href={routes.sarea.overview} className="text-rose-300 hover:text-rose-200">
              Overview →
            </Link>
            <Link href={routes.sarea.profiles} className="text-rose-300 hover:text-rose-200">
              Profiles →
            </Link>
            <Link href={routes.sarea.roleMapping} className="text-rose-300 hover:text-rose-200">
              Role mapping →
            </Link>
            <Link href={routes.sarea.preview} className="text-rose-300 hover:text-rose-200">
              Preview →
            </Link>
            <Link href={routes.sarea.navigation} className="text-rose-300 hover:text-rose-200">
              Navigation →
            </Link>
            <Link href={routes.sarea.widgets} className="text-rose-300 hover:text-rose-200">
              Widgets →
            </Link>
          </div>
        </section>
      </div>

      <section className="cc-glass-card border border-amber-500/20 !p-5">
        <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-amber-200">
          Deployment / go–no-go
        </h2>
        <p className="mt-2 text-sm text-slate-400">{s.deploymentReadiness.nextOperatorAction}</p>
        <ul className="mt-4 grid gap-2 text-sm text-slate-300 sm:grid-cols-2">
          <li className="flex items-center gap-2">
            <span className="text-emerald-400">✓</span> Production gated (F23) — {s.deploymentReadiness.f23GateStatus}
          </li>
          <li className="flex items-center gap-2">
            <span className="text-emerald-400">✓</span> No paid infra activation ({String(s.deploymentReadiness.noPaidInfra)})
          </li>
          <li className="flex items-center gap-2">
            <span className="text-emerald-400">✓</span> No auto tenant provisioning ({String(s.deploymentReadiness.noAutoProvisioning)})
          </li>
          <li className="flex items-center gap-2">
            <span
              className={
                s.deploymentReadiness.validationBaseline === "healthy" ? "text-emerald-400" : "text-amber-400"
              }
            >
              ◆
            </span>
            Validation baseline: {s.deploymentReadiness.validationBaseline.replace("_", " ")}
          </li>
          <li className="sm:col-span-2">
            Go / no-go state:{" "}
            <span className="font-mono text-white">{s.deploymentReadiness.goNoGoState.replace("_", " ")}</span>
            {s.deploymentReadiness.blockedReason && (
              <span className="mt-1 block text-slate-500">{s.deploymentReadiness.blockedReason}</span>
            )}
          </li>
        </ul>
      </section>

      <section className="cc-glass-card !p-4">
        <h2 className="font-display text-xs font-semibold uppercase tracking-wider text-slate-500">Notifications</h2>
        <p className="mt-1 text-sm text-slate-400">
          High-priority open: <span className="font-mono text-white">{s.notifications.highPriorityOpen}</span> ·
          Pipeline-related (7d): <span className="font-mono text-white">{s.notifications.pipelineOpenRecent}</span>
        </p>
        <p className="mt-2 text-xs text-slate-500">{s.notifications.advisoryNote}</p>
        <Link href={routes.admin.notifications} className="mt-2 inline-block text-sm text-cyan-400 hover:text-cyan-300">
          Open inbox →
        </Link>
      </section>
    </div>
  );
}
