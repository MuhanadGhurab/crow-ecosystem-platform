"use client";

import { useState } from "react";
import type { ActivationResource } from "@ghuravia/contracts/schemas";
import { ActivationPageFrame } from "../_components/ActivationPageFrame";

export function EmailPendingClient({
  initialResource,
}: {
  initialResource: ActivationResource | null;
}) {
  const [deliveryNote, setDeliveryNote] = useState(false);
  return (
    <ActivationPageFrame
      screenId="ACT-003"
      titleKey="act003Title"
      initialResource={initialResource}
      allowBootstrap
    >
      {({ resource, command, msg, submitting }) => (
        <>
          <p>{msg("act003Body")}</p>
          <p role="status" data-major-state="pending">
            {msg("act003NotVerifiedYet")} ·{" "}
            <span dir="ltr">{resource.state}</span>
          </p>
          {deliveryNote ? (
            <p role="status" data-major-state="delivery-accepted">
              {msg("act003DeliveryAccepted")}
            </p>
          ) : null}
          <p>
            <button
              type="button"
              disabled={submitting || resource.gates.emailVerified}
              onClick={() => {
                setDeliveryNote(false);
                void command("request-email", {}, { newLogicalOp: true })
                  .then(() => setDeliveryNote(true))
                  .catch(() => undefined);
              }}
            >
              {msg("act003Request")}
            </button>
          </p>
          <p>
            <button
              type="button"
              disabled={submitting || resource.gates.emailVerified}
              onClick={() => {
                setDeliveryNote(false);
                void command("resend", {}, { newLogicalOp: true })
                  .then(() => setDeliveryNote(true))
                  .catch(() => undefined);
              }}
            >
              {msg("act003Resend")}
            </button>
          </p>
          <p>
            <a href="/dev/local-tools">{msg("act003OpenMailboxDev")}</a>
          </p>
          <nav aria-label="activation">
            <a href="/activation/email-result">{msg("act011Title")}</a>
            {" · "}
            <a href="/activation/recovery">{msg("act012Title")}</a>
          </nav>
        </>
      )}
    </ActivationPageFrame>
  );
}
