"use client";

import type { ActivationResource } from "@ghuravia/contracts/schemas";
import { ActivationPageFrame } from "../_components/ActivationPageFrame";

export function CompleteClient({
  initialResource,
}: {
  initialResource: ActivationResource;
}) {
  return (
    <ActivationPageFrame
      screenId="ACT-006"
      titleKey="act006Title"
      initialResource={initialResource}
    >
      {({ resource, msg }) => (
        <>
          {resource.state === "ACTIVATED" ? (
            <p role="status" aria-live="polite" data-major-state="complete">
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
