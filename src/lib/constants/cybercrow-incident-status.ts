/** Canonical incident workflow statuses (stored lowercase in `incidents.status`). */
export const INCIDENT_STATUS = {
  open: "open",
  under_review: "under_review",
  resolved: "resolved",
  reopened: "reopened",
} as const;

export type IncidentStatusValue = (typeof INCIDENT_STATUS)[keyof typeof INCIDENT_STATUS];

export const INCIDENT_STATUS_LABELS: Record<IncidentStatusValue, string> = {
  open: "Open",
  under_review: "Under review",
  resolved: "Resolved",
  reopened: "Reopened",
};

const ALIASES: Record<string, IncidentStatusValue> = {
  open: INCIDENT_STATUS.open,
  "under review": INCIDENT_STATUS.under_review,
  under_review: INCIDENT_STATUS.under_review,
  underreview: INCIDENT_STATUS.under_review,
  in_progress: INCIDENT_STATUS.under_review,
  investigating: INCIDENT_STATUS.under_review,
  resolved: INCIDENT_STATUS.resolved,
  closed: INCIDENT_STATUS.resolved,
  reopened: INCIDENT_STATUS.reopened,
  reopen: INCIDENT_STATUS.reopened,
};

export function normalizeIncidentStatus(raw: string): IncidentStatusValue {
  const key = raw.trim().toLowerCase().replace(/\s+/g, "_");
  const direct = ALIASES[key] ?? ALIASES[raw.trim().toLowerCase()];
  if (direct) return direct;
  return INCIDENT_STATUS.open;
}

export function incidentStatusLabel(status: string): string {
  const normalized = normalizeIncidentStatus(status);
  return INCIDENT_STATUS_LABELS[normalized];
}

export function isOpenIncidentStatus(status: string): boolean {
  const n = normalizeIncidentStatus(status);
  return n === INCIDENT_STATUS.open || n === INCIDENT_STATUS.reopened;
}
