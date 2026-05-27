"use client";

import { useState, useTransition } from "react";
import {
  requestClientProposalChangesAction,
  submitClientReviewNoteAction,
} from "@/lib/actions/client-review-notes";
import {
  CLIENT_REVIEW_NOTE_DISCLAIMER,
  CLIENT_REVIEW_NOTE_REQUEST_CHANGES_DISCLAIMER,
  CLIENT_REVIEW_NOTE_TYPE_LABELS,
  type ClientRequestChangesEligibility,
  type ClientReviewNoteSummary,
  type ClientReviewNoteType,
} from "@/lib/client-portal/client-review-notes-contract";

const NOTE_TYPES: ClientReviewNoteType[] = [
  "general_note",
  "blueprint_question",
  "scope_clarification",
  "onboarding_question",
];

export function ClientReviewFeedbackPanel({
  eligibility,
  notes,
  defaultProposalId,
  defaultBlueprintId,
}: {
  eligibility: ClientRequestChangesEligibility;
  notes: ClientReviewNoteSummary[];
  defaultProposalId?: string | null;
  defaultBlueprintId?: string | null;
}) {
  const [pending, startTransition] = useTransition();
  const [noteType, setNoteType] = useState<ClientReviewNoteType>("general_note");
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState<{ tone: "ok" | "err"; text: string } | null>(null);

  const requestId = eligibility.requestId;
  if (!requestId) return null;

  const showForm = eligibility.canSubmitReviewNote;
  const showRequestChanges = eligibility.canRequestChanges;

  return (
    <section className="cc-glass-card border-cyan-500/15 bg-cyan-500/5 space-y-4">
      <div>
        <h2 className="text-sm font-semibold text-cyan-200">Review feedback for ProCrow</h2>
        <p className="mt-2 text-sm text-slate-400">{CLIENT_REVIEW_NOTE_DISCLAIMER}</p>
        {eligibility.noteOnlyMode && eligibility.canSubmitReviewNote && (
          <p className="mt-2 text-sm text-amber-200/90">
            Reviewer mode: you can send notes. Official request-changes requires verified owner or
            approver access.
          </p>
        )}
        {!showForm && eligibility.blockedMessage && (
          <p className="mt-2 text-sm text-amber-200/90">{eligibility.blockedMessage}</p>
        )}
      </div>

      {notes.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Your submitted feedback
          </p>
          <ul className="space-y-2">
            {notes.map((n) => (
              <li
                key={n.id}
                className="rounded-lg border border-white/5 bg-slate-900/40 px-3 py-2 text-sm"
              >
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span>{CLIENT_REVIEW_NOTE_TYPE_LABELS[n.type]}</span>
                  <span>·</span>
                  <span>{new Date(n.submittedAt).toLocaleString()}</span>
                  <span>·</span>
                  <span className="capitalize">{n.status.replace(/_/g, " ")}</span>
                </div>
                <p className="mt-1 text-slate-300">{n.messagePreview}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {feedback && (
        <p
          className={`text-sm ${feedback.tone === "ok" ? "text-teal-300" : "text-rose-300"}`}
          role="status"
        >
          {feedback.text}
        </p>
      )}

      {showForm && (
        <div className="space-y-3">
          <label className="block text-xs font-medium text-slate-500">
            Note type
            <select
              className="cc-input mt-1 w-full"
              value={noteType}
              onChange={(e) => setNoteType(e.target.value as ClientReviewNoteType)}
              disabled={pending}
            >
              {NOTE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {CLIENT_REVIEW_NOTE_TYPE_LABELS[t]}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-xs font-medium text-slate-500">
            Message for ProCrow
            <textarea
              className="cc-input mt-1 min-h-[100px] w-full"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={pending}
              placeholder="Describe questions, clarifications, or changes you want ProCrow to review."
            />
          </label>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              disabled={pending}
              className="cc-btn-secondary text-sm disabled:opacity-50"
              onClick={() =>
                startTransition(async () => {
                  setFeedback(null);
                  const result = await submitClientReviewNoteAction({
                    requestId,
                    proposalId: defaultProposalId,
                    blueprintId: defaultBlueprintId,
                    type: noteType,
                    message,
                  });
                  setFeedback({ tone: result.ok ? "ok" : "err", text: result.message });
                  if (result.ok) {
                    setMessage("");
                    window.location.reload();
                  }
                })
              }
            >
              {pending ? "Sending…" : "Send review note to ProCrow"}
            </button>
            {showRequestChanges && (
              <button
                type="button"
                disabled={pending}
                className="cc-btn-primary text-sm disabled:opacity-50"
                onClick={() =>
                  startTransition(async () => {
                    setFeedback(null);
                    const result = await requestClientProposalChangesAction({
                      requestId,
                      proposalId: defaultProposalId,
                      blueprintId: defaultBlueprintId,
                      message,
                    });
                    setFeedback({ tone: result.ok ? "ok" : "err", text: result.message });
                    if (result.ok) {
                      setMessage("");
                      window.location.reload();
                    }
                  })
                }
              >
                {pending ? "Submitting…" : "Request changes for ProCrow review"}
              </button>
            )}
          </div>
          {showRequestChanges && (
            <p className="text-xs text-slate-500">{CLIENT_REVIEW_NOTE_REQUEST_CHANGES_DISCLAIMER}</p>
          )}
        </div>
      )}
    </section>
  );
}
