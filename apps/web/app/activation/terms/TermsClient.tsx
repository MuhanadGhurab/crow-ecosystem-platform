"use client";

import { useState } from "react";
import type { ActivationResource } from "@ghuravia/contracts/schemas";
import { ActivationPageFrame } from "../_components/ActivationPageFrame";

const TERMS_VERSION = "local-test-terms-v0";

export function TermsClient({
  initialResource,
}: {
  initialResource: ActivationResource;
}) {
  const [accepted, setAccepted] = useState(false);
  const [validationError, setValidationError] = useState(false);
  return (
    <ActivationPageFrame
      screenId="ACT-005"
      titleKey="act005Title"
      initialResource={initialResource}
    >
      {({ resource, command, msg, submitting, clearLogicalOp }) => (
        <>
          <aside role="note" className="legal-disclaimer">
            <p>{msg("act005Disclaimer")}</p>
            <p>
              {msg("act005VersionLabel")}:{" "}
              <span dir="ltr">{TERMS_VERSION}</span>
            </p>
          </aside>
          {validationError ? (
            <div
              role="alert"
              className="error-summary"
              tabIndex={-1}
              id="error-summary"
              data-major-state="terms-validation-error"
            >
              <h2>{msg("errorSummary")}</h2>
              <p>{msg("errValidation")}</p>
            </div>
          ) : null}
          {resource.gates.termsAccepted ? (
            <p role="status" data-major-state="terms-accepted">
              {msg("gateTerms")} ✓
            </p>
          ) : (
            <form
              data-major-state="terms-ready"
              onSubmit={(e) => {
                e.preventDefault();
                if (!accepted) {
                  setValidationError(true);
                  queueMicrotask(() => {
                    document.getElementById("error-summary")?.focus();
                  });
                  return;
                }
                setValidationError(false);
                void command(
                  "accept-terms",
                  { termsVersion: TERMS_VERSION },
                  {
                    fingerprint: `accept-terms:${TERMS_VERSION}`,
                    newLogicalOp: false,
                  },
                )
                  .then(() => clearLogicalOp())
                  .catch(() => undefined);
              }}
            >
              <label htmlFor="terms-accept">
                <input
                  id="terms-accept"
                  type="checkbox"
                  checked={accepted}
                  onChange={(e) => {
                    clearLogicalOp();
                    setAccepted(e.target.checked);
                    if (e.target.checked) setValidationError(false);
                  }}
                />{" "}
                {msg("act005Checkbox")}
              </label>
              <p>
                <button type="submit" disabled={submitting}>
                  {msg("act005Accept")}
                </button>
              </p>
            </form>
          )}
          <nav aria-label="activation">
            <a href="/activation/account-risk">{msg("act013Title")}</a>
          </nav>
        </>
      )}
    </ActivationPageFrame>
  );
}
