"use client";

import { useActionState } from "react";
import Link from "next/link";
import {
  recordReacceptance,
  updateMarketingConsent,
  type LegalActionState,
} from "@/lib/actions/account-legal";
import { legalDocumentPublicPath } from "@/lib/legal/legal-urls";
import { routes } from "@/lib/routes";
import type { PendingReacceptance } from "@/lib/legal/legal-acceptance.service";

const initialState: LegalActionState = {};

type AcceptanceRow = {
  id: string;
  acceptedAt: Date;
  acceptedLocale: string;
  acceptanceMethod: string;
  legalDocumentVersion: {
    title: string;
    locale: string;
    versionNumber: number;
    legalDocument: { documentType: string };
  };
};

type Props = {
  acceptances: AcceptanceRow[];
  pendingReacceptance: PendingReacceptance[];
  marketingGranted: boolean;
  showReacceptBanner: boolean;
};

function formatDocType(type: string): string {
  return type.replace(/_/g, " ");
}

export function AccountLegalPanel({
  acceptances,
  pendingReacceptance,
  marketingGranted,
  showReacceptBanner,
}: Props) {
  const [consentState, consentAction, consentPending] = useActionState(
    updateMarketingConsent,
    initialState
  );
  const [reacceptState, reacceptAction, reacceptPending] = useActionState(
    recordReacceptance,
    initialState
  );

  const requiredPending = pendingReacceptance.filter(
    (p) => p.currentVersionId !== p.acceptedVersionId
  );

  return (
    <div className="space-y-8">
      {showReacceptBanner && requiredPending.length > 0 && (
        <div
          className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-4"
          role="alert"
        >
          <h2 className="text-sm font-semibold text-amber-200">
            Updated legal documents require your acceptance
          </h2>
          <p className="mt-1 text-sm text-amber-100/80">
            Please review and accept the updated documents below before continuing
            protected activities.
          </p>
        </div>
      )}

      {reacceptState?.error && (
        <p className="text-sm text-red-400" role="alert">
          {reacceptState.error}
        </p>
      )}
      {reacceptState?.message && (
        <p className="text-sm text-emerald-400" role="status">
          {reacceptState.message}
        </p>
      )}

      {requiredPending.length > 0 && (
        <section className="cc-glass-card rounded-xl border border-white/10 p-6">
          <h2 className="text-lg font-semibold text-white">Pending reacceptance</h2>
          <ul className="mt-4 space-y-4">
            {requiredPending.map((item) => (
              <li
                key={item.documentType}
                className="flex flex-col gap-3 border-b border-white/10 pb-4 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium text-white">{item.title}</p>
                  <p className="text-xs text-white/50">
                    {formatDocType(item.documentType)} · v{item.versionNumber}
                  </p>
                  <Link
                    href={legalDocumentPublicPath(item.documentType, item.currentVersionId)}
                    className="mt-1 inline-block text-sm text-cyan-400 hover:text-cyan-300"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View full document
                  </Link>
                </div>
                <form action={reacceptAction}>
                  <input type="hidden" name="versionId" value={item.currentVersionId} />
                  <button
                    type="submit"
                    disabled={reacceptPending}
                    className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-500 disabled:opacity-50"
                  >
                    {reacceptPending ? "Recording…" : "Accept updated version"}
                  </button>
                </form>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="cc-glass-card rounded-xl border border-white/10 p-6">
        <h2 className="text-lg font-semibold text-white">Acceptance history</h2>
        {acceptances.length === 0 ? (
          <p className="mt-3 text-sm text-white/60">No recorded acceptances.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-white/60">
                  <th className="pb-2 pr-4 font-medium">Document</th>
                  <th className="pb-2 pr-4 font-medium">Version</th>
                  <th className="pb-2 pr-4 font-medium">Locale</th>
                  <th className="pb-2 pr-4 font-medium">Accepted</th>
                  <th className="pb-2 font-medium">Method</th>
                </tr>
              </thead>
              <tbody>
                {acceptances.map((row) => (
                  <tr key={row.id} className="border-b border-white/5 text-white/80">
                    <td className="py-3 pr-4">
                      {row.legalDocumentVersion.title}
                      <span className="ml-2 text-xs text-white/40">
                        ({formatDocType(row.legalDocumentVersion.legalDocument.documentType)})
                      </span>
                    </td>
                    <td className="py-3 pr-4">v{row.legalDocumentVersion.versionNumber}</td>
                    <td className="py-3 pr-4">{row.acceptedLocale}</td>
                    <td className="py-3 pr-4">
                      {new Date(row.acceptedAt).toLocaleString()}
                    </td>
                    <td className="py-3">{row.acceptanceMethod}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="cc-glass-card rounded-xl border border-white/10 p-6">
        <h2 className="text-lg font-semibold text-white">Marketing communications</h2>
        <p className="mt-2 text-sm text-white/60">
          Optional consent for product updates and marketing emails. Withdrawing consent does
          not affect your account access.
        </p>
        {consentState?.error && (
          <p className="mt-2 text-sm text-red-400" role="alert">
            {consentState.error}
          </p>
        )}
        {consentState?.message && (
          <p className="mt-2 text-sm text-emerald-400" role="status">
            {consentState.message}
          </p>
        )}
        <form action={consentAction} className="mt-4 flex flex-wrap items-center gap-4">
          <input type="hidden" name="granted" value={marketingGranted ? "false" : "true"} />
          <p className="text-sm text-white/80">
            Status:{" "}
            <span className={marketingGranted ? "text-emerald-400" : "text-white/50"}>
              {marketingGranted ? "Opted in" : "Not opted in"}
            </span>
          </p>
          <button
            type="submit"
            disabled={consentPending}
            className="rounded-lg border border-white/20 px-4 py-2 text-sm text-white hover:bg-white/5 disabled:opacity-50"
          >
            {consentPending
              ? "Saving…"
              : marketingGranted
                ? "Withdraw marketing consent"
                : "Opt in to marketing emails"}
          </button>
        </form>
      </section>

      <p className="text-xs text-white/40">
        Organization-level agreements and ERP declarations are separate from these platform
        terms. See{" "}
        <Link href={routes.account.profile} className="text-cyan-400 hover:underline">
          account profile
        </Link>{" "}
        for account status.
      </p>
    </div>
  );
}
