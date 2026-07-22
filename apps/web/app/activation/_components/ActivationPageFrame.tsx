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
}: {
  screenId: GovernedScreenId;
  titleKey: MessageKey;
  children: (ctx: FrameContext) => ReactNode;
}) {
  const { msg } = useLocale();
  const ctx = useActivation(screenId);
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
      <p data-screen-id={screenId} className="sr-meta" dir="ltr">
        {screenId}
      </p>
      {loading ? <p aria-live="polite">{msg("loading")}</p> : null}
      {submitting ? <p aria-live="polite">{msg("submitting")}</p> : null}
      {error ? (
        <ErrorPanel message={error} correlationId={correlationId} />
      ) : null}
      {!resource ? (
        <SessionBootstrap
          onReady={() =>
            void ensureSession().catch(() => setError(msg("errUnauthorized")))
          }
        />
      ) : !access.allowed ? (
        <p role="status" data-access-blocked="true">
          {msg("loading")}
        </p>
      ) : (
        <>
          <ExplainableLocks resource={resource} />
          {children({ ...ctx, resource, msg })}
        </>
      )}
    </ActivationShell>
  );
}
