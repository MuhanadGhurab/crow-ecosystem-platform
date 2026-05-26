import { getDiscoveryIntelligenceSnapshot } from "@/lib/services/discovery-intelligence.service";
import { DiscoveryCompletenessPanel } from "@/components/discovery/discovery-completeness-panel";

type Props = {
  requestId: string;
};

/** Compact completeness rail shown on all discovery steps. */
export async function DiscoveryIntelligenceRail({ requestId }: Props) {
  const snapshot = await getDiscoveryIntelligenceSnapshot(requestId);
  if (!snapshot) return null;

  return (
    <div className="mb-6">
      <DiscoveryCompletenessPanel requestId={requestId} data={snapshot.completeness} />
    </div>
  );
}
