"use client";

import type { ActivationResource } from "@ghuravia/contracts/schemas";
import { ActivationPageFrame } from "../_components/ActivationPageFrame";

export function RecoveryClient({
  initialResource,
}: {
  initialResource: ActivationResource;
}) {
  return (
    <ActivationPageFrame
      screenId="ACT-012"
      titleKey="act012Title"
      initialResource={initialResource}
    >
      {({ resource, command, msg, submitting }) => (
        <>
          <p>{msg("act012Body")}</p>
          <p role="status" data-major-state="recovery">
            <span dir="ltr">{resource.state}</span>
          </p>
          <p>
            <button
              type="button"
              disabled={submitting}
              onClick={() => void command("recover").catch(() => undefined)}
            >
              {msg("act012Recover")}
            </button>
          </p>
          <p>
            <button
              type="button"
              disabled={submitting}
              onClick={() => void command("resend").catch(() => undefined)}
            >
              {msg("act012Resend")}
            </button>
          </p>
          <nav aria-label="activation">
            <a href="/activation/email-pending">{msg("act003Title")}</a>
            {" · "}
            <a href="/activation/terms">{msg("act005Title")}</a>
            {" · "}
            <a href="/activation/account-risk">{msg("act013Title")}</a>
          </nav>
        </>
      )}
    </ActivationPageFrame>
  );
}
