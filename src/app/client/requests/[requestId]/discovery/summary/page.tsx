import Link from "next/link";
import { notFound } from "next/navigation";

import { ClientPortalPageHeader } from "@/components/client-portal/client-portal-page-header";
import { requireClientAccess } from "@/lib/auth/session";
import { projectLeanModel } from "@/lib/client-enterprise-design";
import { routes } from "@/lib/routes";
import { buildClientDesignPageModel } from "@/lib/services/client-enterprise-design-page.service";

export default async function ClientRequestDiscoverySummaryPage({
  params,
}: {
  params: Promise<{ requestId: string }>;
}) {
  const { requestId } = await params;
  const user = await requireClientAccess(routes.client.requestDiscoverySummary(requestId));
  const model = await buildClientDesignPageModel(user, requestId);
  if (!model?.snapshot) notFound();

  const lean = projectLeanModel(model.snapshot.leanModel);

  return (
    <div className="space-y-8">
      <ClientPortalPageHeader
        backHref={routes.client.requestDiscoveryDesign(requestId)}
        backLabel="← Design journey"
        eyebrow="Design summary"
        title="Enterprise design submission"
        description={model.draft.status === "SUBMITTED" ? "Submitted for ProCrow review" : "Draft"}
      />
      <section className="cc-glass-card space-y-3 text-sm text-slate-300">
        <p>Field: {model.draft.primaryIndustry}</p>
        <p>Purposes: {model.draft.businessPurposes.join(", ")}</p>
        <p>Priority: {model.draft.operatingPriority}</p>
        <p>Variant: {model.draft.selectedModelVariant}</p>
        <p>Estimated team: {lean.estimatedTeamRange}</p>
        <p className="text-xs text-slate-500">{lean.disclaimer}</p>
      </section>
      <Link href={routes.client.request(requestId)} className="cc-btn-secondary">
        Back to request
      </Link>
    </div>
  );
}
