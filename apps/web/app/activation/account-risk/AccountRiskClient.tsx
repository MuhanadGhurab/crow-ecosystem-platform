"use client";

import { useState } from "react";
import type { ActivationResource } from "@ghuravia/contracts/schemas";
import { ActivationPageFrame } from "../_components/ActivationPageFrame";

const RISK_VERSION = "local-test-risk-v0";

export function AccountRiskClient({
  initialResource,
}: {
  initialResource: ActivationResource;
}) {
  const [accepted, setAccepted] = useState(false);
  return (
    <ActivationPageFrame
      screenId="ACT-013"
      titleKey="act013Title"
      initialResource={initialResource}
    >
      {({ resource, command, msg, submitting, clearLogicalOp }) => (
        <>
          <aside role="note" className="legal-disclaimer">
            <p>{msg("act013Disclaimer")}</p>
            <p>{msg("act013Body")}</p>
            <p>
              {msg("act013VersionLabel")}: <span dir="ltr">{RISK_VERSION}</span>
            </p>
          </aside>
          {resource.gates.accountRiskAcceptable ? (
            <p role="status" data-major-state="risk-accepted">
              {msg("gateRisk")} ✓
            </p>
          ) : (
            <form
              data-major-state="risk-ready"
              onSubmit={(e) => {
                e.preventDefault();
                if (!accepted) return;
                void (async () => {
                  try {
                    await command(
                      "accept-risk",
                      { riskDisclosureVersion: RISK_VERSION },
                      {
                        fingerprint: `accept-risk:${RISK_VERSION}`,
                        newLogicalOp: false,
                      },
                    );
                    await command(
                      "activate",
                      {},
                      { fingerprint: "activate", newLogicalOp: true },
                    );
                    clearLogicalOp();
                    window.location.assign("/activation/complete");
                  } catch {
                    /* ErrorPanel via hook */
                  }
                })();
              }}
            >
              <label htmlFor="risk-accept">
                <input
                  id="risk-accept"
                  type="checkbox"
                  checked={accepted}
                  onChange={(e) => {
                    clearLogicalOp();
                    setAccepted(e.target.checked);
                  }}
                />{" "}
                {msg("act013Checkbox")}
              </label>
              <p>
                <button type="submit" disabled={submitting || !accepted}>
                  {msg("act013Accept")}
                </button>
              </p>
            </form>
          )}
          <nav aria-label="activation">
            <a href="/activation/complete">{msg("act006Title")}</a>
          </nav>
        </>
      )}
    </ActivationPageFrame>
  );
}
