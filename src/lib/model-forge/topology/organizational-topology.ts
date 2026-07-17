import type { OrganizationalTopologyDefinition, OrganizationalTopologyKey } from "../types";

const topo = (key: OrganizationalTopologyKey, displayName: string, structure: string): OrganizationalTopologyDefinition => ({
  key,
  displayName,
  description: `${displayName} organizational topology — recommendations only.`,
  status: "PLANNED",
  version: "1.0.0",
  provenance: "crow_core",
  structure,
  reportingBehavior: "",
  workflowOwnership: "",
  authorityImplications: "Advisory — requires explicit tenant assignment at build time.",
  coordinationRisks: [],
  recommendedSareaPatternKeys: [],
  recommendedCyberCrowPolicyPackKeys: ["baseline_identity_trust"],
});

export const ORGANIZATIONAL_TOPOLOGY_CATALOG: readonly OrganizationalTopologyDefinition[] = [
  { ...topo("DEPARTMENTAL_HIERARCHY", "Departmental hierarchy", "Classic functional departments with hierarchy."), reportingBehavior: "Vertical reporting lines", workflowOwnership: "Department managers", recommendedSareaPatternKeys: ["manager_work_queue"] },
  { ...topo("MATRIX", "Matrix", "Dual reporting across function and project."), reportingBehavior: "Dual reporting", workflowOwnership: "Shared between PM and functional lead", coordinationRisks: ["conflicting_priorities", "unclear_ownership"] },
  { ...topo("PROJECT_BASED", "Project based", "Teams organized around projects."), reportingBehavior: "Project manager primary", workflowOwnership: "Project controllers", recommendedSareaPatternKeys: ["project_workspace"] },
  { ...topo("PRODUCT_TEAMS", "Product teams", "Cross-functional product squads."), workflowOwnership: "Product outcome owners", recommendedSareaPatternKeys: ["specialist_workspace"] },
  { ...topo("OUTCOME_PODS", "Outcome pods", "Small autonomous outcome teams."), workflowOwnership: "Outcome owners", recommendedSareaPatternKeys: ["operations_control_board"] },
  { ...topo("CASE_TEAMS", "Case teams", "Teams formed per case."), workflowOwnership: "Case leads", recommendedSareaPatternKeys: ["case_inbox"] },
  { ...topo("MISSION_TEAMS", "Mission teams", "Temporary mission-oriented teams."), workflowOwnership: "Mission commanders", recommendedSareaPatternKeys: ["operations_control_board"] },
  { ...topo("COMMAND_CENTER", "Command center", "Centralized operations command."), workflowOwnership: "Control tower coordinators", recommendedSareaPatternKeys: ["operations_control_board", "dispatch_console"] },
  { ...topo("SHARED_SERVICES", "Shared services", "Centralized shared service functions."), workflowOwnership: "Service coordinators", coordinationRisks: ["sla_tension_with_business_units"] },
  { ...topo("FRANCHISE_NETWORK", "Franchise network", "Franchisee-operated network."), workflowOwnership: "Franchise coordinators", recommendedCyberCrowPolicyPackKeys: ["branch_access_control", "external_portal_protection"] },
  { ...topo("SEASONAL_POP_UP", "Seasonal pop-up", "Seasonal temporary operations."), workflowOwnership: "Seasonal coordinators", coordinationRisks: ["rapid_onboarding", "knowledge_loss"] },
  { ...topo("FOLLOW_THE_SUN", "Follow the sun", "Geographically distributed handoffs."), reportingBehavior: "Regional handoffs", coordinationRisks: ["handoff_gaps"], recommendedSareaPatternKeys: ["operations_control_board"] },
  { ...topo("HUMAN_AGENT_HYBRID", "Human and agent hybrid", "Mixed human and AI-assisted operations."), workflowOwnership: "Automation supervisors", recommendedCyberCrowPolicyPackKeys: ["privileged_access", "high_risk_workflow_approval"], coordinationRisks: ["automation_boundary_drift"] },
  { ...topo("HOLDING_GROUP", "Holding group", "Parent with subsidiary entities."), workflowOwnership: "Group governance", recommendedSareaPatternKeys: ["executive_command_center", "compliance_cockpit"], recommendedCyberCrowPolicyPackKeys: ["privileged_access", "data_export_control"] },
] as const;
