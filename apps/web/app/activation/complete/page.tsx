"use client";

import { ActivationPageFrame } from "../_components/ActivationPageFrame";

export default function CompletePage() {
  return (
    <ActivationPageFrame screenId="ACT-006" titleKey="act006Title">
      {({ resource, msg }) => (
        <>
          {resource.state === "ACTIVATED" ? (
            <p role="status" aria-live="polite">
              {msg("act006Success")}
            </p>
          ) : (
            <p role="status">{msg("act003NotVerifiedYet")}</p>
          )}
          <p>{msg("act006MobileOptionalNote")}</p>
          <p>
            <a className="primary-link" href="/activation/mobile-optional">
              {msg("act006Continue")}
            </a>
          </p>
          <nav aria-label="activation">
            <a href="/activation/recovery">{msg("act012Title")}</a>
          </nav>
        </>
      )}
    </ActivationPageFrame>
  );
}
