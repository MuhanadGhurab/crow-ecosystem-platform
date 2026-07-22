"use client";

import type { ReactNode } from "react";
import { SessionBootstrap, useActivation } from "./ActivationClient";
import {
  ActivationShell,
  ErrorPanel,
  ExplainableLocks,
} from "./ActivationShell";
import type { ActivationResource } from "@ghuravia/contracts/schemas";
import { useLocale } from "../../../lib/locale-context";
import type { GovernedScreenId } from "../../../lib/activation-routes";
import type { MessageKey } from "../../../lib/localization/messages";

type FrameContext = Omit<ReturnType<typeof useActivation>, "resource"> & {
  resource: ActivationResource;
  msg: (k: MessageKey) => string;
};

export function ActivationPageFrame({
  screenId,
  titleKey,
  children,
  initialResource = null,
  allowBootstrap = false,
}: {
  screenId: GovernedScreenId;
  titleKey: MessageKey;
  children: (ctx: FrameContext) => ReactNode;
  initialResource?: ActivationResource | null;
  /** Only ACT-003 / ACT-011 may offer synthetic session bootstrap. */
  allowBootstrap?: boolean;
}) {
  const { msg } = useLocale();
  const ctx = useActivation(screenId, { initialResource });
  const {
    resource,
    error,
    correlationId,
    loading,
    submitting,
    access,
    ensureSession,
    setError,
  } = ctx;

  return (
    <ActivationShell
      screenId={screenId}
      title={msg(titleKey)}
      resource={resource}
    >
      {loading ? <p aria-live="polite">{msg("loading")}</p> : null}
      {submitting ? <p aria-live="polite">{msg("submitting")}</p> : null}
      {error ? (
        <ErrorPanel message={error} correlationId={correlationId} />
      ) : null}
      {!resource ? (
        allowBootstrap ? (
          <>
            <p data-screen-id={screenId} className="sr-meta" dir="ltr">
              {screenId}
            </p>
            <SessionBootstrap
              onReady={() =>
                void ensureSession().catch(() =>
                  setError(msg("errUnauthorized")),
                )
              }
            />
          </>
        ) : (
          <p role="status" data-access-blocked="true">
            {msg("errUnauthorized")}
          </p>
        )
      ) : !access.allowed ? (
        <p role="status" data-access-blocked="true">
          {msg("loading")}
        </p>
      ) : (
        <>
          <p data-screen-id={screenId} className="sr-meta" dir="ltr">
            {screenId}
          </p>
          <ExplainableLocks resource={resource} />
          {children({ ...ctx, resource, msg })}
        </>
      )}
    </ActivationShell>
  );
}
