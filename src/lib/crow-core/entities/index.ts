/**
 * C0 — Shared enterprise entity model (universal identity, domain catalog).
 */

import type { LifecycleState, SensitivityLevel, TenantScopeId } from "../common";

export type EntityDomain =
  | "organization"
  | "people"
  | "commercial"
  | "operations"
  | "digital_creative"
  | "security_governance"
  | "universal_work";

export type EntityRef = {
  domain: EntityDomain;
  entityType: string;
  entityId: string;
  tenantId: TenantScopeId;
  displayLabel: string;
};

export type TenantScopedId = {
  tenantId: TenantScopeId;
  localId: string;
};

export type ExternalIdentifier = {
  system: string;
  externalId: string;
  verified: boolean;
};

export type UniversalEntityBase = {
  ref: EntityRef;
  lifecycle: LifecycleState;
  sensitivity: SensitivityLevel;
  externalIds: readonly ExternalIdentifier[];
  createdAtIso: string;
  updatedAtIso: string;
};

export type OrganizationEntity = UniversalEntityBase & {
  domain: "organization";
  legalName: string;
  tradeName: string | null;
  branchKeys: readonly string[];
};

export type PersonEntity = UniversalEntityBase & {
  domain: "people";
  fullName: string;
  email: string | null;
  roleKeys: readonly string[];
  departmentKey: string | null;
};

export type WorkItemEntity = UniversalEntityBase & {
  domain: "universal_work";
  title: string;
  processInstanceId: string | null;
  assigneeRef: string | null;
  dueAtIso: string | null;
};

export type EntityRelationship = {
  from: EntityRef;
  to: EntityRef;
  relationshipType: string;
  strength: "strong" | "partial" | "inferred";
};
