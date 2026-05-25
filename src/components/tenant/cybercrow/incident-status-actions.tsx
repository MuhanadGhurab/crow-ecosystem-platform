"use client";

import { useActionState } from "react";
import {
  updateIncidentStatusAction,
  type CybercrowActionState,
} from "@/lib/actions/cybercrow";
import { INCIDENT_STATUS, incidentStatusLabel, normalizeIncidentStatus } from "@/lib/constants/cybercrow-incident-status";

type Props = {
  tenantSlug: string;
  incidentId: string;
  currentStatus: string;
};

export function IncidentStatusActions({ tenantSlug, incidentId, currentStatus }: Props) {
  const [state, formAction, pending] = useActionState<CybercrowActionState, FormData>(
    updateIncidentStatusAction,
    undefined
  );
  const normalized = normalizeIncidentStatus(currentStatus);

  const buttons: { status: (typeof INCIDENT_STATUS)[keyof typeof INCIDENT_STATUS]; label: string }[] =
    [];

  if (normalized === INCIDENT_STATUS.open) {
    buttons.push(
      { status: INCIDENT_STATUS.under_review, label: "Acknowledge (under review)" },
      { status: INCIDENT_STATUS.resolved, label: "Resolve" }
    );
  } else if (normalized === INCIDENT_STATUS.under_review) {
    buttons.push(
      { status: INCIDENT_STATUS.resolved, label: "Resolve" },
      { status: INCIDENT_STATUS.open, label: "Return to open" }
    );
  } else if (normalized === INCIDENT_STATUS.resolved) {
    buttons.push({ status: INCIDENT_STATUS.reopened, label: "Reopen" });
  } else if (normalized === INCIDENT_STATUS.reopened) {
    buttons.push(
      { status: INCIDENT_STATUS.under_review, label: "Under review" },
      { status: INCIDENT_STATUS.resolved, label: "Resolve" }
    );
  }

  return (
    <div className="mt-2 space-y-2">
      <p className="text-xs text-slate-500">
        Status: <span className="text-violet-300">{incidentStatusLabel(currentStatus)}</span>
      </p>
      <div className="flex flex-wrap gap-2">
        {buttons.map((b) => (
          <form key={b.status} action={formAction}>
            <input type="hidden" name="tenantSlug" value={tenantSlug} />
            <input type="hidden" name="incidentId" value={incidentId} />
            <input type="hidden" name="status" value={b.status} />
            <button
              type="submit"
              disabled={pending}
              className="cc-btn-secondary text-xs disabled:opacity-50"
            >
              {b.label}
            </button>
          </form>
        ))}
      </div>
      {state?.error ? <p className="text-xs text-rose-400">{state.error}</p> : null}
      {state?.success ? <p className="text-xs text-teal-400">{state.success}</p> : null}
    </div>
  );
}
