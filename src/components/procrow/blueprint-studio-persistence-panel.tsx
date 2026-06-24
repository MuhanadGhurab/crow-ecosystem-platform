"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { persistBlueprintInternalDraftAction, listPersistableRequestsForStudio } from "@/lib/actions/persistent-blueprint";
import type { EnterpriseBlueprintDraft } from "@/lib/model-forge/blueprint/blueprint-types";
import { routes } from "@/lib/routes";

type RequestOption = Awaited<ReturnType<typeof listPersistableRequestsForStudio>>[number];

export function BlueprintStudioPersistencePanel(props: {
  draft: EnterpriseBlueprintDraft | null;
  requests: RequestOption[];
}) {
  const [requestId, setRequestId] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, start] = useTransition();

  if (!props.draft) return null;

  const readiness =
    props.draft.provenanceSummary.unexplainedCount === 0
      ? "READY_FOR_HUMAN_BLUEPRINT_REVIEW"
      : "BLOCKED";

  return (
    <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 space-y-3">
      <h3 className="text-sm font-semibold text-amber-200">Save as Internal Draft</h3>
      <p className="text-xs text-slate-400">
        Persists an immutable version. Client visibility remains INTERNAL. No tenant provisioning or authority changes.
      </p>
      <label className="block text-xs text-slate-400">
        Implementation request (explicit selection required)
        <select
          className="mt-1 w-full rounded border border-slate-700 bg-slate-900 px-2 py-1.5 text-sm text-white"
          value={requestId}
          onChange={(e) => setRequestId(e.target.value)}
        >
          <option value="">Select request…</option>
          {props.requests.map((r) => (
            <option key={r.id} value={r.id} disabled={Boolean(r.enterpriseBlueprint)}>
              {r.referenceCode} — {r.organizationName}
              {r.enterpriseBlueprint ? " (has blueprint)" : ""}
            </option>
          ))}
        </select>
      </label>
      <dl className="grid grid-cols-2 gap-2 text-xs text-slate-400">
        <div>Content hash</div>
        <div className="font-mono text-cyan-300">{props.draft.metadata.contentHash}</div>
        <div>Review readiness</div>
        <div>{readiness}</div>
        <div>Client visibility</div>
        <div>INTERNAL</div>
        <div>Side effects</div>
        <div>NONE</div>
      </dl>
      <label className="flex items-center gap-2 text-xs text-slate-300">
        <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} />
        I confirm persistence of this exact preview snapshot as an internal draft.
      </label>
      <button
        type="button"
        disabled={pending || !requestId || !confirmed || readiness === "BLOCKED"}
        className="cc-btn-primary text-sm disabled:opacity-50"
        onClick={() => {
          setMessage(null);
          start(async () => {
            const result = await persistBlueprintInternalDraftAction({
              requestId,
              draft: props.draft!,
              expectedContentHash: props.draft!.metadata.contentHash,
              confirmed,
            });
            if (result.ok) {
              window.location.href = routes.admin.persistentBlueprint(result.blueprintId);
              return;
            }
            setMessage(result.error);
          });
        }}
      >
        {pending ? "Saving…" : "Save as Internal Draft"}
      </button>
      {message && <p className="text-xs text-red-400">{message}</p>}
      <p className="text-xs text-slate-500">
        After save, manage lifecycle at{" "}
        <Link href={routes.admin.blueprints} className="text-cyan-400 underline">
          persistent Blueprints
        </Link>
        .
      </p>
    </div>
  );
}
