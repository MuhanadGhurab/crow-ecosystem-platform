/**
 * CROW.DISCOVERY.3 — browser-local draft answers (no hosted writes, no migration).
 */

import type { DiscoveryMvpAnswerMap } from "@/lib/discovery/discovery-mvp-d3-types";

export const DISCOVERY_MVP_D3_DRAFT_PREFIX = "crow-discovery-mvp-d3-v1" as const;

export type DiscoveryMvpD3DraftPayload = {
  schemaVersion: typeof DISCOVERY_MVP_D3_DRAFT_PREFIX;
  requestId: string;
  updatedAt: string;
  answers: DiscoveryMvpAnswerMap;
  /** Explicit non-authority markers. */
  createsBlueprint: false;
  provisionsTenant: false;
  invokesCroAI: false;
};

export function discoveryMvpD3DraftStorageKey(requestId: string): string {
  return `${DISCOVERY_MVP_D3_DRAFT_PREFIX}:${requestId}`;
}

function localStore(): Storage | null {
  return typeof globalThis.localStorage !== "undefined" ? globalThis.localStorage : null;
}

export function readDiscoveryMvpD3Draft(requestId: string): DiscoveryMvpD3DraftPayload | null {
  const store = localStore();
  if (!store) return null;
  try {
    const raw = store.getItem(discoveryMvpD3DraftStorageKey(requestId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as DiscoveryMvpD3DraftPayload;
    if (parsed.schemaVersion !== DISCOVERY_MVP_D3_DRAFT_PREFIX) return null;
    if (parsed.requestId !== requestId) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeDiscoveryMvpD3Draft(
  requestId: string,
  answers: DiscoveryMvpAnswerMap,
): DiscoveryMvpD3DraftPayload | null {
  const store = localStore();
  if (!store) return null;
  const payload: DiscoveryMvpD3DraftPayload = {
    schemaVersion: DISCOVERY_MVP_D3_DRAFT_PREFIX,
    requestId,
    updatedAt: new Date().toISOString(),
    answers,
    createsBlueprint: false,
    provisionsTenant: false,
    invokesCroAI: false,
  };
  store.setItem(discoveryMvpD3DraftStorageKey(requestId), JSON.stringify(payload));
  return payload;
}

export function clearDiscoveryMvpD3Draft(requestId: string): void {
  localStore()?.removeItem(discoveryMvpD3DraftStorageKey(requestId));
}
