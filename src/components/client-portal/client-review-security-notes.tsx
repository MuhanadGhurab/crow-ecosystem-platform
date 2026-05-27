import type { ClientReviewSecurityNote } from "@/lib/client-portal/client-review-contract";

export function ClientReviewSecurityNotes({ notes }: { notes: ClientReviewSecurityNote[] }) {
  if (notes.length === 0) return null;

  return (
    <section className="cc-glass-card space-y-3">
      <h2 className="text-sm font-semibold text-white">Security & trust</h2>
      <ul className="space-y-3">
        {notes.map((note) => (
          <li
            key={note.id}
            className={
              note.severity === "warning"
                ? "rounded-lg border border-amber-500/25 bg-amber-500/5 px-3 py-2"
                : "rounded-lg border border-slate-700/60 bg-slate-900/40 px-3 py-2"
            }
          >
            <p className="text-sm font-medium text-slate-200">{note.label}</p>
            <p className="mt-1 text-sm text-slate-400">{note.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
