import { notFound } from "next/navigation";
import { DiscoveryAdvisoryRecommendationsPanel } from "@/components/discovery/discovery-advisory-recommendations";
import { DiscoveryBlueprintBridgePanel } from "@/components/discovery/discovery-blueprint-bridge-panel";
import { DiscoverySectorGuidancePanel } from "@/components/discovery/discovery-sector-guidance-panel";
import { OrganizationModelPanel } from "@/components/discovery/organization-model-panel";
import { PageHeader } from "@/components/ui/page-header";
import { getDiscoveryIntelligenceSnapshot } from "@/lib/services/discovery-intelligence.service";
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
  const intelligence = await getDiscoveryIntelligenceSnapshot(requestId);

  return (
    <div className="space-y-6">
      <PageHeader
        badge="Organization model review"
        title="Sector-based org structure"
        description="Suggested departments, roles, and workflows from your industry and modules — review, trim, and accept before blueprint."
      />
      {intelligence ? (
        <>
          <DiscoverySectorGuidancePanel
            guidance={intelligence.guidance}
            sectorTemplateKey={intelligence.sectorTemplateKey}
            sectorConfidenceLevel={intelligence.completeness.sectorConfidence.level}
            missingInputs={intelligence.completeness.missingInputs}
          />
          <DiscoveryAdvisoryRecommendationsPanel recommendations={intelligence.recommendations} />
          <DiscoveryBlueprintBridgePanel
            requestId={requestId}
            gate={intelligence.gate}
            blueprintId={intelligence.blueprintId}
            essentialsPercent={intelligence.completeness.essentialsPercent}
          />
        </>
      ) : null}
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
