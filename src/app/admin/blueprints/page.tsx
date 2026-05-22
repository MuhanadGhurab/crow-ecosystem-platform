import Link from "next/link";
import { BlueprintStatusBadge } from "@/components/admin/blueprint-status-badge";
import { RequestStatusBadge } from "@/components/admin/request-status-badge";
import { AdminListPage } from "@/components/ui/admin-list-page";
import { ListCard } from "@/components/ui/list-card";
import { routes } from "@/lib/routes";
import {
  listEnterpriseBlueprints,
  type EnterpriseBlueprintListItem,
} from "@/lib/services/blueprint.service";
import type { ImplementationRequestStatus } from "@/lib/types/platform";

export default async function AdminBlueprintsPage() {
  const blueprints = await listEnterpriseBlueprints();

  return (
    <AdminListPage
      badge="Blueprint"
      title="Enterprise blueprints"
      description="Draft and approved blueprints from completed discovery."
      isEmpty={blueprints.length === 0}
      emptyTitle="No blueprints yet"
      emptyDescription="Complete discovery on a request to create one."
    >
      {blueprints.map((b: EnterpriseBlueprintListItem) => (
        <ListCard key={b.id}>
          <div>
            <p className="font-medium text-white">{b.request.organizationName}</p>
            <p className="font-mono text-xs text-slate-500">{b.request.referenceCode}</p>
            <p className="mt-1 text-xs text-slate-500">
              v{b.version} · {b.modules.length} modules
              {b.tenant && (
                <>
                  {" "}
                  · tenant <span className="text-cyan-400">/{b.tenant.slug}</span>
                </>
              )}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <BlueprintStatusBadge status={b.status} />
            <RequestStatusBadge
              status={b.request.status as ImplementationRequestStatus}
            />
            <Link
              href={routes.blueprint(b.id).overview}
              className="cc-btn-secondary !px-3 !py-1.5 text-sm"
            >
              Open →
            </Link>
          </div>
        </ListCard>
      ))}
    </AdminListPage>
  );
}
