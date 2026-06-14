/**
 * C0 — AI capability framework (risk tiers, human-in-the-loop, prohibited actions).
 */

import type { ActorRef, ApprovalStatus, TenantScopeId } from "../common";

export type AiRiskTier = "low" | "medium" | "high" | "prohibited_autonomous";

export type AiCapabilityKey =
  | "discovery_assist"
  | "blueprint_draft"
  | "roi_modeling"
  | "sow_draft"
  | "workflow_suggestion"
  | "decision_assistance"
  | "security_signal_summary"
  | "experience_mapping"
  | "integration_assessment";

export type AiCapability = {
  key: AiCapabilityKey;
  label: string;
  riskTier: AiRiskTier;
  humanInTheLoopRequired: boolean;
  explainabilityRequired: boolean;
  quotaCategory: string;
};

export type AiInvocation = {
  invocationId: string;
  tenantId: TenantScopeId;
  capabilityKey: AiCapabilityKey;
  invokedBy: ActorRef;
  inputSummary: string;
  outputSummary: string;
  timestampIso: string;
  approvalStatus: ApprovalStatus | null;
};

export const PROHIBITED_AUTONOMOUS_AI_ACTIONS = [
  "payments",
  "terminations",
  "privileged_access_grants",
  "contract_signing",
  "policy_changes",
  "production_deploy_without_human_approval",
  "role_or_permission_grants",
] as const;

export const AI_CAPABILITY_RULES = [
  "AI-generated outputs are advisory until human or formal approval.",
  "AI actor type must be distinct from human in traceability records.",
  "High-risk capabilities require explicit human approval before effect.",
] as const;
