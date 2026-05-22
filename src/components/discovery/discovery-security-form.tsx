"use client";

import { useState, useTransition } from "react";
import { SECURITY_PACKAGES } from "@/lib/constants/security-packages";
import { securityPackageLabel } from "@/lib/catalog-labels";
import { saveSecurityDiscovery } from "@/lib/actions/discovery";

export function DiscoverySecurityForm({
  requestId,
  requestedPackageKeys,
  initial,
}: {
  requestId: string;
  requestedPackageKeys: string[];
  initial: { complianceNotes: string; ncaAlignment: string };
}) {
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="cc-glass-card space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        const form = new FormData(e.currentTarget);
        startTransition(async () => {
          try {
            await saveSecurityDiscovery(requestId, {
              complianceNotes: String(form.get("complianceNotes")),
              ncaAlignment: String(form.get("ncaAlignment")),
            });
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
          } catch (err) {
            setError(err instanceof Error ? err.message : "Save failed");
          }
        });
      }}
    >
      <header>
        <h2 className="cc-section-title text-lg">Security & compliance</h2>
        <p className="mt-1 text-sm text-slate-400">
          Align CyberCrow packages with NCA-oriented controls for this engagement.
        </p>
      </header>

      <div className="rounded-cc-sm border border-cyan-500/10 bg-white/5 p-4">
        <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
          From implementation request
        </p>
        <ul className="mt-2 space-y-1 text-sm text-cyan-300">
          {requestedPackageKeys.length === 0 ? (
            <li className="text-slate-500">No security package selected</li>
          ) : (
            requestedPackageKeys.map((key) => (
              <li key={key}>
                {SECURITY_PACKAGES.find((p) => p.key === key)?.icon}{" "}
                {securityPackageLabel(key)}
              </li>
            ))
          )}
        </ul>
      </div>

      <label className="block text-sm text-slate-400">
        NCA / compliance posture
        <select name="ncaAlignment" required defaultValue={initial.ncaAlignment} className="input-cc mt-2">
          <option value="">Select…</option>
          <option value="baseline">Baseline alignment</option>
          <option value="enhanced">Enhanced controls</option>
          <option value="enterprise">Enterprise / regulated sector</option>
        </select>
      </label>

      <label className="block text-sm text-slate-400">
        Compliance notes
        <textarea
          name="complianceNotes"
          rows={4}
          defaultValue={initial.complianceNotes}
          className="input-cc mt-2"
          placeholder="Audit expectations, data residency, incident response…"
        />
      </label>

      <footer className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={pending} className="cc-btn-primary disabled:opacity-50">
          {pending ? "Saving…" : "Save security context"}
        </button>
        {saved && <span className="text-sm text-teal-300">Saved</span>}
        {error && <span className="text-sm text-red-400">{error}</span>}
      </footer>
    </form>
  );
}

