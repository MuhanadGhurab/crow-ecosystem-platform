/** Static fallbacks when Prisma / DB is unavailable */

export const MOCK_WORKSPACE_SUMMARY = {
  auditLogCount: 1247,
  securityEventCount: 38,
  sareaProfileCount: 6,
  profileCount: 142,
  departmentCount: 12,
  roleCount: 28,
  workflowCount: 8,
  openTaskCount: 6,
  cybercrowInitialized: true,
  cybercrowInitializedAt: null as Date | null,
} as const;

export const MOCK_CYBERCROW_DASHBOARD = {
  riskScore: 72,
  riskTrend: "down" as const,
  compliancePct: 94,
  openIncidents: 2,
  mfaCoverage: 98,
  privilegedSessions: 4,
  recentEvents: [
    { id: "1", action: "Policy sync completed", severity: "info", at: "2m ago" },
    { id: "2", action: "Failed login threshold", severity: "medium", at: "18m ago" },
    { id: "3", action: "RBAC role assignment", severity: "info", at: "1h ago" },
    { id: "4", action: "Compliance control attested", severity: "low", at: "3h ago" },
  ],
  controls: [
    { key: "NCA-ECC-1.1", status: "compliant", pct: 100 },
    { key: "NCA-ECC-2.3", status: "in_progress", pct: 78 },
    { key: "NCA-ECC-4.2", status: "compliant", pct: 100 },
    { key: "NCA-ECC-5.1", status: "at_risk", pct: 62 },
  ],
} as const;
