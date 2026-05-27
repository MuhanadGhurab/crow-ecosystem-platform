import Link from "next/link";
import { AdminLighthousePipelineCard } from "@/components/admin/lighthouse-pipeline-card";
import { CemTenantGridCard } from "@/components/admin/cem-tenant-grid-card";
import { PlatformCybercrowPostureStrip } from "@/components/admin/platform-cybercrow-posture";
import { ProCrowControlTowerHeader } from "@/components/procrow/procrow-page-header";
import { ProCrowControlTowerMap } from "@/components/procrow/procrow-control-tower-map";
import { ProCrowControlTowerDashboard } from "@/components/procrow/procrow-control-tower-dashboard";
import { ProCrowGoNoGoOverviewLink } from "@/components/procrow/procrow-go-no-go-overview-link";
import { ProCrowDemoRehearsalHint } from "@/components/procrow/procrow-demo-rehearsal-hint";
import { ProCrowOperatorConsoleOverviewLink } from "@/components/procrow/procrow-operator-console-overview-link";
import { ProCrowSafetyNote } from "@/components/procrow/procrow-safety-note";
import { StatCard } from "@/components/ui/stat-card";
import { DeptChips } from "@/components/pipeline/dept-chips";
import { PLATFORM_ENGINE_HUB } from "@/lib/constants/platform-engine-hub";
import { FULL_PLATFORM_LIFECYCLE } from "@/lib/constants/platform";
import { routes } from "@/lib/routes";
import { OperatorConsoleSection } from "@/components/admin/operator-console-section";
import { getCemCommandCenterSnapshot } from "@/lib/services/cem-command-center.service";
import { getOperatorConsoleSnapshot } from "@/lib/services/operator-console.service";
import { getLighthousePipelineSnapshot } from "@/lib/services/lighthouse-pipeline.service";
import { SubscriptionIntelligenceSection } from "@/components/admin/subscription-intelligence-section";
import { getOrgIntelligencePlatformSummary } from "@/lib/services/org-intelligence.service";
import { getSubscriptionPlatformSummary } from "@/lib/services/subscription-capability.service";
import { emitSubscriptionAdvisoriesFromPlatformSummary } from "@/lib/services/subscription-notification.service";
import { getPlatformNotificationInboxSummary } from "@/lib/services/platform-notification.service";
import { getProCrowControlTowerSnapshot } from "@/lib/services/procrow-control-tower.service";
import { NotificationSummarySection } from "@/components/admin/notification-summary-section";

function pipelineCountLabel(live: boolean, value: number, fallback: string) {
  if (!live) return fallback;
  return value === 1 ? "1" : String(value);
}

const PIPELINE_LINKS = [
  { href: routes.admin.requests, label: "Requests", key: "requestCount" as const, entity: "cem" as const },
  { href: routes.admin.discovery, label: "Discovery", key: "discoveryCount" as const, entity: "cem" as const },
  { href: routes.admin.blueprints, label: "Blueprints", key: "blueprintCount" as const, entity: "cybercrow" as const },
  { href: routes.admin.tenants, label: "Live tenants", key: "liveTenantCount" as const, entity: "sarea" as const },
] as const;

export default async function AdminOverviewPage() {
  const [command, operatorConsole, controlTower, lighthouse, orgIntel, subscriptionIntel, notificationSummary] =
    await Promise.all([
      getCemCommandCenterSnapshot(),
      getOperatorConsoleSnapshot(),
      getProCrowControlTowerSnapshot(),
      getLighthousePipelineSnapshot().catch(() => null),
      getOrgIntelligencePlatformSummary().catch(() => ({
        templateCount: 5,
        acceptedCount: 0,
        recommendedCount: 0,
        profileCoverage: 0,
        live: false,
      })),
      getSubscriptionPlatformSummary().catch(() => null),
      getPlatformNotificationInboxSummary().catch(() => ({
        recentAdvisoryCount: 0,
        highPriorityCount: 0,
        tenantsNeedingReview: 0,
        latest: [],
        lastUpdatedAt: new Date(),
      })),
    ]);

  if (subscriptionIntel) {
    await emitSubscriptionAdvisoriesFromPlatformSummary(subscriptionIntel).catch(() => undefined);
  }

  const { pipeline, cybercrow, sarea, tenants, platformHealth } = command;

  return (
    <div className="space-y-10">
      <ProCrowControlTowerHeader />

      <ProCrowSafetyNote className="-mt-4" />

      <ProCrowGoNoGoOverviewLink />

      <ProCrowOperatorConsoleOverviewLink />

      <ProCrowDemoRehearsalHint />

      <ProCrowControlTowerMap />

      <ProCrowControlTowerDashboard snapshot={controlTower} />

      <section>
        <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-slate-400">
          Platform health
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
          <StatCard label="Live tenants" value={pipeline.liveTenantCount} accent="cyan" />
          <StatCard label="In pipeline" value={platformHealth.tenantsProvisioning} accent="star" />
          <StatCard label="CEM users" value={platformHealth.activeUsers} accent="teal" />
          <StatCard label="Auth memberships" value={platformHealth.authMemberships} accent="cyan" />
          <StatCard label="Workflows active" value={platformHealth.workflowsActive} accent="teal" />
          <StatCard label="Open tasks" value={platformHealth.openTasks} accent="violet" />
        </div>
      </section>

      <OperatorConsoleSection snapshot={operatorConsole} />

      {subscriptionIntel && <SubscriptionIntelligenceSection summary={subscriptionIntel} />}

      <NotificationSummarySection summary={notificationSummary} />

      <section className="cc-glass-card !p-6">
        <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-slate-400">
          Organizational intelligence
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Sector templates advise — discovery and blueprint decide the tenant-specific organization contract.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-4">
          <StatCard label="Sector templates" value={orgIntel.templateCount} accent="star" />
          <StatCard label="Profiles with recommendations" value={orgIntel.profileCoverage} accent="cyan" />
          <StatCard label="Accepted into discovery" value={orgIntel.acceptedCount} accent="teal" />
          <StatCard label="Pending review" value={orgIntel.recommendedCount} accent="violet" />
        </div>
      </section>

      {lighthouse ? (
        <AdminLighthousePipelineCard pipeline={lighthouse} />
      ) : (
        <section className="cc-alert-warning text-sm text-amber-100">
          Lighthouse tenant not seeded — run{" "}
          <code className="rounded bg-black/30 px-1">npm run db:seed:meem</code>.
        </section>
      )}

      <section>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-slate-400">
              Tenant lifecycle pipeline
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Blueprint-driven path from request through go-live.
            </p>
          </div>
          <Link href={routes.admin.requests} className="text-sm text-cyan-400 hover:text-cyan-300">
            Intake queue →
          </Link>
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {FULL_PLATFORM_LIFECYCLE.map((step, i) => (
            <div
              key={step}
              className="rounded-cc-sm border border-cyan-500/10 bg-white/[0.02] px-3 py-2 text-sm text-slate-400"
            >
              <span className="font-mono text-xs font-bold text-cc-star">
                {String(i + 1).padStart(2, "0")}
              </span>{" "}
              {step}
            </div>
          ))}
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {PIPELINE_LINKS.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className={`cc-pipeline-card border-l-2 ${
                card.entity === "cem"
                  ? "border-l-cyan-500/60"
                  : card.entity === "cybercrow"
                    ? "border-l-violet-500/60"
                    : "border-l-rose-500/60"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium text-white">{card.label}</p>
                <span className="font-mono text-xs text-slate-500">
                  {pipelineCountLabel(pipeline.live, pipeline[card.key], "—")}
                </span>
              </div>
              <span className="mt-2 inline-block text-sm text-cyan-400">Open →</span>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-slate-400">
              Tenant grid
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Each tenant — CEM runtime, CyberCrow posture, SAREA coverage.
            </p>
          </div>
          <Link href={routes.admin.tenants} className="text-sm text-cyan-400 hover:text-cyan-300">
            All tenants →
          </Link>
        </div>
        {tenants.length === 0 ? (
          <p className="cc-glass-card mt-4 text-sm text-slate-500">
            No live tenants yet. Complete blueprint go-live to provision one.
          </p>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {tenants.map((t) => (
              <CemTenantGridCard key={t.id} tenant={t} />
            ))}
          </div>
        )}
      </section>

      <PlatformCybercrowPostureStrip posture={cybercrow} />

      <section className="cc-glass-card cc-entity-block--sarea space-y-4 !p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-rose-300">
              SAREA role experience layer
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              RBAC controls access — SAREA adapts dashboard, navigation, and widgets per persona.
            </p>
          </div>
          <Link href={PLATFORM_ENGINE_HUB.sarea} className="text-sm text-rose-300 hover:text-rose-200">
            Experience studio →
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Experience profiles" value={sarea.profileCount} accent="rose" />
          <StatCard label="Tenants with SAREA" value={sarea.tenantsWithProfiles} accent="cyan" />
          <StatCard label="Dashboard layouts" value={sarea.layoutCount} accent="teal" />
          <StatCard
            label="Adaptive rules"
            value={sarea.adaptiveRuleCount + sarea.widgetRuleCount}
            hint="widgets + UI rules"
            accent="star"
          />
        </div>
      </section>

      <section>
        <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-slate-400">
          CEM runtime layer
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Departments" value={platformHealth.departments} accent="cyan" />
          <StatCard label="Branches" value={platformHealth.branches} accent="teal" />
          <StatCard label="Security events" value={cybercrow.securityEventCount} accent="violet" />
          <StatCard label="Open incidents" value={cybercrow.openIncidentCount} accent="rose" />
        </div>
      </section>

      <section>
        <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-slate-400">
          Enter as platform admin
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {[
            { href: PLATFORM_ENGINE_HUB.cem(), label: "CEM", desc: "Tenant runtime", entity: "cem" },
            { href: PLATFORM_ENGINE_HUB.cybercrow(), label: "CyberCrow", desc: "Security console", entity: "cybercrow" },
            { href: PLATFORM_ENGINE_HUB.sarea, label: "SAREA", desc: "Experience studio", entity: "sarea" },
          ].map((engine) => (
            <Link
              key={engine.label}
              href={engine.href}
              className={`cc-glass-card !p-5 transition ${
                engine.entity === "cem"
                  ? "cc-entity-block--cem hover:border-cyan-500/40"
                  : engine.entity === "cybercrow"
                    ? "cc-entity-block--cybercrow hover:border-violet-500/40"
                    : "cc-entity-block--sarea hover:border-rose-500/40"
              }`}
            >
              <p className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                {engine.label}
              </p>
              <p className="mt-2 text-sm text-slate-400">{engine.desc}</p>
              <DeptChips hasSecurity hasModules showSarea className="mt-3" />
              <span className="mt-3 inline-block text-sm text-cyan-400">Open →</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
