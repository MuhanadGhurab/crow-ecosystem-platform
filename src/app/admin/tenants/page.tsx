import Link from "next/link";
import { RequestStatusBadge } from "@/components/admin/request-status-badge";
import { TenantPosturePills } from "@/components/admin/tenant-posture-pills";
import { AdminListPage } from "@/components/ui/admin-list-page";
import { ListCard } from "@/components/ui/list-card";
import { planLabel } from "@/lib/catalog-labels";
import { routes } from "@/lib/routes";
import { TenantSubscriptionInline } from "@/components/admin/tenant-subscription-inline";
import {
  listTenantsWithHealth,
  type TenantWithHealth,
} from "@/lib/services/tenant-health.service";
import { getTenantCapabilitySnapshot } from "@/lib/services/subscription-capability.service";
import type { ImplementationRequestStatus } from "@/lib/types/platform";

export default async function AdminTenantsPage() {
  const tenants: TenantWithHealth[] = await listTenantsWithHealth();
  const snapshots = await Promise.all(
    tenants.map((t) => getTenantCapabilitySnapshot(t.id).catch(() => null))
  );

  return (
    <AdminListPage
      title="CEM Command Center"
      description="Multi-tenant enterprise operating system — manage tenants, lifecycles, CyberCrow trust, and SAREA role experiences."
      isEmpty={tenants.length === 0}
      emptyTitle="No tenants yet"
      emptyDescription="Complete a blueprint and approve go-live to provision one."
    >
      {tenants.map((t, i) => (
        <ListCard key={t.id}>
          <div>
            <p className="font-medium text-white">{t.organization.displayName}</p>
            <p className="font-mono text-xs text-cyan-400">/{t.slug}</p>
            <p className="mt-1 text-xs text-slate-500">
              {planLabel(t.planKey)} · {t.posture.enabledModuleCount} modules ·{" "}
              {t.health.membershipCount} members · {t._count.profiles} CEM users
            </p>
            {snapshots[i] && <TenantSubscriptionInline snapshot={snapshots[i]!} />}
            <TenantPosturePills
              posture={t.posture}
              health={t.health}
              requestStatus={t.blueprint?.request?.status as ImplementationRequestStatus}
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {t.blueprint?.request?.status && (
              <RequestStatusBadge
                status={t.blueprint.request.status as ImplementationRequestStatus}
              />
            )}
            <Link
              href={routes.tenant(t.slug).dashboard}
              className="cc-btn-secondary !px-3 !py-1.5 text-sm"
            >
              Workspace
            </Link>
            <Link
              href={routes.admin.tenant(t.id)}
              className="cc-btn-secondary !px-3 !py-1.5 text-sm"
            >
              Control room
            </Link>
          </div>
        </ListCard>
      ))}
    </AdminListPage>
  );
}
