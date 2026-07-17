"use client";

import { useState, useTransition } from "react";
import { clientBlueprintReviewAction } from "@/lib/actions/persistent-blueprint";

export function ClientBlueprintReviewPanel(props: {
  requestId: string;
  versionNumber: number;
  contentHash: string;
  rowVersion: number;
}) {
  const [comment, setComment] = useState("");
  const [rowVersion, setRowVersion] = useState(props.rowVersion);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, start] = useTransition();

  return (
    <section className="space-y-3 rounded border border-slate-200 p-4">
      <h2 className="text-sm font-semibold text-slate-900">Review actions</h2>
      <p className="text-xs text-slate-600">
        Exact version {props.versionNumber} · {props.contentHash.slice(0, 12)}…
      </p>
      <textarea
        className="w-full rounded border border-slate-300 p-2 text-sm"
        rows={3}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Comment (optional)"
      />
      <div className="flex flex-wrap gap-2">
        {(["CLIENT_COMMENT", "CLIENT_REQUEST_CHANGES", "CLIENT_ACCEPT"] as const).map((action) => (
          <button
            key={action}
            type="button"
            disabled={pending}
            className="rounded bg-slate-900 px-3 py-1.5 text-xs text-white disabled:opacity-50"
            onClick={() => {
              setMessage(null);
              start(async () => {
                const result = await clientBlueprintReviewAction({
                  requestId: props.requestId,
                  action,
                  versionNumber: props.versionNumber,
                  contentHashAtAction: props.contentHash,
                  expectedRowVersion: rowVersion,
                  comment: comment || null,
                  confirmed: action === "CLIENT_ACCEPT" ? window.confirm("Accept this exact Blueprint version?") : true,
                });
                if (result.ok) {
                  setRowVersion((v) => v + 1);
                  setMessage(`Recorded: ${action}`);
                } else {
                  setMessage(result.error);
                }
              });
            }}
          >
            {action.replace("CLIENT_", "").toLowerCase().replace("_", " ")}
          </button>
        ))}
      </div>
      {message && <p className="text-xs text-amber-800">{message}</p>}
    </section>
  );
}
