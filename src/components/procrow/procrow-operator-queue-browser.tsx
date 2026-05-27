"use client";

import { useMemo, useState } from "react";
import type {
  ProCrowOperatorQueueItem,
  ProCrowOperatorQueueSnapshot,
  ProCrowQueueStage,
} from "@/lib/procrow/procrow-operator-queue-contract";
import { ProCrowQueueStageTabs } from "@/components/procrow/procrow-queue-stage-tabs";
import { ProCrowQueueItemCard } from "@/components/procrow/procrow-queue-item-card";
import { ProCrowQueueEmptyState } from "@/components/procrow/procrow-queue-empty-state";

export function filterQueueItemsByStage(
  snapshot: ProCrowOperatorQueueSnapshot,
  stage: ProCrowQueueStage | "all"
): ProCrowOperatorQueueItem[] {
  if (stage === "all") return snapshot.items;
  return snapshot.stageBuckets[stage];
}

export function ProCrowOperatorQueueBrowser({ snapshot }: { snapshot: ProCrowOperatorQueueSnapshot }) {
  const [stage, setStage] = useState<ProCrowQueueStage | "all">("all");
  const items = useMemo(() => filterQueueItemsByStage(snapshot, stage), [snapshot, stage]);

  return (
    <div className="space-y-4">
      <ProCrowQueueStageTabs snapshot={snapshot} selected={stage} onSelect={setStage} />
      {items.length === 0 ? (
        <ProCrowQueueEmptyState message="No items in this stage — try another filter or refresh after pipeline activity." />
      ) : (
        <ul className="space-y-2">
          {items.map((item) => (
            <ProCrowQueueItemCard key={item.id} item={item} />
          ))}
        </ul>
      )}
    </div>
  );
}
