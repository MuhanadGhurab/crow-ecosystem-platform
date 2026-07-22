"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type {
  ActivationResource,
  ErrorCategory,
} from "@ghuravia/contracts/schemas";
import { useLocale } from "../../../lib/locale-context";
import { errorMessage } from "../../../lib/localization/format";
import {
  resolveIdempotencyKey,
  type IdempotencySlot,
} from "../../../lib/idempotency";
import {
  canAccessScreen,
  routeFor,
  type GovernedScreenId,
} from "../../../lib/activation-routes";

export type ApiError = {
  category: ErrorCategory | string;
  correlationId?: string;
};

async function apiJson<T>(
  path: string,
  init?: RequestInit & { idempotencyKey?: string },
): Promise<T> {
  const headers = new Headers(init?.headers);
  headers.set("Content-Type", "application/json");
  if (init?.idempotencyKey) {
    headers.set("Idempotency-Key", init.idempotencyKey);
  }
  const res = await fetch(path, { ...init, headers, credentials: "include" });
  let body: Record<string, unknown> = {};
  try {
    body = (await res.json()) as Record<string, unknown>;
  } catch {
    body = {};
  }
  if (!res.ok) {
    const err = new Error("API_ERROR") as Error & ApiError;
    err.category = String(body.category ?? "INTERNAL_ERROR");
    err.correlationId =
      typeof body.correlationId === "string" ? body.correlationId : undefined;
    throw err;
  }
  return body as T;
}

export function useActivation(
  screenId: GovernedScreenId,
  options?: { initialResource?: ActivationResource | null },
) {
  const router = useRouter();
  const { locale, msg } = useLocale();
  const initial = options?.initialResource ?? null;
  const [resource, setResource] = useState<ActivationResource | null>(initial);
  const [error, setError] = useState<string | null>(null);
  const [correlationId, setCorrelationId] = useState<string | undefined>();
  const [loading, setLoading] = useState(!initial);
  const [submitting, setSubmitting] = useState(false);
  const idempotencyRef = useRef<IdempotencySlot | null>(null);
  const lastCommandRef = useRef<string | null>(null);
  const resourceRef = useRef<ActivationResource | null>(initial);

  const mapErr = useCallback(
    (e: unknown) => {
      const apiErr = e as ApiError & Error;
      const category = apiErr.category ?? "INTERNAL_ERROR";
      setCorrelationId(apiErr.correlationId);
      if (category === "CONFLICT" || category === "IDEMPOTENCY_CONFLICT") {
        setError(
          category === "CONFLICT"
            ? errorMessage(locale, "CONFLICT")
            : errorMessage(locale, "IDEMPOTENCY_CONFLICT"),
        );
      } else {
        setError(errorMessage(locale, category));
      }
      queueMicrotask(() => {
        document.getElementById("error-summary")?.focus();
      });
    },
    [locale],
  );

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await apiJson<ActivationResource>("/api/activation");
      resourceRef.current = r;
      setResource(r);
      return r;
    } catch (e) {
      mapErr(e);
      resourceRef.current = null;
      setResource(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, [mapErr]);

  const ensureSession = async () => {
    await apiJson("/api/local/synthetic-session", { method: "POST" });
    await refresh();
  };

  const command = async (
    name: string,
    body: Record<string, unknown> = {},
    options?: { fingerprint?: string; newLogicalOp?: boolean },
  ) => {
    const current = resourceRef.current;
    if (!current) throw new Error("No resource");
    setSubmitting(true);
    setError(null);
    const fingerprint =
      options?.fingerprint ??
      `${name}:${JSON.stringify(body)}:${current.aggregateId}`;
    if (options?.newLogicalOp || lastCommandRef.current !== fingerprint) {
      idempotencyRef.current = null;
    }
    const resolved = resolveIdempotencyKey(
      idempotencyRef.current,
      name,
      fingerprint,
    );
    idempotencyRef.current = resolved.slot;
    lastCommandRef.current = fingerprint;
    try {
      const result = await apiJson<{ resource: ActivationResource }>(
        `/api/activation/commands/${name}`,
        {
          method: "POST",
          idempotencyKey: resolved.key,
          body: JSON.stringify({
            expectedVersion: current.version,
            ...body,
          }),
        },
      );
      resourceRef.current = result.resource;
      setResource(result.resource);
      idempotencyRef.current = null;
      lastCommandRef.current = null;
      return result;
    } catch (e) {
      const apiErr = e as ApiError;
      if (apiErr.category === "CONFLICT") {
        idempotencyRef.current = null;
        lastCommandRef.current = null;
        await refresh();
        setError(msg("errStaleVersion"));
        document.getElementById("error-summary")?.focus();
        throw e;
      }
      mapErr(e);
      throw e;
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (initial) return;
    const timer = window.setTimeout(() => {
      void refresh();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [refresh, initial]);

  // Client redirect is convenience only; server already authorized initial render.
  useEffect(() => {
    if (loading || !resource) return;
    const access = canAccessScreen(screenId, resource);
    if (!access.allowed && access.redirectTo) {
      const target = routeFor(access.redirectTo);
      if (
        typeof window !== "undefined" &&
        window.location.pathname !== target
      ) {
        router.replace(target);
      }
    }
  }, [resource, screenId, loading, router]);

  const access = canAccessScreen(screenId, resource);

  return {
    resource,
    error,
    correlationId,
    loading,
    submitting,
    access,
    refresh,
    ensureSession,
    command,
    setError,
    clearLogicalOp: () => {
      idempotencyRef.current = null;
      lastCommandRef.current = null;
    },
  };
}

export function SessionBootstrap({ onReady }: { onReady: () => void }) {
  const { msg } = useLocale();
  return (
    <p>
      <button type="button" onClick={() => void onReady()}>
        {msg("sessionCreate")}
      </button>
    </p>
  );
}

/** @deprecated Use ExplainableLocks from ActivationShell */
export { ExplainableLocks as LockList } from "./ActivationShell";
