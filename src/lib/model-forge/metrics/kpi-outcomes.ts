import type {
  AuditRecommendation,
  EvidenceRequirement,
  KpiDefinition,
  OutcomeDefinition,
  TrustControlRecommendation,
} from "../types";

export const OUTCOME_CATALOG: readonly OutcomeDefinition[] = [
  { key: "case_resolved", displayName: "Case resolved", description: "Case closed with evidence.", status: "PLANNED", version: "1.0.0", provenance: "crow_core", successCriteria: ["customer_confirmed", "sla_met"], measurableEvents: ["case.closed"] },
  { key: "project_delivered", displayName: "Project delivered", description: "Project milestone delivered.", status: "PLANNED", version: "1.0.0", provenance: "crow_core", successCriteria: ["milestone_signed_off"], measurableEvents: ["project.milestone_completed"] },
  { key: "incident_contained", displayName: "Incident contained", description: "Incident contained and documented.", status: "PLANNED", version: "1.0.0", provenance: "crow_core", successCriteria: ["timeline_complete", "root_cause_recorded"], measurableEvents: ["incident.contained"] },
] as const;

export const KPI_CATALOG: readonly KpiDefinition[] = [
  { key: "case_resolution_time", displayName: "Case resolution time", description: "Median time to resolve cases.", status: "PLANNED", version: "1.0.0", provenance: "crow_core", category: "service_level", measurementEvent: "case.closed", avoidsSurveillance: true },
  { key: "first_contact_resolution", displayName: "First contact resolution", description: "Cases resolved on first contact.", status: "PLANNED", version: "1.0.0", provenance: "crow_core", category: "outcome_quality", measurementEvent: "case.first_contact_resolved", avoidsSurveillance: true },
  { key: "sla_breach_rate", displayName: "SLA breach rate", description: "Rate of SLA breaches.", status: "PLANNED", version: "1.0.0", provenance: "crow_core", category: "risk", measurementEvent: "sla.breached", avoidsSurveillance: true },
  { key: "capacity_utilization", displayName: "Capacity utilization", description: "Resource utilization vs capacity.", status: "PLANNED", version: "1.0.0", provenance: "crow_core", category: "capacity", measurementEvent: "resource.utilization_snapshot", avoidsSurveillance: true },
  { key: "backlog_age", displayName: "Backlog age", description: "Age of oldest open work item.", status: "PLANNED", version: "1.0.0", provenance: "crow_core", category: "bottleneck", measurementEvent: "queue.oldest_item_age", avoidsSurveillance: true },
  { key: "workflow_cycle_time", displayName: "Workflow cycle time", description: "End-to-end workflow duration.", status: "PLANNED", version: "1.0.0", provenance: "crow_core", category: "workflow_health", measurementEvent: "workflow.completed", avoidsSurveillance: true },
  { key: "approval_bottleneck_index", displayName: "Approval bottleneck index", description: "Time spent waiting on approvals.", status: "PLANNED", version: "1.0.0", provenance: "crow_core", category: "bottleneck", measurementEvent: "approval.wait_time", avoidsSurveillance: true },
  { key: "outcome_completion_rate", displayName: "Outcome completion rate", description: "Rate of outcomes completed on time.", status: "PLANNED", version: "1.0.0", provenance: "crow_core", category: "outcome_quality", measurementEvent: "outcome.completed", avoidsSurveillance: true },
  { key: "release_success_rate", displayName: "Release success rate", description: "Successful releases without rollback.", status: "PLANNED", version: "1.0.0", provenance: "crow_core", category: "workflow_health", measurementEvent: "release.completed", avoidsSurveillance: true },
  { key: "fleet_utilization", displayName: "Fleet utilization", description: "Active fleet utilization.", status: "PLANNED", version: "1.0.0", provenance: "crow_core", category: "capacity", measurementEvent: "fleet.utilization", avoidsSurveillance: true },
  { key: "qualification_cycle_time", displayName: "Qualification cycle time", description: "Time to qualify new clients.", status: "PLANNED", version: "1.0.0", provenance: "crow_core", category: "workflow_health", measurementEvent: "qualification.completed", avoidsSurveillance: true },
  { key: "revision_count", displayName: "Revision count", description: "Creative revision iterations.", status: "PLANNED", version: "1.0.0", provenance: "crow_core", category: "workflow_health", measurementEvent: "asset.revised", avoidsSurveillance: true },
  { key: "cycle_time", displayName: "Cycle time", description: "Generic cycle time.", status: "PLANNED", version: "1.0.0", provenance: "crow_core", category: "workflow_health", measurementEvent: "workflow.cycle_completed", avoidsSurveillance: true },
  { key: "service_completion_rate", displayName: "Service completion rate", description: "Completed vs booked services.", status: "PLANNED", version: "1.0.0", provenance: "crow_core", category: "outcome_quality", measurementEvent: "service.completed", avoidsSurveillance: true },
  { key: "recovery_rate", displayName: "Recovery rate", description: "Customer recovery success.", status: "PLANNED", version: "1.0.0", provenance: "crow_core", category: "outcome_quality", measurementEvent: "customer.recovered", avoidsSurveillance: true },
  { key: "energy_per_unit", displayName: "Energy per unit", description: "Energy efficiency per fleet unit.", status: "PLANNED", version: "1.0.0", provenance: "crow_core", category: "capacity", measurementEvent: "fleet.energy_per_unit", avoidsSurveillance: true },
] as const;

export const EVIDENCE_CATALOG: readonly EvidenceRequirement[] = [
  { key: "conflict_check_record", displayName: "Conflict check record", description: "Documented conflict screening.", status: "PLANNED", version: "1.0.0", provenance: "crow_core", mandatoryForWorkflowKeys: ["matter_intake_and_conflict_check"], retentionHint: "7_years_or_policy" },
  { key: "inspection_report", displayName: "Inspection report", description: "Signed inspection findings.", status: "PLANNED", version: "1.0.0", provenance: "crow_core", mandatoryForWorkflowKeys: ["inspection_and_corrective_action"], retentionHint: "policy_defined" },
  { key: "incident_timeline", displayName: "Incident timeline", description: "Immutable incident event timeline.", status: "PLANNED", version: "1.0.0", provenance: "crow_core", mandatoryForWorkflowKeys: ["incident_command"], retentionHint: "incident_policy" },
  { key: "rights_documentation", displayName: "Rights documentation", description: "Rights clearance documentation.", status: "PLANNED", version: "1.0.0", provenance: "crow_core", mandatoryForWorkflowKeys: ["rights_clearance"], retentionHint: "contract_term" },
  { key: "lab_notebook", displayName: "Lab notebook", description: "Research lab notebook integrity.", status: "PLANNED", version: "1.0.0", provenance: "crow_core", mandatoryForWorkflowKeys: ["research_review_and_evidence"], retentionHint: "research_policy" },
  { key: "asset_version_history", displayName: "Asset version history", description: "Creative asset version trail.", status: "PLANNED", version: "1.0.0", provenance: "crow_core", mandatoryForWorkflowKeys: ["creative_asset_production"], retentionHint: "project_term" },
  { key: "corrective_proof", displayName: "Corrective action proof", description: "Proof of corrective remediation.", status: "PLANNED", version: "1.0.0", provenance: "crow_core", mandatoryForWorkflowKeys: ["inspection_and_corrective_action"], retentionHint: "policy_defined" },
  { key: "approval_rationale", displayName: "Approval rationale", description: "Documented approval rationale.", status: "PLANNED", version: "1.0.0", provenance: "crow_core", mandatoryForWorkflowKeys: [], retentionHint: "audit_policy" },
  { key: "peer_review_record", displayName: "Peer review record", description: "Documented peer review.", status: "PLANNED", version: "1.0.0", provenance: "crow_core", mandatoryForWorkflowKeys: ["research_review_and_evidence"], retentionHint: "research_policy" },
] as const;

export const AUDIT_RECOMMENDATION_CATALOG: readonly AuditRecommendation[] = [
  { key: "approval_rationale", displayName: "Approval rationale", description: "Require rationale on approvals.", status: "PLANNED", version: "1.0.0", provenance: "crow_core", immutableEvents: ["approval.granted", "approval.rejected"], rationaleRequired: true },
  { key: "financial_approval_trail", displayName: "Financial approval trail", description: "Immutable financial approval trail.", status: "PLANNED", version: "1.0.0", provenance: "crow_core", immutableEvents: ["financial.approval"], rationaleRequired: true },
] as const;

export const TRUST_CONTROL_CATALOG: readonly TrustControlRecommendation[] = [
  { key: "step_up_high_risk", displayName: "Step-up for high risk", description: "Step-up auth for high-risk approvals.", status: "PLANNED", version: "1.0.0", provenance: "crow_core", cyberCrowPolicyPackKey: "high_risk_workflow_approval", trigger: "approval.amount_above_threshold" },
  { key: "export_approval", displayName: "Export approval", description: "Approve sensitive data exports.", status: "PLANNED", version: "1.0.0", provenance: "crow_core", cyberCrowPolicyPackKey: "data_export_control", trigger: "data.export_requested" },
] as const;
