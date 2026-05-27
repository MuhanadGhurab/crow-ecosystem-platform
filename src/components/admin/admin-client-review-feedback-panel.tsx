import Link from "next/link";
import {
  CLIENT_REVIEW_NOTE_EVENT_TYPES,
  CLIENT_REVIEW_NOTE_TYPE_LABELS,
} from "@/lib/client-portal/client-review-notes-contract";
import { listAdminClientReviewFeedback } from "@/lib/services/client-review-notes.service";
import { routes } from "@/lib/routes";

export async function AdminClientReviewFeedbackPanel({ requestId }: { requestId: string }) {
  const feedback = await listAdminClientReviewFeedback(requestId);

  if (feedback.length === 0) {
    return (
      <section className="cc-glass-card space-y-2">
        <h2 className="text-sm font-semibold text-slate-200">Client review feedback</h2>
        <p className="text-sm text-slate-500">
          No client review notes or change requests recorded for this request yet. Feedback is stored
          in the platform notification inbox (no separate messaging product).
        </p>
        <Link href={routes.admin.notifications} className="cc-btn-secondary text-sm">
          Open notification inbox
        </Link>
      </section>
    );
  }

  const changeCount = feedback.filter(
    (f) => f.eventType === CLIENT_REVIEW_NOTE_EVENT_TYPES.requestChanges
  ).length;

  return (
    <section className="cc-glass-card space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-slate-200">Client review feedback</h2>
        <span className="text-xs text-slate-500">
          {feedback.length} item{feedback.length === 1 ? "" : "s"}
          {changeCount > 0 ? ` · ${changeCount} change request${changeCount === 1 ? "" : "s"}` : ""}
        </span>
      </div>
      <p className="text-xs text-slate-500">
        ProCrow controls proposal status, onboarding, and provisioning. Client feedback does not
        auto-approve scope or activate payment.
      </p>
      <ul className="space-y-2">
        {feedback.map((f) => (
          <li
            key={f.id}
            className="rounded-lg border border-white/5 bg-slate-900/40 px-3 py-2 text-sm"
          >
            <div className="flex flex-wrap gap-2 text-xs text-slate-500">
              <span className="font-medium text-cyan-300/90">
                {f.eventType === CLIENT_REVIEW_NOTE_EVENT_TYPES.requestChanges
                  ? "Change request"
                  : CLIENT_REVIEW_NOTE_TYPE_LABELS[f.noteType]}
              </span>
              <span>·</span>
              <span>{new Date(f.createdAt).toLocaleString()}</span>
              <span>·</span>
              <span>Inbox: {f.inboxStatus}</span>
            </div>
            {f.authorEmail && (
              <p className="mt-1 text-xs text-slate-500">From: {f.authorEmail}</p>
            )}
            <p className="mt-2 whitespace-pre-wrap text-slate-300">{f.bodyPreview}</p>
            <p className="mt-2 text-xs text-amber-200/80">{f.procrowNextAction}</p>
          </li>
        ))}
      </ul>
      <Link href={routes.admin.notifications} className="cc-btn-secondary text-sm">
        Triage in notification inbox
      </Link>
    </section>
  );
}
