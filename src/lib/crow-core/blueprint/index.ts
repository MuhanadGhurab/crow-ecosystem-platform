/**
 * C0 — Enterprise Blueprint: machine-readable, versioned, deployable intent.
 */

import type { ApprovalStatus, TenantScopeId, VersionLabel } from "../common";

export const BLUEPRINT_SLICE_TYPES = [
  "organizational",
  "operational",
  "security_trust",
  "experience",
  "integration",
  "commercial",
] as const;

export type BlueprintSliceType = (typeof BLUEPRINT_SLICE_TYPES)[number];

export type BlueprintVersionRef = {
  blueprintId: string;
  version: VersionLabel;
  tenantId: TenantScopeId;
  status: ApprovalStatus;
  basedOnDiscoveryRequestId: string | null;
  createdAtIso: string;
  approvedAtIso: string | null;
};

export type OrganizationalBlueprintSlice = {
  type: "organizational";
  tenantName: string;
  branches: readonly { key: string; label: string }[];
  departments: readonly { key: string; label: string; branchKey?: string }[];
  teams: readonly { key: string; departmentKey: string; label: string }[];
  roles: readonly { key: string; label: string; departmentKey?: string }[];
  positions: readonly { key: string; roleKey: string; label: string }[];
  accountPopulationEstimate: number | null;
};

export type OperationalBlueprintSlice = {
  type: "operational";
  processes: readonly { key: string; label: string; departmentKey: string }[];
  workflowStages: readonly string[];
  handoffs: readonly { from: string; to: string; trigger: string }[];
  approvalPoints: readonly string[];
  slas: readonly { key: string; targetHours: number }[];
  kpis: readonly string[];
  evidenceRequirements: readonly string[];
};

export type SecurityTrustBlueprintSlice = {
  type: "security_trust";
  identityAssurance: readonly string[];
  authenticationMethods: readonly string[];
  authorizationModel: string;
  leastPrivilegeNotes: string;
  separationOfDutiesRules: readonly string[];
  sessionTrustRequirements: readonly string[];
  privacyControls: readonly string[];
  evidenceRetentionPolicy: string | null;
};

export type ExperienceBlueprintSlice = {
  type: "experience";
  personas: readonly { key: string; label: string; density: string }[];
  navigationKeys: readonly string[];
  accessibilityRequirements: readonly string[];
  languages: readonly string[];
  sareaRules: readonly string[];
};

export type IntegrationBlueprintSlice = {
  type: "integration";
  identityProviders: readonly string[];
  financeSystems: readonly string[];
  hrSystems: readonly string[];
  externalApis: readonly string[];
  governmentServices: readonly string[];
  integrationOwners: readonly { key: string; ownerRole: string }[];
};

export type CommercialBlueprintSlice = {
  type: "commercial";
  recommendedPackage: string;
  accountVolume: number | null;
  modules: readonly string[];
  aiCapabilities: readonly string[];
  implementationEffortDays: number | null;
  timelineWeeks: number | null;
  supportTier: string | null;
};

export type BlueprintSlice =
  | OrganizationalBlueprintSlice
  | OperationalBlueprintSlice
  | SecurityTrustBlueprintSlice
  | ExperienceBlueprintSlice
  | IntegrationBlueprintSlice
  | CommercialBlueprintSlice;

export type EnterpriseBlueprintDocument = {
  ref: BlueprintVersionRef;
  slices: readonly BlueprintSlice[];
  assumptions: readonly string[];
  exclusions: readonly string[];
  acceptanceCriteria: readonly string[];
};

export type ConfigurationReleaseBinding = {
  blueprintVersion: VersionLabel;
  releaseId: string;
  deployedAtIso: string | null;
  verificationEvidenceRefs: readonly string[];
};
