import Link from "next/link";
import { RequestStatusBadge } from "@/components/admin/request-status-badge";
import { TenantPosturePills } from "@/components/admin/tenant-posture-pills";
import { planLabel } from "@/lib/catalog-labels";
import { routes } from "@/lib/routes";
import type { TenantWithHealth } from "@/lib/services/tenant-health.service";
import type { ImplementationRequestStatus } from "@/lib/types/platform";

export function CemTenantGridCard({ tenant }: { tenant: TenantWithHealth }) {
  const requestStatus = tenant.blueprint?.request?.status as
    | ImplementationRequestStatus
    | undefined;

  return (
    <article className="cc-glass-card cc-entity-block--cem flex h-full flex-col !p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-medium text-white">{tenant.organization.displayName}</p>
          <p className="font-mono text-xs text-cyan-400">/{tenant.slug}</p>
          {tenant.organization.industry && (
            <p className="mt-1 text-xs text-slate-500">{tenant.organization.industry}</p>
          )}
        </div>
        {requestStatus && <RequestStatusBadge status={requestStatus} />}
      </div>

      <p className="mt-3 text-xs text-slate-500">
        {planLabel(tenant.planKey)} · {tenant.health.membershipCount} members ·{" "}
        {tenant._count.profiles} CEM users
      </p>

      <TenantPosturePills
        posture={tenant.posture}
        health={tenant.health}
        requestStatus={requestStatus}
      />

      <div className="mt-auto flex flex-wrap gap-2 pt-4">
        <Link
          href={routes.admin.tenant(tenant.id)}
          className="cc-btn-secondary !px-3 !py-1.5 text-xs"
        >
          Control room
        </Link>
        <Link
          href={routes.tenant(tenant.slug).dashboard}
          className="text-xs text-cyan-400 hover:text-cyan-300"
        >
          Open runtime →
        </Link>
      </div>
    </article>
  );
}
