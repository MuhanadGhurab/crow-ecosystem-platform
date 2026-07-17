import Link from "next/link";
import { ClientBlueprintReviewPanel } from "@/components/client/client-blueprint-review-panel";
import { requireBlueprintRequestOwner } from "@/lib/auth/blueprint-engine-guard";
import { getClientBlueprintProjectionForRequest } from "@/lib/crow-core/blueprint-engine/blueprint-lifecycle-orchestrator";
import { BlueprintEngineError } from "@/lib/crow-core/blueprint-engine/errors";
import { routes } from "@/lib/routes";

export const dynamic = "force-dynamic";

export default async function ClientRequestBlueprintPage({
  params,
}: {
  params: Promise<{ requestId: string }>;
}) {
  const { requestId } = await params;
  const { supabaseUserId } = await requireBlueprintRequestOwner(
    requestId,
    routes.client.requestBlueprint(requestId),
  );

  let projectionData: Awaited<ReturnType<typeof getClientBlueprintProjectionForRequest>> | null = null;
  let denied: string | null = null;
  try {
    projectionData = await getClientBlueprintProjectionForRequest(requestId, supabaseUserId);
  } catch (err) {
    if (err instanceof BlueprintEngineError) denied = err.message;
    else denied = "Blueprint not available";
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <div>
        <Link href={routes.client.request(requestId)} className="text-sm text-cyan-600 underline">
          ← Request
        </Link>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">Enterprise Blueprint</h1>
      </div>
      {denied && (
        <p className="rounded border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">{denied}</p>
      )}
      {projectionData && (
        <>
          <section className="rounded border border-slate-200 p-4 text-sm">
            <p className="text-slate-600">
              Version <strong>{projectionData.versionNumber}</strong> · Hash{" "}
              <span className="font-mono">{projectionData.projection.contentHashPrefix}</span>
            </p>
            <p className="mt-2 text-slate-800">{projectionData.projection.executiveSummary}</p>
            <p className="mt-3 text-xs text-amber-800">{projectionData.projection.advisoryNotice}</p>
          </section>
          <ClientBlueprintReviewPanel
            requestId={requestId}
            versionNumber={projectionData.versionNumber}
            contentHash={projectionData.contentHash}
            rowVersion={projectionData.root.rowVersion}
          />
          <Link
            href={routes.client.requestBlueprintReview(requestId)}
            className="inline-block text-sm text-cyan-700 underline"
          >
            Open review workspace →
          </Link>
        </>
      )}
    </div>
  );
}
