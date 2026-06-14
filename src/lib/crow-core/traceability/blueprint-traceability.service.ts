import type { ActorRef } from "../common";
import {
  TRACEABILITY_CHAIN_STAGES,
  type BlueprintTraceEvent,
  type BlueprintTraceTimeline,
  type TraceabilityChainStage,
} from "./index";
import { hashBlueprintDocument } from "../blueprint-studio/blueprint-hash.service";
import type { EnterpriseBlueprintDocument } from "../blueprint";

const eventStore = new Map<string, BlueprintTraceEvent[]>();

export function clearBlueprintTraceStore(): void {
  eventStore.clear();
}

export type RecordBlueprintTraceInput = {
  blueprintId: string;
  stage: TraceabilityChainStage;
  actor: ActorRef;
  summary: string;
  version?: number;
  versionId?: string;
  aiAssisted?: boolean;
  metadata?: Record<string, unknown>;
  document?: EnterpriseBlueprintDocument;
};

export function recordBlueprintTraceEvent(input: RecordBlueprintTraceInput): BlueprintTraceEvent {
  const contentHash = input.document ? hashBlueprintDocument(input.document) : undefined;
  const event: BlueprintTraceEvent = {
    id: `bte-${input.blueprintId}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    blueprintId: input.blueprintId,
    versionId: input.versionId ?? (input.version != null ? String(input.version) : undefined),
    stage: input.stage,
    actor: input.actor,
    summary: input.summary,
    timestamp: new Date().toISOString(),
    aiAssisted: input.aiAssisted,
    payload: {
      ...(contentHash ? { contentHash } : {}),
      ...(input.metadata ?? {}),
    },
  };

  const existing = eventStore.get(input.blueprintId) ?? [];
  eventStore.set(input.blueprintId, [...existing, event]);
  return event;
}

export function listBlueprintTraceEvents(blueprintId: string): BlueprintTraceEvent[] {
  return [...(eventStore.get(blueprintId) ?? [])].sort((a, b) =>
    a.timestamp.localeCompare(b.timestamp)
  );
}

export function buildBlueprintTraceTimeline(blueprintId: string): BlueprintTraceTimeline {
  const events = listBlueprintTraceEvents(blueprintId);
  const stagesPresent = [
    ...new Set(events.map((e) => e.stage)),
  ] as TraceabilityChainStage[];
  const missingStages = (TRACEABILITY_CHAIN_STAGES as readonly TraceabilityChainStage[]).filter(
    (stage) => !stagesPresent.includes(stage)
  );

  return {
    blueprintId,
    events,
    stagesPresent,
    missingStages,
    chainComplete: missingStages.length === 0,
  };
}

/** @deprecated Use `recordBlueprintTraceEvent` */
export const appendBlueprintTraceEvent = recordBlueprintTraceEvent;

/** @deprecated Use `clearBlueprintTraceStore` */
export const resetBlueprintTraceStore = clearBlueprintTraceStore;
