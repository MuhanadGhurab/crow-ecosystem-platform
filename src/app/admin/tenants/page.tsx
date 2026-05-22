import Link from "next/link";
import { RequestStatusBadge } from "@/components/admin/request-status-badge";
import { AdminListPage } from "@/components/ui/admin-list-page";
import { ListCard } from "@/components/ui/list-card";
import { planLabel } from "@/lib/catalog-labels";
import { routes } from "@/lib/routes";
import {
  listTenantsWithHealth,
  type TenantHealthSummary,
  type TenantWithHealth,
} from "@/lib/services/tenant-health.service";
import type { ImplementationRequestStatus } from "@/lib/types/platform";

function healthScoreClass(score: TenantHealthSummary["healthScore"]): string {
  switch (score) {
    case "good":
      return "text-teal-300";
    case "watch":
      return "text-amber-300";
    case "attention":
      return "text-red-400";
  }
}

export default async function AdminTenantsPage() {
  const tenants: TenantWithHealth[] = await listTenantsWithHealth();

  return (
    <AdminListPage
      title="Tenants"
      description="Live organizations provisioned from approved blueprints."
      isEmpty={tenants.length === 0}
      emptyTitle="No tenants yet"
      emptyDescription="Complete a blueprint and approve go-live to provision one."
    >
      {tenants.map((t) => (
        <ListCard key={t.id}>
          <div>
            <p className="font-medium text-white">{t.organization.displayName}</p>
            <p className="font-mono text-xs text-cyan-400">/{t.slug}</p>
            <p className="mt-1 text-xs text-slate-500">
              {planLabel(t.planKey)} · {t._count.modules} modules · {t.health.membershipCount}{" "}
              members · {t.health.openIncidentCount} open incidents
            </p>
            <p className={`mt-1 text-xs font-medium ${healthScoreClass(t.health.healthScore)}`}>
              Health: {t.health.healthLabel}
              {t.health.lastAuditAt && (
                <span className="ml-2 font-normal text-slate-500">
                  · last audit {t.health.lastAuditAt.toLocaleDateString()}
                </span>
              )}
            </p>
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
              className="text-sm text-slate-400 hover:text-white"
            >
              Detail →
            </Link>
          </div>
        </ListCard>
      ))}
    </AdminListPage>
  );
}
