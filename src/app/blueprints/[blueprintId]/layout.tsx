import Link from "next/link";
import { notFound } from "next/navigation";
import { UserMenu } from "@/components/portal/auth/user-menu";
import { AreaShell } from "@/components/ui/area-shell";
import { Permission, hasPermission } from "@/lib/auth/permissions";
import { getCrowAuth } from "@/lib/auth/roles";
import { getSessionUser, requirePermission } from "@/lib/auth/session";
import { OnboardingPipelineContext } from "@/components/admin/onboarding-pipeline-context";
import { RequestStatusBadge } from "@/components/admin/request-status-badge";
import { routes } from "@/lib/routes";
import { getEnterpriseBlueprint } from "@/lib/services/blueprint.service";
import type { ImplementationRequestStatus } from "@/lib/types/platform";

export default async function BlueprintLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ blueprintId: string }>;
}) {
  const { blueprintId } = await params;
  await requirePermission(Permission["platform.blueprint.view"]);
  const user = await getSessionUser();
  const { role } = getCrowAuth(user);
  const blueprint = await getEnterpriseBlueprint(blueprintId);

  if (!blueprint) {
    notFound();
  }

  const b = routes.blueprint(blueprintId);
  const navItems = [
    { href: b.overview, label: "Overview" },
    { href: b.pricing, label: "Pricing" },
    { href: b.cem, label: "CEM" },
    { href: b.cybercrow, label: "CyberCrow" },
    { href: b.sarea, label: "SAREA", permission: Permission["platform.sarea.studio"] },
    { href: b.identity, label: "Identity" },
    { href: b.integrations, label: "Integrations" },
    { href: b.readiness, label: "Readiness" },
    { href: b.goLive, label: "Go live", permission: Permission["platform.blueprint.provision"] },
  ] as const;
  const nav = navItems
    .filter((item) => !("permission" in item) || hasPermission(role, item.permission))
    .map(({ href, label }) => ({ href, label }));

  return (
    <AreaShell
      title={blueprint.request.organizationName}
      subtitle={`Blueprint v${blueprint.version} · ${blueprint.status}`}
      badge="Enterprise Blueprint"
      nav={nav}
      headerActions={<UserMenu />}
    >
      <div className="mb-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <RequestStatusBadge status={blueprint.request.status as ImplementationRequestStatus} />
          <Link
            href={routes.admin.request(blueprint.requestId)}
            className="text-sm text-cyan-400 hover:text-cyan-300"
          >
            ← Admin request
          </Link>
        </div>
        <OnboardingPipelineContext
          requestId={blueprint.requestId}
          status={blueprint.request.status as ImplementationRequestStatus}
          blueprintId={blueprintId}
          tenantSlug={blueprint.tenant?.slug ?? null}
          discoveryAvailable={Boolean(blueprint.request.discoveryProfile)}
          compact
        />
      </div>
      {children}
    </AreaShell>
  );
}
