"use client";

import { useState, useTransition } from "react";

import { resolveProcrowRequestFieldAction } from "@/lib/actions/admin-request-brief";
import { getBusinessField } from "@/lib/business-field-catalog/fields";
import type { ClientServiceRequestBrief } from "@/lib/client-service-request/types";
import { PendingButton } from "@/components/ui/pending-button";

export function AdminFieldResolutionPanel({
  requestId,
  brief,
  fieldOptions,
}: {
  requestId: string;
  brief: ClientServiceRequestBrief;
  fieldOptions: Array<{ key: string; label: string }>;
}) {
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [canonicalFieldKey, setCanonicalFieldKey] = useState(
    brief.procrowFieldResolution?.reviewedCanonicalFieldKey ?? "",
  );

  if (brief.fieldResolutionStatus !== "CUSTOM_UNRESOLVED" && !brief.customFieldDescription) {
    return null;
  }

  return (
    <section className="cc-glass-card space-y-4 border border-amber-500/20">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-amber-200">ProCrow field review</h3>
        <span className="text-xs text-slate-500">ProCrow review</span>
      </div>

      {brief.customFieldSuggestedMatches.length > 0 && (
        <p className="text-xs text-slate-400">
          Suggested matches:{" "}
          {brief.customFieldSuggestedMatches
            .map((k) => getBusinessField(k)?.displayNameEn ?? k)
            .join(", ")}
        </p>
      )}

      {brief.procrowFieldResolution && (
        <p className="text-sm text-emerald-300" role="status">
          Resolved to {getBusinessField(brief.procrowFieldResolution.reviewedCanonicalFieldKey ?? "")?.displayNameEn ?? brief.procrowFieldResolution.reviewedCanonicalFieldKey}
          {" · "}
          client wording preserved below.
        </p>
      )}

      <form
        className="space-y-3"
        action={(fd) => {
          setMessage(null);
          startTransition(async () => {
            fd.set("originalClientDescription", brief.customFieldDescription ?? brief.originalClientStatement ?? "");
            fd.set("suggestedCatalogMatches", brief.customFieldSuggestedMatches.join(","));
            const res = await resolveProcrowRequestFieldAction(requestId, fd);
            setMessage(res.ok ? "Field mapping saved internally." : res.error);
          });
        }}
      >
        <label className="block text-sm text-slate-300">
          Reviewed canonical field
          <select
            name="canonicalFieldKey"
            value={canonicalFieldKey}
            onChange={(e) => setCanonicalFieldKey(e.target.value)}
            className="input-cc mt-2"
            required
          >
            <option value="">Select catalog field…</option>
            {fieldOptions.map((o) => (
              <option key={o.key} value={o.key}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm text-slate-300">
          Review note (internal)
          <textarea name="reviewerNote" className="input-cc mt-2" rows={2} placeholder="Optional rationale…" />
        </label>
        <PendingButton pending={pending} pendingLabel="Saving review…" type="submit">
          Save field resolution
        </PendingButton>
        {message && (
          <p className="text-sm text-slate-300" role="status" aria-live="polite">
            {message}
          </p>
        )}
      </form>
    </section>
  );
}
