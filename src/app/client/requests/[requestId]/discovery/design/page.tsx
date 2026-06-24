import { notFound } from "next/navigation";

import { ClientDesignJourney } from "@/components/client-enterprise-design/client-design-journey";
import { ClientPortalPageHeader } from "@/components/client-portal/client-portal-page-header";
import { requireClientAccess } from "@/lib/auth/session";
import { routes } from "@/lib/routes";
import { buildClientDesignPageModel } from "@/lib/services/client-enterprise-design-page.service";

export default async function ClientRequestDiscoveryDesignPage({
  params,
  searchParams,
}: {
  params: Promise<{ requestId: string }>;
  searchParams: Promise<{ step?: string }>;
}) {
  const { requestId } = await params;
  const { step } = await searchParams;
  const user = await requireClientAccess(routes.client.requestDiscoveryDesign(requestId));
  const model = await buildClientDesignPageModel(user, requestId);
  if (!model) notFound();

  return (
    <div className="space-y-8">
      <ClientPortalPageHeader
        backHref={routes.client.requestDiscovery(requestId)}
        backLabel="← Discovery"
        eyebrow="Enterprise design"
        title="Guided enterprise design journey"
        description={`${model.organizationName} · ${model.referenceCode}`}
      />
      <ClientDesignJourney model={model} initialStep={step} />
    </div>
  );
}
