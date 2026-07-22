"use client";

import { useState } from "react";
import type { ActivationResource } from "@ghuravia/contracts/schemas";
import { ActivationPageFrame } from "../_components/ActivationPageFrame";

export function MobileOptionalClient({
  initialResource,
}: {
  initialResource: ActivationResource;
}) {
  const [deferredNote, setDeferredNote] = useState(false);
  return (
    <ActivationPageFrame
      screenId="ACT-007"
      titleKey="act007Title"
      initialResource={initialResource}
    >
      {({ msg }) => (
        <>
          <p>{msg("act007Body")}</p>
          <p className="optional-note">{msg("mobileOptionalLabel")}</p>
          {deferredNote ? (
            <p role="status">{msg("act007VerifyDeferred")}</p>
          ) : null}
          <p>
            <button type="button" onClick={() => setDeferredNote(true)}>
              {msg("act007VerifyDeferred")}
            </button>
          </p>
          <p>
            <a className="primary-link" href="/onboarding/entry">
              {msg("act007Skip")}
            </a>
          </p>
        </>
      )}
    </ActivationPageFrame>
  );
}
