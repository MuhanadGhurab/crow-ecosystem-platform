import { notFound } from "next/navigation";
import { OrganizationModelPanel } from "@/components/discovery/organization-model-panel";
import { PageHeader } from "@/components/ui/page-header";
import { canEditDiscovery } from "@/lib/discovery-editability";
import {
  generateOrgIntelligenceRecommendations,
  getEffectiveOrgModel,
  getOrgIntelligencePlanContext,
  getOrgIntelligenceTrimStatsForRequest,
} from "@/lib/services/org-intelligence.service";
import { getDiscoveryContext } from "@/lib/services/discovery.service";
import type { ImplementationRequestStatus } from "@/lib/types/platform";

export default async function DiscoveryOrganizationModelPage({
  params,
}: {
  params: Promise<{ requestId: string }>;
}) {
  const { requestId } = await params;
  const request = await getDiscoveryContext(requestId);
  if (!request?.discoveryProfile) notFound();

  let orgRow = request.discoveryProfile.orgIntelligence;
  if (!orgRow) {
    orgRow = await generateOrgIntelligenceRecommendations(requestId);
  }

  const model = getEffectiveOrgModel(orgRow);
  const [{ planKey, planDisplayName }, trimStats] = await Promise.all([
    getOrgIntelligencePlanContext(requestId),
    getOrgIntelligenceTrimStatsForRequest(requestId).catch(() => null),
  ]);
  const canEdit = canEditDiscovery(request.status as ImplementationRequestStatus);

  return (
    <div className="space-y-6">
      <PageHeader
        badge="Organizational Intelligence"
        title="Organization model"
        description="Crow Intelligence recommends industry-aware structure — accept, edit, or customize before blueprint."
      />
      <OrganizationModelPanel
        requestId={requestId}
        model={model}
        status={orgRow.status}
        sectorTemplateKey={orgRow.sectorTemplateKey}
        canEdit={canEdit}
        planKey={planKey}
        planDisplayName={planDisplayName}
        trimStats={trimStats}
      />
    </div>
  );
}
