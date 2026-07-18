/**
 * Shared local-first answer fixtures including Stage 4–7 depth (D7).
 */

import type { DiscoveryMvpAnswerMap } from "@/lib/discovery/discovery-mvp-d3-types";

/** Stage 4–7 answers shared across NEW/TRANSFORM complete fixtures. */
export function stageFourToSevenBaseAnswers(
  journey: "NEW" | "TRANSFORM",
): DiscoveryMvpAnswerMap {
  const stage4: DiscoveryMvpAnswerMap = {
    sensitive_data_types: "Customer contacts, invoices, employee schedules — categories only.",
    identity_access_concerns: "Branch managers need privileged access; shared mailboxes are a concern.",
    approval_risk_areas: "Purchase approvals and overtime approvals stall without clear SoD.",
    audit_requirements: "Annual internal audit of purchase-to-pay.",
    compliance_regulation_notes: "Local labor rules and customer data retention policies apply.",
    segregation_of_duties_concerns: "Requester must not also approve and pay the same purchase.",
    operational_risk_areas: "Dispatch outages and dual-entry of work orders across tools.",
    security_priorities: "Protect customer and employee data; reduce shared credentials.",
    trust_constraints: "No unrestricted third-party data export.",
    trust_risk_priority: "medium",
  };

  const stage6: DiscoveryMvpAnswerMap = {
    evidence_title: "Ops overview reference",
    evidence_type: "process_doc",
    evidence_reference_description: "https://example.com/ops-overview — share link only, no upload.",
    evidence_related_question_keys: "main_workflows, approval_risk_areas",
    evidence_availability_status: "available",
    evidence_not_available_reason: "",
    evidence_local_metadata_note: "Local operator tag: verify link freshness.",
  };

  const stage7: DiscoveryMvpAnswerMap = {
    stage7_missing_information_notes: "Confirm regional finance approvers by name.",
    stage7_critical_blockers_notes: "None blocking local modeling if Stage 4–6 remain filled.",
    stage7_clarification_questions_local: "Who owns CMMS cutover decisions?",
    stage7_trust_risk_flags_notes: "Shared mailbox access remains a trust flag.",
    stage7_evidence_gaps_notes: "No formal SoD policy URL yet.",
    stage7_modeling_readiness_self_check: "ready_for_review",
    stage7_handoff_readiness_notes: "Handoff package may be prepared after D5 ready-for-modeling.",
    stage7_operator_notes_local: "Operator: follow up on evidence SoD doc.",
  };

  if (journey === "NEW") {
    return {
      ...stage4,
      target_launch_model: "phased",
      initial_operating_capabilities: "Sales pipeline, project delivery, and invoice-to-cash.",
      first_teams_to_activate: "Delivery pod and founder-led finance support.",
      required_go_live_readiness: "Roles named, core workflows documented, accounting package selected.",
      expected_constraints_new: "Lean budget for first two quarters.",
      new_business_foundation_risks: "Licensing and brand launch timing risks.",
      ...stage6,
      ...stage7,
    };
  }

  return {
    ...stage4,
    current_state_problems:
      "Approvals stall in email and work-in-progress is invisible across branches.",
    legacy_system_constraints: "Legacy CMMS cannot expose real-time APIs without a middleware project.",
    process_change_goals: "Governed purchase and overtime approvals with clear SoD.",
    migration_concerns: "Dual-run of CMMS and new tracker for one quarter.",
    change_readiness_notes: "Field crews need short training windows between jobs.",
    target_state_improvements: "Single work-in-progress view and faster approval cycles.",
    ...stage6,
    ...stage7,
  };
}

export function completeTransformAnswersD7(): DiscoveryMvpAnswerMap {
  return {
    organization_display_name: "Acme Field Services",
    primary_contact_role: "Operations director",
    purpose_mission: "Deliver reliable field maintenance for commercial properties nationwide.",
    build_transform_objective: "Unify approvals and project delivery across regional branches.",
    transformation_target:
      "Replace spreadsheet approvals with governed workflows while keeping field crews productive.",
    industry_sector: "Facilities services",
    organization_size_range: "TEAM_51_200",
    location_model: "MULTI_BRANCH",
    branch_site_count: 12,
    department_division_scope: "Operations, Finance, HR, and regional branch management.",
    customer_beneficiary_type: "Commercial property managers",
    key_teams_or_groups: "Field crews, dispatch, finance, branch managers.",
    core_responsibilities:
      "Dispatch schedules work; finance invoices; managers approve overtime and purchases.",
    main_workflows: "Work order to close, purchase to pay, hire to onboard.",
    current_systems_tools: "Excel, email, legacy CMMS, QuickBooks.",
    important_records_data: "Work orders, invoices, employee schedules, vendor contracts.",
    major_pain_points:
      "Approvals stall in email; no single view of work-in-progress across branches.",
    evidence_reference_note: "https://example.com/ops-overview",
    ...stageFourToSevenBaseAnswers("TRANSFORM"),
  };
}

export function completeNewAnswersD7(): DiscoveryMvpAnswerMap {
  return {
    organization_display_name: "Northwind Launch Co",
    primary_contact_role: "Founder",
    purpose_mission: "Launch a new specialty contracting business with clear operating roles.",
    build_transform_objective: "Design an operating model ready for first 20 employees.",
    expected_operating_start: "Q4 2026 target window",
    industry_sector: "Specialty contracting",
    organization_size_range: "TEAM_6_20",
    location_model: "SINGLE_SITE",
    branch_site_count: 0,
    department_division_scope: "Delivery, sales, and finance at launch.",
    customer_beneficiary_type: "Commercial builders",
    key_teams_or_groups: "Delivery pod, sales, finance support.",
    core_responsibilities: "Delivery owns jobs; sales owns pipeline; finance owns billing.",
    main_workflows: "Lead to award, project delivery, invoice to cash.",
    target_systems_intent: "Lightweight CRM, project tracker, accounting package.",
    important_records_data: "Contracts, job files, invoices.",
    ...stageFourToSevenBaseAnswers("NEW"),
  };
}
