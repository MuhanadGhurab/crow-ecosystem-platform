import Link from "next/link";
import { notFound } from "next/navigation";
import { UserMenu } from "@/components/portal/auth/user-menu";
import { AreaShell } from "@/components/ui/area-shell";
import { Permission } from "@/lib/auth/permissions";
import { requirePermission } from "@/lib/auth/session";
import { RequestStatusBadge } from "@/components/admin/request-status-badge";
import { DiscoveryMockBanner } from "@/components/discovery/discovery-mock-banner";
import { DiscoveryReadonlyBanner } from "@/components/discovery/discovery-readonly-banner";
import { OnboardingPipelineContext } from "@/components/admin/onboarding-pipeline-context";
import { DiscoveryProgressNav } from "@/components/discovery/discovery-progress-nav";
import { DiscoveryIntelligenceRail } from "@/components/discovery/discovery-intelligence-rail";
import { routes } from "@/lib/routes";
import { getDiscoveryContext } from "@/lib/services/discovery.service";
import type { ImplementationRequestStatus } from "@/lib/types/platform";

export default async function DiscoveryLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ requestId: string }>;
}) {
  const { requestId } = await params;
  await requirePermission(Permission["platform.discovery.view"]);
  const request = await getDiscoveryContext(requestId);

  if (!request?.discoveryProfile) {
    notFound();
  }

  const d = routes.discovery(requestId);
  const nav = [
    { href: d.organization, label: "1. Organization" },
    { href: d.organizationModel, label: "Org intelligence" },
    { href: d.modules, label: "2. Modules" },
    { href: d.security, label: "3. Security" },
    { href: d.departments, label: "4. Structure" },
    { href: d.roles, label: "5. Roles" },
    { href: d.workflows, label: "6. Workflows" },
    { href: d.identity, label: "Identity" },
    { href: d.integrations, label: "Integrations" },
    { href: d.experience, label: "Experience" },
    { href: d.summary, label: "Summary" },
  ];

  const profile = request.discoveryProfile!;

  return (
    <AreaShell
      title={request.organizationName}
      subtitle={`${request.referenceCode} · Discovery understands your enterprise`}
      badge="Discovery"
      nav={nav}
      headerActions={<UserMenu />}
    >
      <div className="cc-glass-card mb-6 flex flex-wrap items-center justify-between gap-3 !p-4">
        <div className="flex flex-wrap items-center gap-3">
          <RequestStatusBadge status={request.status as ImplementationRequestStatus} />
          <span className="hidden text-xs text-slate-500 sm:inline">
            Discovery → Blueprint pricing
          </span>
        </div>
        <Link href={routes.admin.request(requestId)} className="text-sm text-cyan-400 hover:text-cyan-300">
          ← Admin request
        </Link>
      </div>

      <OnboardingPipelineContext
        requestId={requestId}
        status={request.status as ImplementationRequestStatus}
        blueprintId={request.enterpriseBlueprint?.id ?? null}
        tenantSlug={request.enterpriseBlueprint?.tenant?.slug ?? null}
        discoveryAvailable
        current="discovery"
        compact
        className="mb-4"
      />

      <DiscoveryMockBanner requestId={requestId} />
      <DiscoveryReadonlyBanner status={request.status as ImplementationRequestStatus} />

      <DiscoveryProgressNav
        requestId={requestId}
        profile={{
          answers: profile.answers,
          departments: profile.departments,
          branches: profile.branches,
          roles: profile.roles,
          workflows: profile.workflows,
          securityRequirements: profile.securityRequirements,
        }}
      />

      <DiscoveryIntelligenceRail requestId={requestId} />

      {children}
    </AreaShell>
  );
}
