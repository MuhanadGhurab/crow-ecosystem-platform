"use client";

import { useState } from "react";
import type { ActivationResource } from "@ghuravia/contracts/schemas";
import { ActivationPageFrame } from "../_components/ActivationPageFrame";

export function EmailResultClient({
  initialResource,
}: {
  initialResource: ActivationResource | null;
}) {
  const [token, setToken] = useState("");
  return (
    <ActivationPageFrame
      screenId="ACT-011"
      titleKey="act011Title"
      initialResource={initialResource}
      allowBootstrap
    >
      {({ resource, command, msg, submitting, clearLogicalOp }) => (
        <>
          {resource.gates.emailVerified ? (
            <p role="status" data-major-state="verified">
              {msg("act011SuccessNext")}
            </p>
          ) : (
            <form
              data-major-state="token-entry"
              onSubmit={(e) => {
                e.preventDefault();
                void command(
                  "confirm-email",
                  { token },
                  {
                    fingerprint: `confirm-email:${token}`,
                    newLogicalOp: false,
                  },
                )
                  .then(() => {
                    clearLogicalOp();
                    setToken("");
                  })
                  .catch(() => undefined);
              }}
            >
              <label htmlFor="token">{msg("act011TokenLabel")}</label>
              <input
                id="token"
                name="token"
                dir="ltr"
                autoComplete="one-time-code"
                value={token}
                onChange={(e) => {
                  clearLogicalOp();
                  setToken(e.target.value);
                }}
                aria-describedby="token-help"
                required
              />
              <p id="token-help" className="help">
                {msg("act003Body")}
              </p>
              <button type="submit" disabled={submitting || !token}>
                {msg("act011Confirm")}
              </button>
            </form>
          )}
          <nav aria-label="activation">
            <a href="/activation/terms">{msg("act005Title")}</a>
            {" · "}
            <a href="/activation/recovery">{msg("act012Title")}</a>
          </nav>
        </>
      )}
    </ActivationPageFrame>
  );
}
