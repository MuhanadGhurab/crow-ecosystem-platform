"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { recordProcrowQualificationAction } from "@/lib/actions/admin-request-brief";
import {
  PROCROW_QUALIFICATION_OUTCOME_LABELS,
  type ProcrowQualification,
  type ProcrowQualificationOutcome,
} from "@/lib/procrow/procrow-qualification";
import { productStatusLabelForPersisted } from "@/lib/procrow/request-status-product-mapping";
import type { ImplementationRequestStatus } from "@/lib/types/platform";
import { PendingButton } from "@/components/ui/pending-button";

const OPERATOR_OUTCOMES: ProcrowQualificationOutcome[] = [
  "needs_more_information",
  "qualified_for_discovery",
  "declined",
  "needs_qualification_review",
];

export function AdminProcrowQualificationPanel({
  requestId,
  status,
  qualification,
}: {
  requestId: string;
  status: ImplementationRequestStatus;
  qualification: ProcrowQualification | null | undefined;
}) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [outcome, setOutcome] = useState<ProcrowQualificationOutcome>(
    qualification?.outcome ?? "needs_qualification_review",
  );

  const canRecord = status === "PENDING_REVIEW";
  const productLabel = productStatusLabelForPersisted(status, qualification);

  return (
    <section className="cc-glass-card space-y-4 border border-cyan-500/20">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-cyan-200">ProCrow qualification</h3>
        <span className="rounded-full bg-cyan-500/10 px-2 py-0.5 text-xs text-cyan-300">
          Product-layer · no tenant authority
        </span>
      </div>

      <ul className="list-disc space-y-1 pl-5 text-xs text-slate-400">
        <li>Qualification is not tenant membership or Blueprint approval.</li>
        <li>Decline keeps the request record — it does not delete data.</li>
        <li>Discovery starts only after “Qualified for Discovery” — never from mere submission.</li>
        <li>Payment and CroAI are not involved.</li>
      </ul>

      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-slate-500">Product status</dt>
          <dd className="text-white">{productLabel}</dd>
        </div>
        <div>
          <dt className="text-slate-500">DB status</dt>
          <dd className="font-mono text-xs text-slate-300">{status}</dd>
        </div>
        {qualification && (
          <>
            <div>
              <dt className="text-slate-500">Recorded outcome</dt>
              <dd className="text-emerald-300">
                {PROCROW_QUALIFICATION_OUTCOME_LABELS[qualification.outcome]}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">Recorded at</dt>
              <dd className="text-slate-300">{new Date(qualification.recordedAt).toLocaleString()}</dd>
            </div>
            {qualification.operatorNote && (
              <div className="sm:col-span-2">
                <dt className="text-slate-500">Operator note</dt>
                <dd className="text-slate-200">{qualification.operatorNote}</dd>
              </div>
            )}
          </>
        )}
      </dl>

      {canRecord ? (
        <form
          className="space-y-3"
          action={(fd) => {
            setMessage(null);
            startTransition(async () => {
              const res = await recordProcrowQualificationAction(requestId, fd);
              if (res.ok) {
                setMessage("Qualification outcome saved.");
                router.refresh();
              } else {
                setMessage(res.error);
              }
            });
          }}
        >
          <label className="block text-sm text-slate-300">
            Outcome
            <select
              name="outcome"
              value={outcome}
              onChange={(e) => setOutcome(e.target.value as ProcrowQualificationOutcome)}
              className="input-cc mt-2"
              required
            >
              {OPERATOR_OUTCOMES.map((key) => (
                <option key={key} value={key}>
                  {PROCROW_QUALIFICATION_OUTCOME_LABELS[key]}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm text-slate-300">
            Operator note (optional)
            <textarea
              name="operatorNote"
              rows={3}
              className="input-cc mt-2"
              placeholder="Internal note — more info needed, decline rationale, or handoff context"
              defaultValue={qualification?.operatorNote ?? ""}
            />
          </label>
          <PendingButton pending={pending} pendingLabel="Saving…" type="submit" className="cc-btn-primary">
            Save qualification outcome
          </PendingButton>
          {outcome === "declined" && (
            <p className="text-xs text-amber-300/90">
              Declined sets DB status to REJECTED and preserves the request brief. Record is not deleted.
            </p>
          )}
          {outcome === "qualified_for_discovery" && (
            <p className="text-xs text-cyan-300/90">
              After save, use Start Discovery in Pipeline actions. That handoff does not provision a tenant
              or generate a Blueprint.
            </p>
          )}
        </form>
      ) : (
        <p className="text-sm text-slate-500">
          Qualification outcomes can be recorded while the request is in PENDING_REVIEW.
        </p>
      )}

      {message && (
        <p className="text-sm text-slate-300" role="status">
          {message}
        </p>
      )}
    </section>
  );
}
