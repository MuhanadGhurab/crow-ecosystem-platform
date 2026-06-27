"use client";

export type SaveStatus = "unsaved" | "saving" | "saved" | "failed" | "conflict";

export function SaveStatusIndicator({ status, message }: { status: SaveStatus; message?: string | null }) {
  const labels: Record<SaveStatus, string> = {
    unsaved: "Unsaved changes",
    saving: "Saving your design…",
    saved: "Saved",
    failed: "Save failed",
    conflict: "Conflict detected — refresh and review",
  };
  const colors: Record<SaveStatus, string> = {
    unsaved: "text-slate-400",
    saving: "text-cyan-400",
    saved: "text-emerald-400",
    failed: "text-red-400",
    conflict: "text-amber-400",
  };

  return (
    <p
      role="status"
      aria-live="polite"
      aria-busy={status === "saving"}
      className={`text-xs font-medium ${colors[status]}`}
    >
      {message ?? labels[status]}
    </p>
  );
}
