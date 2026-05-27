import Link from "next/link";
import { notFound } from "next/navigation";
import { ClientPortalApprovalBlocked } from "@/components/client-portal/client-portal-approval-blocked";
import { ClientPortalStatusCard } from "@/components/client-portal/client-portal-status-card";
import { requireClientAccess } from "@/lib/auth/session";
import { moduleLabel } from "@/lib/catalog-labels";
import { prisma } from "@/lib/db";
import { isUseMockData } from "@/lib/mock/env";
import { MOCK_PIPELINE_REQUESTS } from "@/lib/mock/pipeline";
import { routes } from "@/lib/routes";
import { clientCanAccessRequest } from "@/lib/services/client-request-link.service";

export default async function ClientBlueprintDetailPage({
  params,
}: {
  params: Promise<{ blueprintId: string }>;
}) {
  const { blueprintId } = await params;
  const user = await requireClientAccess(routes.client.blueprint(blueprintId));

  if (isUseMockData() && blueprintId === "mock-bp-001") {
    const pipeline = MOCK_PIPELINE_REQUESTS[0];
    return (
      <BlueprintDetail
        organizationName={pipeline.organizationName}
        referenceCode={pipeline.referenceCode}
        status="IN_REVIEW"
        modules={["Finance", "HR", "CRM"]}
        requestId={pipeline.id}
        readinessLabel="In review"
      />
    );
  }

  if (!user.email) notFound();

  const blueprint = await prisma.enterpriseBlueprint
    .findUnique({
      where: { id: blueprintId },
      include: {
        request: {
          select: {
            id: true,
            referenceCode: true,
            organizationName: true,
            requestedModules: true,
          },
        },
      },
    })
    .catch(() => null);

  if (!blueprint) notFound();

  const allowed = await clientCanAccessRequest(user.id, user.email, blueprint.requestId).catch(
    () => false
  );
  if (!allowed) notFound();

  const modules = blueprint.request.requestedModules.map((m) => moduleLabel(m.moduleKey));

  return (
    <BlueprintDetail
      organizationName={blueprint.request.organizationName}
      referenceCode={blueprint.request.referenceCode}
      status={blueprint.status}
      modules={modules}
      requestId={blueprint.requestId}
      readinessLabel={blueprint.status.replace("_", " ")}
    />
  );
}

function BlueprintDetail({
  organizationName,
  referenceCode,
  status,
  modules,
  requestId,
  readinessLabel,
}: {
  organizationName: string;
  referenceCode: string;
  status: string;
  modules: string[];
  requestId: string;
  readinessLabel: string;
}) {
  return (
    <div className="space-y-8">
      <div>
        <Link href={routes.client.requests} className="text-sm text-teal-400 hover:text-teal-300">
          ← Requests
        </Link>
        <h1 className="cc-page-title mt-4">Blueprint — {organizationName}</h1>
        <p className="mt-1 font-mono text-sm text-slate-500">{referenceCode}</p>
        <p className="mt-2 text-sm text-violet-300 capitalize">{readinessLabel}</p>
      </div>

      <ClientPortalStatusCard title="Scope summary" badge={status} badgeTone="info">
        <p className="text-sm text-slate-400">
          ProCrow defines modules, security baseline, and go-live readiness. This view is
          read-only until ownership linkage is complete.
        </p>
        {modules.length > 0 && (
          <ul className="mt-4 list-inside list-disc text-sm text-slate-300">
            {modules.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        )}
        <Link
          href={routes.client.request(requestId)}
          className="cc-btn-secondary mt-4 inline-flex text-sm"
        >
          View request
        </Link>
      </ClientPortalStatusCard>

      <ClientPortalApprovalBlocked context="blueprint" />
    </div>
  );
}
