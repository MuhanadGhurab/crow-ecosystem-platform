"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import { submitRegistrationLegalFormAction } from "@/lib/actions/account-legal";
import { legalDocumentPublicPath } from "@/lib/legal/legal-urls";
import type { LegalDocumentType, MandatoryClassification } from "@prisma/client";
import { routes } from "@/lib/routes";
import { LegalDocumentPanel } from "./legal-document-panel";

export type MandatoryLegalDoc = {
  id: string;
  documentType: LegalDocumentType;
  title: string;
  versionNumber: number;
  locale: string;
  effectiveAt: Date | string;
  contentBody: string;
  mandatoryClassification: MandatoryClassification;
};

const DOC_LABELS: Partial<Record<LegalDocumentType, string>> = {
  TERMS_OF_SERVICE: "Terms of Service",
  PRIVACY_NOTICE: "Privacy Notice",
  ACCEPTABLE_USE_POLICY: "Acceptable Use Policy",
};

function LegalSubmitButton({
  canSubmit,
  allReviewed,
  checkboxesOk,
}: {
  canSubmit: boolean;
  allReviewed: boolean;
  checkboxesOk: boolean;
}) {
  const { pending } = useFormStatus();
  const disabled = !canSubmit || pending;

  return (
    <button
      type="submit"
      disabled={disabled}
      className="btn-cc-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
      aria-disabled={disabled}
    >
      {pending
        ? "Saving…"
        : !allReviewed
          ? "Read to the end to continue"
          : !checkboxesOk
            ? "Confirm required acknowledgements"
            : "Continue to email verification"}
    </button>
  );
}

export function LegalReviewGate({
  documents,
  locale,
  nextPath,
  showAccountFields = false,
  initialEmail = "",
  initialErrorBody,
  initialMessageBody,
}: {
  documents: MandatoryLegalDoc[];
  locale: string;
  nextPath?: string;
  showAccountFields?: boolean;
  initialEmail?: string;
  initialErrorBody?: string;
  initialMessageBody?: string;
}) {
  const [activeTab, setActiveTab] = useState(0);
  const [reviewedByType, setReviewedByType] = useState<Record<string, boolean>>({});

  const hasTerms = documents.some((d) => d.documentType === "TERMS_OF_SERVICE");
  const hasPrivacy = documents.some((d) => d.documentType === "PRIVACY_NOTICE");
  const hasAup = documents.some((d) => d.documentType === "ACCEPTABLE_USE_POLICY");

  const [termsChecked, setTermsChecked] = useState(false);
  const [privacyChecked, setPrivacyChecked] = useState(false);
  const [aupChecked, setAupChecked] = useState(false);

  const allReviewed = useMemo(
    () => documents.every((d) => reviewedByType[d.documentType]),
    [documents, reviewedByType]
  );

  const checkboxesOk =
    (!hasTerms || termsChecked) &&
    (!hasPrivacy || privacyChecked) &&
    (!hasAup || aupChecked);

  const canSubmit = allReviewed && checkboxesOk;

  if (documents.length === 0) {
    return (
      <div className="cc-alert-warning text-sm" role="alert">
        Legal documents are not available for your locale ({locale}). Contact support
        or try again later.
      </div>
    );
  }

  const activeDoc = documents[activeTab] ?? documents[0];

  return (
    <form action={submitRegistrationLegalFormAction} className="mt-6 space-y-6">
      {initialErrorBody && (
        <p className="cc-alert-warning whitespace-pre-line text-sm" role="alert">
          {initialErrorBody}
        </p>
      )}
      {initialMessageBody && !initialErrorBody && (
        <p className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 whitespace-pre-line px-3 py-2 text-sm text-cyan-100">
          {initialMessageBody}
        </p>
      )}

      <input type="hidden" name="locale" value={locale} />
      {nextPath ? <input type="hidden" name="next" value={nextPath} /> : null}

      {showAccountFields && (
        <fieldset className="space-y-4 border-b border-slate-700/50 pb-4">
          <legend className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Account details
          </legend>
          <div>
            <label htmlFor="reg-email" className="block text-xs font-medium text-slate-500">
              Email
            </label>
            <input
              id="reg-email"
              name="email"
              type="email"
              required
              readOnly={Boolean(initialEmail)}
              defaultValue={initialEmail}
              autoComplete="email"
              className="input-cc mt-1 w-full read-only:opacity-80"
            />
          </div>
          <div>
            <label htmlFor="reg-password" className="block text-xs font-medium text-slate-500">
              Password
            </label>
            <input
              id="reg-password"
              name="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              className="input-cc mt-1 w-full"
            />
          </div>
          <div>
            <label
              htmlFor="reg-password-confirm"
              className="block text-xs font-medium text-slate-500"
            >
              Confirm password
            </label>
            <input
              id="reg-password-confirm"
              name="passwordConfirm"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              className="input-cc mt-1 w-full"
            />
          </div>
        </fieldset>
      )}

      <div
        className="flex flex-wrap gap-2 border-b border-slate-700/50 pb-2"
        role="tablist"
        aria-label="Legal documents"
      >
        {documents.map((doc, index) => (
          <button
            key={doc.id}
            type="button"
            role="tab"
            aria-selected={index === activeTab}
            aria-controls={`legal-panel-${doc.documentType}`}
            id={`legal-tab-${doc.documentType}`}
            onClick={() => setActiveTab(index)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
              index === activeTab
                ? "bg-cyan-500/20 text-cyan-200"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            {DOC_LABELS[doc.documentType] ?? doc.title}
            {reviewedByType[doc.documentType] ? " ✓" : ""}
          </button>
        ))}
      </div>

      <div
        id={`legal-panel-${activeDoc.documentType}`}
        role="tabpanel"
        aria-labelledby={`legal-tab-${activeDoc.documentType}`}
      >
        <LegalDocumentPanel
          key={activeDoc.id}
          title={activeDoc.title}
          versionNumber={activeDoc.versionNumber}
          locale={activeDoc.locale}
          effectiveAt={activeDoc.effectiveAt}
          contentBody={activeDoc.contentBody}
          fullPageHref={legalDocumentPublicPath(activeDoc.documentType, activeDoc.id)}
          onReviewedChange={(reviewed) =>
            setReviewedByType((prev) => ({
              ...prev,
              [activeDoc.documentType]: reviewed,
            }))
          }
        />
      </div>

      <fieldset className="space-y-3 border-t border-slate-700/50 pt-4">
        <legend className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Required acknowledgements
        </legend>

        {hasTerms && (
          <label className="flex cursor-pointer items-start gap-2 text-sm text-slate-300">
            <input
              type="checkbox"
              name="termsAccepted"
              value="true"
              disabled={!reviewedByType.TERMS_OF_SERVICE}
              onChange={(e) => setTermsChecked(e.target.checked)}
              className="mt-1"
            />
            <span>
              I have read and accept the Terms of Service, including platform rules
              governing my use of Crow.
            </span>
          </label>
        )}

        {hasPrivacy && (
          <label className="flex cursor-pointer items-start gap-2 text-sm text-slate-300">
            <input
              type="checkbox"
              name="privacyAcknowledged"
              value="true"
              disabled={!reviewedByType.PRIVACY_NOTICE}
              onChange={(e) => setPrivacyChecked(e.target.checked)}
              className="mt-1"
            />
            <span>
              I acknowledge that I have read the Privacy Notice and understand how
              Crow processes my personal data.
            </span>
          </label>
        )}

        {hasAup && (
          <label className="flex cursor-pointer items-start gap-2 text-sm text-slate-300">
            <input
              type="checkbox"
              name="aupAccepted"
              value="true"
              disabled={!reviewedByType.ACCEPTABLE_USE_POLICY}
              onChange={(e) => setAupChecked(e.target.checked)}
              className="mt-1"
            />
            <span>I accept the Acceptable Use Policy.</span>
          </label>
        )}

        <label className="flex cursor-pointer items-start gap-2 text-sm text-slate-400">
          <input type="checkbox" name="marketingOptIn" value="true" className="mt-1" />
          <span>
            I agree to receive optional product and marketing emails from Crow. (Not
            required to create an account.)
          </span>
        </label>
      </fieldset>

      <LegalSubmitButton
        canSubmit={canSubmit}
        allReviewed={allReviewed}
        checkboxesOk={checkboxesOk}
      />

      <p className="text-center text-sm text-slate-500">
        Wrong account?{" "}
        <Link href={routes.auth.signOut} className="text-cyan-400 hover:text-cyan-300">
          Sign out
        </Link>
      </p>
    </form>
  );
}
