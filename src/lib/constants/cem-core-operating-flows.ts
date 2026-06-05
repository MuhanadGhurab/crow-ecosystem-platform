import type { CemOperatingFlow } from "@/lib/cem/cem-operating-model-contract";

/** Advisory cross-module operating flows — M3.1 core ERP spine model. */
export const CEM_CORE_OPERATING_FLOWS: readonly Omit<
  CemOperatingFlow,
  "readiness"
>[] = [
  {
    key: "employee_onboarding",
    label: "Employee onboarding",
    description:
      "HR captures workforce intent → users/roles assigned → SAREA profile adapts → tasks track completion → reports summarize headcount → CyberCrow access review observes identity posture.",
    modulesInvolved: ["hr", "users", "roles", "tasks", "reports"],
    departmentsInvolved: ["hr", "operations"],
    rolesInvolved: ["hr_manager", "department_head", "employee"],
    workflowKeys: ["employee_onboarding", "access_provisioning"],
    taskExamples: ["Complete HR profile", "Assign role & department", "Access review checkpoint"],
    reportingOutputs: ["Headcount roll-up", "Onboarding completion rate"],
    cyberCrowEvidence: ["Access review readiness", "Identity linkage audit context"],
    sareaExperienceImpact: [
      "New hire dashboard widgets",
      "HR module nav prominence",
      "Task inbox for onboarding steps",
    ],
  },
  {
    key: "purchase_to_stock",
    label: "Purchase-to-stock",
    description:
      "Department request → procurement requisition → finance approval → inventory/warehouse receiving → operational reports → CyberCrow evidence for financial controls.",
    modulesInvolved: ["procurement", "finance", "inventory", "warehouse", "reports"],
    departmentsInvolved: ["procurement", "finance", "warehouse"],
    rolesInvolved: ["requester", "procurement_officer", "finance_approver", "warehouse_clerk"],
    workflowKeys: ["purchase_request", "goods_receipt"],
    taskExamples: ["Approve purchase order", "Receive goods", "Post inventory adjustment"],
    reportingOutputs: ["Spend by department", "Stock receipt summary"],
    cyberCrowEvidence: ["Approval trail context", "Financial control evidence posture"],
    sareaExperienceImpact: [
      "Procurement officer task queue",
      "Finance approval widgets",
      "Warehouse receiving shortcuts",
    ],
  },
  {
    key: "sales_to_delivery",
    label: "Sales-to-delivery",
    description:
      "CRM/Sales opportunity → inventory availability check → logistics delivery → finance invoice → executive reports.",
    modulesInvolved: ["crm", "sales", "inventory", "logistics", "finance", "reports"],
    departmentsInvolved: ["sales", "logistics", "finance"],
    rolesInvolved: ["sales_rep", "logistics_coordinator", "finance_clerk"],
    workflowKeys: ["quote_to_cash", "delivery_fulfillment"],
    taskExamples: ["Confirm stock allocation", "Schedule delivery", "Generate invoice draft"],
    reportingOutputs: ["Pipeline SAR", "Fulfillment SLA", "Revenue roll-up"],
    cyberCrowEvidence: ["Customer data handling context", "Invoice approval evidence"],
    sareaExperienceImpact: [
      "Sales rep pipeline view",
      "Logistics dispatch board",
      "Finance AR summary widgets",
    ],
  },
  {
    key: "task_workflow_execution",
    label: "Task & workflow execution",
    description:
      "Workflow template defines steps → tasks assigned to roles/departments → completion feeds reports and CyberCrow audit context.",
    modulesInvolved: ["workflows", "tasks", "reports"],
    departmentsInvolved: ["all_assigned"],
    rolesInvolved: ["task_owner", "approver", "manager"],
    workflowKeys: ["operational_templates"],
    taskExamples: ["Open workflow task", "Manager approval", "Close workflow cycle"],
    reportingOutputs: ["Open task aging", "Workflow throughput"],
    cyberCrowEvidence: ["Workflow action audit context", "Approval evidence linkage"],
    sareaExperienceImpact: [
      "Role-specific task inbox",
      "Workflow nav visibility",
      "Manager escalation widgets",
    ],
  },
  {
    key: "incident_exception",
    label: "Incident & exception",
    description:
      "Operational issue detected → task escalation → manager review → CyberCrow audit/evidence capture → report output for operator review.",
    modulesInvolved: ["tasks", "workflows", "reports"],
    departmentsInvolved: ["operations", "management"],
    rolesInvolved: ["operator", "manager", "security_liaison"],
    workflowKeys: ["exception_handling", "incident_review"],
    taskExamples: ["Escalate exception", "Manager sign-off", "Document resolution"],
    reportingOutputs: ["Exception log summary", "Resolution time advisory"],
    cyberCrowEvidence: ["Incident audit trail", "Access review tie-in for sensitive actions"],
    sareaExperienceImpact: [
      "Manager alert widgets",
      "Exception task prominence for liaisons",
    ],
  },
] as const;
