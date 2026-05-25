"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  dismissSecurityEventAction,
  escalateSecurityEventAction,
  markSecurityEventReviewedAction,
  type CybercrowActionState,
} from "@/lib/actions/cybercrow";
import { routes } from "@/lib/routes";
import type { SecurityEventReviewStatus } from "@/lib/services/cybercrow-mutations.service";

type Props = {
  tenantSlug: string;
  eventId: string;
  severity: string;
  reviewStatus: SecurityEventReviewStatus;
  escalatedIncidentId?: string | null;
  escalatedIncidentTitle?: string | null;
  recommendedAction?: string;
};

export function SecurityEventReviewActions({
  tenantSlug,
  eventId,
  severity,
  reviewStatus,
  escalatedIncidentId,
  escalatedIncidentTitle,
  recommendedAction,
}: Props) {
  const incidentsHref = routes.tenant(tenantSlug).cybercrow.incidents;
  const [reviewState, reviewAction, reviewPending] = useActionState<CybercrowActionState, FormData>(
    markSecurityEventReviewedAction,
    undefined
  );
  const [dismissState, dismissAction, dismissPending] = useActionState<CybercrowActionState, FormData>(
    dismissSecurityEventAction,
    undefined
  );
  const [escalateState, escalateAction, escalatePending] = useActionState<CybercrowActionState, FormData>(
    escalateSecurityEventAction,
    undefined
  );

  const pending = reviewPending || dismissPending || escalatePending;
  const feedback = reviewState?.error ?? dismissState?.error ?? escalateState?.error;
  const success = reviewState?.success ?? dismissState?.success ?? escalateState?.success;

  if (reviewStatus === "escalated" && escalatedIncidentId) {
    return (
      <div className="mt-2 space-y-1 text-xs">
        <p className="text-amber-300">
          Escalated — duplicate escalation is blocked.
          {escalatedIncidentTitle ? (
            <>
              {" "}
              Incident: <span className="text-white">{escalatedIncidentTitle}</span>
            </>
          ) : null}
        </p>
        <Link href={incidentsHref} className="text-violet-400 hover:text-violet-300">
          Open incidents →
        </Link>
      </div>
    );
  }

  if (reviewStatus === "dismissed") {
    return (
      <p className="mt-2 text-xs text-slate-500">
        Dismissed (informational) — remains in catalog for auditability.
      </p>
    );
  }

  if (reviewStatus === "reviewed") {
    return (
      <p className="mt-2 text-xs text-teal-400">
        Reviewed — monitor or escalate if impact grows.
      </p>
    );
  }

  const canDismiss = severity === "info" || severity === "low";

  return (
    <div className="mt-2 space-y-2">
      {recommendedAction ? (
        <p className="text-xs text-slate-500">
          <span className="text-violet-300/90">Recommended:</span> {recommendedAction}
        </p>
      ) : null}
      <div className="flex flex-wrap gap-2">
      <form action={reviewAction}>
        <input type="hidden" name="tenantSlug" value={tenantSlug} />
        <input type="hidden" name="eventId" value={eventId} />
        <button type="submit" disabled={pending} className="cc-btn-secondary text-xs disabled:opacity-50">
          Mark reviewed
        </button>
      </form>
      {canDismiss ? (
        <form action={dismissAction}>
          <input type="hidden" name="tenantSlug" value={tenantSlug} />
          <input type="hidden" name="eventId" value={eventId} />
          <button type="submit" disabled={pending} className="cc-btn-secondary text-xs disabled:opacity-50">
            Dismiss
          </button>
        </form>
      ) : null}
      <form action={escalateAction}>
        <input type="hidden" name="tenantSlug" value={tenantSlug} />
        <input type="hidden" name="eventId" value={eventId} />
        <button type="submit" disabled={pending} className="cc-btn-secondary text-xs disabled:opacity-50">
          Escalate to incident
        </button>
      </form>
      {feedback ? <p className="w-full text-xs text-rose-400">{feedback}</p> : null}
      {success ? <p className="w-full text-xs text-teal-400">{success}</p> : null}
      </div>
    </div>
  );
}
