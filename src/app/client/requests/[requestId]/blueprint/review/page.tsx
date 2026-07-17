import { redirect } from "next/navigation";
import { ClientBlueprintReviewPanel } from "@/components/client/client-blueprint-review-panel";
import { requireBlueprintRequestOwner } from "@/lib/auth/blueprint-engine-guard";
import { getClientBlueprintProjectionForRequest } from "@/lib/crow-core/blueprint-engine/blueprint-lifecycle-orchestrator";
import { routes } from "@/lib/routes";

export const dynamic = "force-dynamic";

export default async function ClientRequestBlueprintReviewPage({
  params,
}: {
  params: Promise<{ requestId: string }>;
}) {
  const { requestId } = await params;
  const { supabaseUserId } = await requireBlueprintRequestOwner(
    requestId,
    routes.client.requestBlueprintReview(requestId),
  );
  const data = await getClientBlueprintProjectionForRequest(requestId, supabaseUserId).catch(() => null);
  if (!data) redirect(routes.client.requestBlueprint(requestId));

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="text-xl font-semibold text-slate-900">Blueprint review</h1>
      <ClientBlueprintReviewPanel
        requestId={requestId}
        versionNumber={data.versionNumber}
        contentHash={data.contentHash}
        rowVersion={data.root.rowVersion}
      />
    </div>
  );
}
