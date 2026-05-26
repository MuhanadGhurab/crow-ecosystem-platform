import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { FinanceLinkageBanner } from "@/components/tenant/finance/finance-linkage-banner";
import { TenantPlanSelfServicePanel } from "@/components/tenant/tenant-plan-self-service-panel";
import { PageHeader } from "@/components/ui/page-header";
import { getCrowAuth, isPlatformStaff } from "@/lib/auth/roles";
import { hasPermission } from "@/lib/auth/permissions";
import { requireTenantAccess } from "@/lib/auth/session";
import { routes } from "@/lib/routes";
import { getTenantCapabilitySnapshot } from "@/lib/services/subscription-capability.service";
import { getTenantUsageSignals } from "@/lib/services/usage-signals.service";
import { getTenantBySlug } from "@/lib/services/tenant.service";

export default async function TenantSettingsPlanPage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: slug } = await params;
  const user = await requireTenantAccess(slug);
  const tenant = await getTenantBySlug(slug);
  if (!tenant) notFound();

  const { role } = getCrowAuth(user);
  const canViewPlan =
    isPlatformStaff(role) ||
    role === "tenant_admin" ||
    hasPermission(role, "cem.roles.manage");

  if (!canViewPlan) {
    redirect(`/unauthorized?reason=permission&return=/${slug}/settings/plan`);
  }

  const [snapshot, usageSignals] = await Promise.all([
    getTenantCapabilitySnapshot(tenant.id),
    getTenantUsageSignals(tenant.id),
  ]);

  if (!snapshot) {
    return (
      <div className="space-y-6">
        <PageHeader
          badge="CEM · Plan"
          entity="cem"
          title="Subscription plan"
          description="Could not load plan details for this workspace."
        />
        <Link href={routes.tenant(slug).settings} className="text-sm text-cyan-400 hover:text-cyan-300">
          ← Settings
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        badge="CEM · Plan"
        entity="cem"
        title="Subscription plan"
        description={`Read-only plan view for ${tenant.organization.displayName} — advisory reference only.`}
      />
      <FinanceLinkageBanner
        slug={slug}
        variant="plan"
        warnings={
          snapshot.planKeyMismatch
            ? ["Plan key mismatch between tenant and subscription — review alignment (advisory)."]
            : []
        }
      />
      <TenantPlanSelfServicePanel slug={slug} snapshot={snapshot} usageSignals={usageSignals} />
      <p className="text-xs text-slate-500">
        Need a plan change? Contact your Crow platform administrator — self-service checkout is not
        enabled in this phase.
      </p>
    </div>
  );
}
