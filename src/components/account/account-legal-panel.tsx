"use client";

import { useActionState } from "react";
import Link from "next/link";
import {
  recordReacceptance,
  updateMarketingConsent,
  type LegalActionState,
} from "@/lib/actions/account-legal";
import { CyberCrowSecurityTrustPanel } from "@/components/trust/cybercrow-security-trust-panel";
import type { LegalDocumentType } from "@prisma/client";
import { LEGAL_DOCUMENT_SLUGS, legalDocumentPublicPath } from "@/lib/legal/legal-urls";

function asLegalDocumentType(documentType: string): LegalDocumentType {
  if (documentType in LEGAL_DOCUMENT_SLUGS) {
    return documentType as LegalDocumentType;
  }
  throw new Error(`Unknown legal document type: ${documentType}`);
}
import { routes } from "@/lib/routes";
import type { PendingReacceptance } from "@/lib/legal/legal-acceptance.service";
import type { LegalContactPlaceholderKey } from "@/lib/legal/legal-contact-config";

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

type CurrentDocumentRow = {
  documentType: string;
  title: string;
  versionNumber: number;
  versionId: string;
  contentSha256: string;
  hashValid: boolean;
  effectiveAt: string;
  acceptedVersionNumber: number | null;
  acceptedAt: string | null;
  reacceptanceRequired: boolean;
};

type Props = {
  acceptances: AcceptanceRow[];
  pendingReacceptance: PendingReacceptance[];
  marketingGranted: boolean;
  showReacceptBanner: boolean;
  currentDocuments: CurrentDocumentRow[];
  contactConfigurationStatus: Record<LegalContactPlaceholderKey, "configured" | "placeholder">;
};

function formatDocType(type: string): string {
  return type.replace(/_/g, " ");
}

function truncateHash(hash: string): string {
  return hash.length > 16 ? `${hash.slice(0, 12)}…${hash.slice(-8)}` : hash;
}

export function AccountLegalPanel({
  acceptances,
  pendingReacceptance,
  marketingGranted,
  showReacceptBanner,
  currentDocuments,
  contactConfigurationStatus,
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

  const contactsPending = Object.values(contactConfigurationStatus).some(
    (s) => s === "placeholder"
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
            protected activities. Prior acceptance records are preserved.
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

      <section className="cc-glass-card rounded-xl border border-white/10 p-6">
        <h2 className="text-lg font-semibold text-white">Current mandatory documents</h2>
        <p className="mt-1 text-sm text-white/60">
          Mandatory Terms, Privacy Notice, and Acceptable Use Policy. Contractual documents cannot
          be withdrawn while you use protected services.
        </p>
        <ul className="mt-4 space-y-4">
          {currentDocuments.map((doc) => (
            <li
              key={doc.documentType}
              className="border-b border-white/10 pb-4 last:border-0 last:pb-0"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-medium text-white">{doc.title}</p>
                  <p className="text-xs text-white/50">
                    {formatDocType(doc.documentType)} · v{doc.versionNumber} · effective{" "}
                    {new Date(doc.effectiveAt).toLocaleDateString()}
                  </p>
                  <p className="mt-1 text-xs text-white/40">
                    Integrity:{" "}
                    <span className={doc.hashValid ? "text-emerald-400" : "text-red-400"}>
                      {doc.hashValid ? "hash verified" : "hash mismatch — contact support"}
                    </span>
                    {" · "}
                    SHA-256 {truncateHash(doc.contentSha256)}
                  </p>
                  {doc.acceptedVersionNumber != null ? (
                    <p className="mt-1 text-xs text-white/50">
                      Accepted: v{doc.acceptedVersionNumber}
                      {doc.acceptedAt
                        ? ` · ${new Date(doc.acceptedAt).toLocaleString()}`
                        : null}
                    </p>
                  ) : (
                    <p className="mt-1 text-xs text-amber-300">Not yet accepted</p>
                  )}
                  {doc.reacceptanceRequired && (
                    <p className="mt-1 text-xs font-medium text-amber-300">
                      Reacceptance required
                    </p>
                  )}
                  <Link
                    href={legalDocumentPublicPath(asLegalDocumentType(doc.documentType), doc.versionId)}
                    className="mt-2 inline-block text-sm text-cyan-400 hover:text-cyan-300"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View full document
                  </Link>
                </div>
                {doc.reacceptanceRequired && (
                  <form action={reacceptAction}>
                    <input type="hidden" name="versionId" value={doc.versionId} />
                    <button
                      type="submit"
                      disabled={reacceptPending}
                      className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-500 disabled:opacity-50"
                    >
                      {reacceptPending ? "Recording…" : "Accept current version"}
                    </button>
                  </form>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>

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
                    href={legalDocumentPublicPath(
                      asLegalDocumentType(item.documentType),
                      item.currentVersionId
                    )}
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

      <CyberCrowSecurityTrustPanel variant="compact" />

      <section className="cc-glass-card rounded-xl border border-white/10 p-6">
        <h2 className="text-lg font-semibold text-white">Acceptance history</h2>
        <p className="mt-1 text-xs text-white/50">
          Append-only evidence. Accepting a new version does not remove prior records.
        </p>
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
          not affect access to protected services or mandatory contractual terms.
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

      <section className="cc-glass-card rounded-xl border border-white/10 p-6">
        <h2 className="text-lg font-semibold text-white">Privacy &amp; data rights</h2>
        <p className="mt-2 text-sm text-white/60">
          Self-service data export and formal data-subject request workflows are not yet available
          in the account portal.
        </p>
        <p
          className="mt-3 inline-flex rounded-full bg-slate-500/20 px-3 py-1 text-xs font-medium text-slate-300"
          title="Data export and formal data-subject request submission will be available in a future release."
        >
          Data export requests — Planned
        </p>
        {contactsPending && (
          <p className="mt-3 text-xs text-amber-200/80">
            Legal contact addresses are not yet configured for production publication. Operator
            must set monitored contact environment variables before go-live.
          </p>
        )}
      </section>

      <p className="text-xs text-white/40">
        Organization-level agreements and ERP declarations are separate from these platform
        terms. Legal acceptance does not grant roles, tenant membership, billing, or production
        access. See{" "}
        <Link href={routes.account.profile} className="text-cyan-400 hover:underline">
          account profile
        </Link>{" "}
        for account status.
      </p>
    </div>
  );
}
