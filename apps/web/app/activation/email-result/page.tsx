"use client";

import { useState } from "react";
import { ActivationPageFrame } from "../_components/ActivationPageFrame";

export default function EmailResultPage() {
  const [token, setToken] = useState("");
  return (
    <ActivationPageFrame screenId="ACT-011" titleKey="act011Title">
      {({ resource, command, msg, submitting, clearLogicalOp }) => (
        <>
          {resource.gates.emailVerified ? (
            <p role="status">{msg("act011SuccessNext")}</p>
          ) : (
            <form
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
