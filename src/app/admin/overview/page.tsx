import Link from "next/link";
import { AdminLighthousePipelineCard } from "@/components/admin/lighthouse-pipeline-card";
import { CemTenantGridCard } from "@/components/admin/cem-tenant-grid-card";
import { PlatformCybercrowPostureStrip } from "@/components/admin/platform-cybercrow-posture";
import { ProCrowControlTowerHeader } from "@/components/procrow/procrow-page-header";
import { ProCrowControlTowerMap } from "@/components/procrow/procrow-control-tower-map";
import { ProCrowControlTowerDashboard } from "@/components/procrow/procrow-control-tower-dashboard";
import { ProCrowCommercialLifecycleCard } from "@/components/procrow/procrow-commercial-lifecycle-card";
import { ProCrowDemoRehearsalHint } from "@/components/procrow/procrow-demo-rehearsal-hint";
import { ProCrowGoNoGoOverviewLink } from "@/components/procrow/procrow-go-no-go-overview-link";
import { ProCrowOperatorConsoleOverviewLink } from "@/components/procrow/procrow-operator-console-overview-link";
import { ProCrowOverviewPriority } from "@/components/procrow/procrow-overview-priority";
import { ProCrowSafetyNote } from "@/components/procrow/procrow-safety-note";
import { ProCrowTenantRuntimeFraming } from "@/components/procrow/procrow-tenant-runtime-framing";
import { ProCrowWorkflowStrip } from "@/components/procrow/procrow-workflow-strip";
import { ProductSection } from "@/components/product/product-section";
import { StatCard } from "@/components/ui/stat-card";
import { routes } from "@/lib/routes";
import { getCemCommandCenterSnapshot } from "@/lib/services/cem-command-center.service";
import { getLighthousePipelineSnapshot } from "@/lib/services/lighthouse-pipeline.service";
import { getProCrowControlTowerSnapshot } from "@/lib/services/procrow-control-tower.service";

export default async function AdminOverviewPage() {
  const [command, controlTower, lighthouse] = await Promise.all([
    getCemCommandCenterSnapshot(),
    getProCrowControlTowerSnapshot(),
    getLighthousePipelineSnapshot().catch(() => null),
  ]);

  const { pipeline, cybercrow, sarea, tenants, platformHealth } = command;

  return (
    <div className="space-y-8">
      <ProCrowControlTowerHeader />

      <ProCrowOverviewPriority snapshot={controlTower} />

      <ProCrowWorkflowStrip />

      <ProCrowControlTowerDashboard snapshot={controlTower} />

      <ProCrowTenantRuntimeFraming />

      <ProCrowCommercialLifecycleCard />

      <div className="flex flex-wrap gap-3">
        <ProCrowGoNoGoOverviewLink />
        <ProCrowOperatorConsoleOverviewLink />
        <ProCrowDemoRehearsalHint />
      </div>

      <ProCrowSafetyNote className="!mt-0" />

      <details className="cc-glass-card group !p-0">
        <summary className="cursor-pointer list-none px-5 py-4 text-sm font-medium text-slate-300 marker:content-none [&::-webkit-details-marker]:hidden">
          <span className="text-cyan-400/90 group-open:text-cyan-300">More platform signals</span>
          <span className="ml-2 text-slate-500">— health, tenants, trust engines</span>
        </summary>
        <div className="space-y-8 border-t border-slate-700/50 px-5 pb-6 pt-4">
          <ProCrowControlTowerMap />

          <ProductSection title="Platform health" description="Snapshot counts — advisory only.">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
              <StatCard label="Live tenants" value={pipeline.liveTenantCount} accent="cyan" />
              <StatCard label="In pipeline" value={platformHealth.tenantsProvisioning} accent="star" />
              <StatCard label="CEM users" value={platformHealth.activeUsers} accent="teal" />
              <StatCard label="Open tasks" value={platformHealth.openTasks} accent="violet" />
            </div>
          </ProductSection>

          {lighthouse ? (
            <AdminLighthousePipelineCard pipeline={lighthouse} />
          ) : (
            <p className="cc-alert-warning text-sm text-amber-100">
              Lighthouse tenant not seeded — run <code className="rounded bg-black/30 px-1">npm run db:seed:meem</code>.
            </p>
          )}

          <ProductSection
            title="Tenant grid"
            description="CEM runtime, CyberCrow posture, SAREA coverage."
            action={
              <Link href={routes.admin.tenants} className="text-sm text-cyan-400 hover:text-cyan-300">
                All tenants →
              </Link>
            }
          >
            {tenants.length === 0 ? (
              <p className="text-sm text-slate-500">No live tenants yet. Complete blueprint go-live to provision one.</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {tenants.map((t) => (
                  <CemTenantGridCard key={t.id} tenant={t} />
                ))}
              </div>
            )}
          </ProductSection>

          <PlatformCybercrowPostureStrip posture={cybercrow} />

          <ProductSection title="SAREA experience layer">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard label="Experience profiles" value={sarea.profileCount} accent="rose" />
              <StatCard label="Tenants with SAREA" value={sarea.tenantsWithProfiles} accent="cyan" />
              <StatCard label="Dashboard layouts" value={sarea.layoutCount} accent="teal" />
            </div>
          </ProductSection>
        </div>
      </details>
    </div>
  );
}
