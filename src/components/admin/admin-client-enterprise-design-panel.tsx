import Link from "next/link";

import { routes } from "@/lib/routes";
import { buildProCrowClientDesignReviewSnapshot } from "@/lib/services/procrow-client-design-review.service";

export async function AdminClientEnterpriseDesignPanel({ requestId }: { requestId: string }) {
  const review = await buildProCrowClientDesignReviewSnapshot(requestId);
  if (!review) {
    return (
      <section className="cc-glass-card">
        <h2 className="text-sm font-semibold text-white">Client enterprise design</h2>
        <p className="mt-2 text-sm text-slate-400">No client design submission yet.</p>
      </section>
    );
  }

  return (
    <section className="cc-glass-card space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-white">Client enterprise design</h2>
        <Link
          href={`${routes.admin.modelForge}?clientDesignRequestId=${requestId}`}
          className="text-xs text-violet-400 hover:text-violet-300"
        >
          Open in Model Forge →
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase text-slate-500">Client selection</p>
          <ul className="mt-2 space-y-1 text-sm text-slate-300">
            <li>Field: {review.clientSelections.field}</li>
            <li>Domains: {review.clientSelections.domains.join(", ") || "—"}</li>
            <li>Purpose: {review.clientSelections.primaryPurpose ?? "—"}</li>
            <li>Variant: {review.clientSelections.selectedVariant}</li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase text-slate-500">Crow recommendation</p>
          <ul className="mt-2 space-y-1 text-sm text-slate-300">
            <li>Recommended variant: {review.crowRecommendations.recommendedVariant}</li>
            <li>
              Team range: {review.crowRecommendations.leanModel.estimatedCoreTeamRange.min}–
              {review.crowRecommendations.leanModel.estimatedCoreTeamRange.max}
            </li>
            <li>Provenance entries: {review.crowRecommendations.provenanceCount}</li>
          </ul>
        </div>
      </div>
      {review.clientSelections.warnings.length > 0 && (
        <p className="text-xs text-amber-400">{review.clientSelections.warnings.join(" ")}</p>
      )}
    </section>
  );
}
