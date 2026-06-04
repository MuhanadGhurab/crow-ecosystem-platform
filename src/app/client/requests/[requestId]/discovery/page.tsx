import Link from "next/link";
import { notFound } from "next/navigation";
import { ClientDiscoveryWizard } from "@/components/client-portal/client-discovery-wizard";
import { ClientPortalPageHeader } from "@/components/client-portal/client-portal-page-header";
import { ProductPageHeader } from "@/components/product/product-page-header";
import { CLIENT_DISCOVERY_STAGE_TEMPLATES } from "@/lib/constants/client-discovery-stage-templates";
import { requireClientAccess } from "@/lib/auth/session";
import { discoveryStatusLabel } from "@/lib/client-portal/client-discovery-contract";
import { routes } from "@/lib/routes";
import {
  buildClientDiscoveryPageModel,
  listClientDiscoveryIndustryOptions,
} from "@/lib/services/client-discovery.service";

export default async function ClientRequestDiscoveryPage({
  params,
  searchParams,
}: {
  params: Promise<{ requestId: string }>;
  searchParams: Promise<{ step?: string }>;
}) {
  const { requestId } = await params;
  const { step } = await searchParams;
  const user = await requireClientAccess(routes.client.requestDiscovery(requestId));

  const model = await buildClientDiscoveryPageModel(user, requestId);
  if (!model) notFound();

  return (
    <div className="space-y-8">
      <ClientPortalPageHeader
        backHref={routes.client.request(requestId)}
        backLabel="← Request"
        eyebrow="Client-led discovery"
        title="Guided discovery"
        description={`${model.organizationName} · ${model.referenceCode}`}
      />

      <ProductPageHeader
        title="Configure your operating model"
        description="Complete advisory discovery so ProCrow can review and build the official blueprint and proposal. You cannot approve final pricing or create tenant runtime from this flow."
        statusChip={{
          label: discoveryStatusLabel(model.draft.status),
          tone:
            model.draft.status === "accepted_into_blueprint"
              ? "success"
              : model.draft.status === "submitted_for_procrow_review" ||
                  model.draft.status === "procrow_reviewing" ||
                  model.draft.status === "changes_requested"
                ? "warning"
                : "info",
        }}
      />

      {!model.canEdit && model.editBlockedReason && (
        <section className="cc-glass-card">
          <p className="text-sm text-slate-300">{model.editBlockedReason}</p>
          <Link
            href={routes.client.request(requestId)}
            className="mt-3 inline-block text-sm text-teal-400 hover:text-teal-300"
          >
            Return to request detail
          </Link>
        </section>
      )}

      <ClientDiscoveryWizard
        model={model}
        stageTemplates={CLIENT_DISCOVERY_STAGE_TEMPLATES}
        industryOptions={listClientDiscoveryIndustryOptions()}
        initialStep={step ?? null}
      />
    </div>
  );
}
