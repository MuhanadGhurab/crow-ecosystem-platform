export type BusinessPurposeDefinition = {
  key: string;
  displayName: string;
  description: string;
  applicableIndustries: string[];
  applicableSpecialistDomains: string[];
  expectedOutcomes: string[];
  recommendedCapabilityKeys: string[];
  recommendedWorkflowKeys: string[];
  recommendedPersonaKeys: string[];
  likelyEntityKeys: string[];
  scaleBehavior: string;
  automationOpportunities: string[];
  riskConsiderations: string[];
};

function purpose(
  key: string,
  displayName: string,
  description: string,
  meta: Partial<
    Pick<
      BusinessPurposeDefinition,
      | "applicableIndustries"
      | "applicableSpecialistDomains"
      | "expectedOutcomes"
      | "recommendedCapabilityKeys"
      | "recommendedWorkflowKeys"
      | "recommendedPersonaKeys"
      | "likelyEntityKeys"
      | "scaleBehavior"
      | "automationOpportunities"
      | "riskConsiderations"
    >
  > = {},
): BusinessPurposeDefinition {
  return {
    key,
    displayName,
    description,
    applicableIndustries: meta.applicableIndustries ?? ["*"],
    applicableSpecialistDomains: meta.applicableSpecialistDomains ?? [],
    expectedOutcomes: meta.expectedOutcomes ?? [`Deliver ${displayName.toLowerCase()} with traceable operations.`],
    recommendedCapabilityKeys: meta.recommendedCapabilityKeys ?? ["crm", "documents"],
    recommendedWorkflowKeys: meta.recommendedWorkflowKeys ?? ["case_resolution"],
    recommendedPersonaKeys: meta.recommendedPersonaKeys ?? ["coordinator", "supervisor"],
    likelyEntityKeys: meta.likelyEntityKeys ?? ["account", "contact"],
    scaleBehavior: meta.scaleBehavior ?? "Team range widens as active volume grows.",
    automationOpportunities: meta.automationOpportunities ?? ["Status notifications", "Task routing"],
    riskConsiderations: meta.riskConsiderations ?? ["Clarify approval ownership before reducing review steps."],
  };
}

export const BUSINESS_PURPOSE_CATALOG: readonly BusinessPurposeDefinition[] = [
  purpose("sell_products", "Sell products", "Retail, wholesale, or digital product sales with inventory and fulfillment.", {
    applicableIndustries: ["retail_and_commerce", "manufacturing_and_industrial", "technology_and_saas"],
    recommendedCapabilityKeys: ["crm", "inventory", "sales_pipeline", "procurement", "customer_portal"],
    recommendedWorkflowKeys: ["procure_to_receive", "customer_onboarding"],
    recommendedPersonaKeys: ["sales_representative", "coordinator", "supervisor"],
  }),
  purpose("deliver_professional_services", "Deliver professional services", "Engagement-based advisory or specialist services.", {
    applicableIndustries: ["professional_services", "healthcare_administration", "education_and_training"],
    applicableSpecialistDomains: ["legal_services", "architecture_and_design", "management_consulting"],
    recommendedCapabilityKeys: ["project_management", "time_tracking", "crm", "contracts", "documents"],
    recommendedWorkflowKeys: ["project_delivery", "contract_review_and_approval"],
    recommendedPersonaKeys: ["specialist", "department_manager", "finance_specialist"],
  }),
  purpose("manage_cases", "Manage cases", "Structured intake, triage, and resolution of client matters.", {
    applicableSpecialistDomains: ["legal_services", "healthcare_administration", "customer_support_operations"],
    recommendedCapabilityKeys: ["case_management", "documents", "crm"],
    recommendedWorkflowKeys: ["case_resolution", "matter_intake_and_conflict_check"],
    recommendedPersonaKeys: ["coordinator", "specialist", "supervisor"],
  }),
  purpose("deliver_projects", "Deliver projects", "Time-bound delivery with milestones, budgets, and handoffs.", {
    applicableIndustries: ["construction_and_epc", "professional_services", "technology_and_saas"],
    applicableSpecialistDomains: ["construction_project_controls", "architecture_and_design"],
    recommendedCapabilityKeys: ["project_management", "procurement", "documents", "work_orders"],
    recommendedWorkflowKeys: ["project_delivery", "work_order_execution"],
    recommendedPersonaKeys: ["department_manager", "supervisor", "technician"],
  }),
  purpose("operate_assets", "Operate assets", "Maintain and utilize physical or digital assets across locations.", {
    applicableIndustries: ["manufacturing_and_industrial", "property_and_facilities", "energy_and_utilities"],
    recommendedCapabilityKeys: ["asset_registry", "maintenance", "work_orders", "inventory"],
    recommendedWorkflowKeys: ["work_order_execution", "inspection_to_corrective_action"],
    recommendedPersonaKeys: ["technician", "supervisor", "coordinator"],
  }),
  purpose("run_field_services", "Run field services", "Dispatch crews, visits, and mobile execution.", {
    applicableIndustries: ["logistics_and_fleet", "construction_and_epc", "hospitality_and_venues"],
    applicableSpecialistDomains: ["field_service_operations", "equipment_rental"],
    recommendedCapabilityKeys: ["dispatch", "work_orders", "fleet", "mobile_field"],
    recommendedWorkflowKeys: ["dispatch_and_delivery", "work_order_execution"],
    recommendedPersonaKeys: ["dispatcher", "technician", "driver"],
  }),
  purpose("manage_memberships", "Manage memberships", "Subscriptions, renewals, and member services.", {
    applicableIndustries: ["membership_and_nonprofit", "education_and_training", "healthcare_administration"],
    recommendedCapabilityKeys: ["crm", "subscriptions", "customer_portal", "case_management"],
    recommendedWorkflowKeys: ["customer_onboarding", "case_resolution"],
    recommendedPersonaKeys: ["coordinator", "customer", "supervisor"],
  }),
  purpose("produce_content", "Produce content", "Creative production, assets, and publication workflows.", {
    applicableIndustries: ["media_and_creative"],
    applicableSpecialistDomains: ["film_and_video_production", "music_and_audio_production", "publishing_and_media"],
    recommendedCapabilityKeys: ["project_management", "documents", "contracts"],
    recommendedWorkflowKeys: ["creative_asset_production", "content_review_and_publication", "rights_clearance"],
    recommendedPersonaKeys: ["creative_production_asset_coordinator", "production_rights_clearance_coordinator"],
  }),
  purpose("operate_live_services", "Operate live services", "Always-on operations with incident and release coordination.", {
    applicableIndustries: ["technology_and_saas", "gaming_and_esports"],
    applicableSpecialistDomains: ["gaming_and_esports", "cloud_and_managed_services"],
    recommendedCapabilityKeys: ["incident_management", "case_management", "analytics", "crm"],
    recommendedWorkflowKeys: ["incident_command", "release_readiness"],
    recommendedPersonaKeys: ["live_game_operations_coordinator", "supervisor"],
  }),
  purpose("manage_events", "Manage events", "Venue, staffing, and guest experience operations.", {
    applicableIndustries: ["events_and_venues", "hospitality_and_venues"],
    applicableSpecialistDomains: ["event_production", "catering_and_hospitality"],
    recommendedCapabilityKeys: ["project_management", "crm", "procurement", "work_orders"],
    recommendedWorkflowKeys: ["event_delivery", "crew_onboarding"],
    recommendedPersonaKeys: ["coordinator", "supervisor", "dispatcher"],
  }),
  purpose("provide_training", "Provide training", "Programs, cohorts, and certification tracking.", {
    applicableIndustries: ["education_and_training"],
    recommendedCapabilityKeys: ["learning", "crm", "documents", "customer_portal"],
    recommendedWorkflowKeys: ["customer_onboarding", "case_resolution"],
    recommendedPersonaKeys: ["specialist", "coordinator", "department_manager"],
  }),
  purpose("manage_properties", "Manage properties", "Leases, tenants, maintenance, and facilities.", {
    applicableIndustries: ["property_and_facilities", "real_estate"],
    applicableSpecialistDomains: ["property_management", "facilities_management"],
    recommendedCapabilityKeys: ["asset_registry", "maintenance", "contracts", "crm"],
    recommendedWorkflowKeys: ["work_order_execution", "contract_review_and_approval"],
    recommendedPersonaKeys: ["coordinator", "technician", "supervisor"],
  }),
  purpose("rent_equipment", "Rent equipment", "Availability, booking, condition evidence, and returns.", {
    applicableSpecialistDomains: ["equipment_rental", "construction_project_controls"],
    recommendedCapabilityKeys: ["asset_registry", "inventory", "contracts", "crm"],
    recommendedWorkflowKeys: ["equipment_rental_cycle", "inspection_to_corrective_action"],
    recommendedPersonaKeys: ["coordinator", "technician", "supervisor"],
  }),
  purpose("operate_logistics", "Operate logistics", "Shipments, routing, and warehouse coordination.", {
    applicableIndustries: ["logistics_and_fleet", "retail_and_commerce"],
    recommendedCapabilityKeys: ["dispatch", "warehouse", "shipment_tracking", "fleet"],
    recommendedWorkflowKeys: ["dispatch_and_delivery", "procure_to_receive"],
    recommendedPersonaKeys: ["dispatcher", "driver", "coordinator"],
  }),
  purpose("manufacture_goods", "Manufacture goods", "Production planning, quality, and supply coordination.", {
    applicableIndustries: ["manufacturing_and_industrial"],
    recommendedCapabilityKeys: ["inventory", "maintenance", "quality_management", "procurement"],
    recommendedWorkflowKeys: ["work_order_execution", "procure_to_receive"],
    recommendedPersonaKeys: ["supervisor", "technician", "procurement_specialist"],
  }),
  purpose("manage_contractors", "Manage contractors", "Vendor onboarding, compliance, and work packages.", {
    applicableIndustries: ["construction_and_epc", "energy_and_utilities"],
    recommendedCapabilityKeys: ["contractor_management", "contracts", "work_orders", "documents"],
    recommendedWorkflowKeys: ["crew_onboarding", "work_order_execution"],
    recommendedPersonaKeys: ["supervisor", "procurement_specialist", "coordinator"],
  }),
  purpose("run_customer_support", "Run customer support", "Service desk, SLAs, and knowledge-assisted resolution.", {
    applicableIndustries: ["technology_and_saas", "retail_and_commerce"],
    applicableSpecialistDomains: ["customer_support_operations"],
    recommendedCapabilityKeys: ["customer_service", "case_management", "crm"],
    recommendedWorkflowKeys: ["case_resolution"],
    recommendedPersonaKeys: ["coordinator", "specialist", "customer"],
  }),
  purpose("manage_research", "Manage research", "Studies, samples, evidence, and publication readiness.", {
    applicableIndustries: ["healthcare_administration", "education_and_training"],
    applicableSpecialistDomains: ["research_and_labs"],
    recommendedCapabilityKeys: ["documents", "case_management", "quality_management"],
    recommendedWorkflowKeys: ["case_resolution", "inspection_to_corrective_action"],
    recommendedPersonaKeys: ["specialist", "supervisor"],
  }),
  purpose("operate_multi_branch_services", "Operate multi-branch services", "Branch network with shared policies and local execution.", {
    applicableIndustries: ["retail_and_commerce", "healthcare_administration", "hospitality_and_venues"],
    recommendedCapabilityKeys: ["organization_structure", "crm", "inventory", "work_orders"],
    recommendedWorkflowKeys: ["request_and_approval", "case_resolution"],
    recommendedPersonaKeys: ["department_manager", "supervisor", "coordinator"],
  }),
  purpose("build_a_marketplace", "Build a marketplace", "Multi-sided platform with listings, orders, and trust controls.", {
    applicableIndustries: ["technology_and_saas", "retail_and_commerce"],
    recommendedCapabilityKeys: ["crm", "contracts", "payments", "customer_portal", "case_management"],
    recommendedWorkflowKeys: ["customer_onboarding", "request_and_approval"],
    recommendedPersonaKeys: ["coordinator", "finance_specialist", "supervisor"],
    riskConsiderations: ["Separate payment approval from payment execution", "Define dispute resolution ownership early"],
  }),
];

export function getBusinessPurpose(key: string): BusinessPurposeDefinition | undefined {
  return BUSINESS_PURPOSE_CATALOG.find((p) => p.key === key);
}

export function listBusinessPurposes(): readonly BusinessPurposeDefinition[] {
  return BUSINESS_PURPOSE_CATALOG;
}
