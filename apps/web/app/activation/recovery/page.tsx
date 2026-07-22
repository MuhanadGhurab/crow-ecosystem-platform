"use client";

import { ActivationPageFrame } from "../_components/ActivationPageFrame";

export default function RecoveryPage() {
  return (
    <ActivationPageFrame screenId="ACT-012" titleKey="act012Title">
      {({ resource, command, msg, submitting }) => (
        <>
          <p>{msg("act012Body")}</p>
          <p role="status">
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
