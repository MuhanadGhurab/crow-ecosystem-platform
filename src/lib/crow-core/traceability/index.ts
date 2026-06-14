/**
 * C0 — Traceability constitution: no invisible tenant changes.
 */

import type { ActorRef, ApprovalStatus, TenantScopeId, VersionLabel } from "../common";

export const TRACEABILITY_CHAIN_STAGES = [
  "discovery_evidence",
  "blueprint_version",
  "commercial_impact",
  "approval",
  "change_request",
  "configuration_release",
  "runtime_deployment",
  "verification_evidence",
  "operating_history",
] as const;

export type TraceabilityChainStage = (typeof TRACEABILITY_CHAIN_STAGES)[number];

export type MaterialChangeRecord = {
  tenantId: TenantScopeId;
  changeId: string;
  stage: TraceabilityChainStage;
  actor: ActorRef;
  requestSource: "client_portal" | "procrow" | "api" | "integration" | "automation" | "ai_assistant";
  previousValue: string | null;
  proposedValue: string;
  approvedValue: string | null;
  reason: string;
  affectedEntityRefs: readonly string[];
  affectedProcessKeys: readonly string[];
  affectedRoleKeys: readonly string[];
  securityImpact: string | null;
  experienceImpact: string | null;
  financialImpact: string | null;
  aiInvolvement: boolean;
  approver: ActorRef | null;
  timestampIso: string;
  blueprintVersion: VersionLabel | null;
  releaseReference: string | null;
  rollbackReference: string | null;
  evidenceRefs: readonly string[];
  approvalStatus: ApprovalStatus;
};

export const TRACEABILITY_CONSTITUTION_RULE =
  "No tenant change should happen invisibly. Every material change must be traceable from request to runtime." as const;

export const AI_ACTOR_SEPARATION_RULE =
  "AI actions must never appear as human actions. Actor type must distinguish ai_assistant and automation." as const;
