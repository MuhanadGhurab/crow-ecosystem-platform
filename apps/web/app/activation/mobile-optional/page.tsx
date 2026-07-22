"use client";

import { useState } from "react";
import { ActivationPageFrame } from "../_components/ActivationPageFrame";

export default function MobileOptionalPage() {
  const [deferredNote, setDeferredNote] = useState(false);
  return (
    <ActivationPageFrame screenId="ACT-007" titleKey="act007Title">
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
