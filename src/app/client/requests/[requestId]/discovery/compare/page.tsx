import Link from "next/link";
import { notFound } from "next/navigation";

import { ClientPortalPageHeader } from "@/components/client-portal/client-portal-page-header";
import { requireClientAccess } from "@/lib/auth/session";
import { projectSnapshotSummary } from "@/lib/client-enterprise-design";
import { routes } from "@/lib/routes";
import { buildClientDesignPageModel } from "@/lib/services/client-enterprise-design-page.service";

export default async function ClientRequestDiscoveryComparePage({
  params,
}: {
  params: Promise<{ requestId: string }>;
}) {
  const { requestId } = await params;
  const user = await requireClientAccess(routes.client.requestDiscoveryCompare(requestId));
  const model = await buildClientDesignPageModel(user, requestId);
  if (!model?.snapshot) notFound();

  const projection = projectSnapshotSummary(model.snapshot);

  return (
    <div className="space-y-8">
      <ClientPortalPageHeader
        backHref={routes.client.requestDiscoveryDesign(requestId)}
        backLabel="← Design journey"
        eyebrow="Model comparison"
        title="Starter · Growth · Enterprise"
        description="Advisory operating realities — not pricing plans."
      />
      <div className="grid gap-4 lg:grid-cols-3">
        {projection.variants.map((v) => (
          <section key={v.key} className="cc-glass-card">
            <h2 className="text-lg font-semibold text-white">{v.displayName}</h2>
            <p className="mt-2 text-sm text-slate-300">Team: {v.estimatedTeamRange}</p>
            <p className="text-xs text-slate-500">
              Workflow {v.workflowDepth} · Approvals {v.approvalDepth} · Automation {v.automation}
            </p>
          </section>
        ))}
      </div>
      <Link href={routes.client.requestDiscoverySummary(requestId)} className="cc-btn-secondary">
        View submission summary
      </Link>
    </div>
  );
}
