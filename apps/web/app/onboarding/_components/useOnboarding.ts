"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type {
  ErrorCategory,
  OnboardingResource,
} from "@ghuravia/contracts/schemas";
import {
  PERSONALIZATION_CATALOGUE_VERSION,
  ORIGIN_CATALOGUE_VERSION,
  NEST_READINESS_CATALOGUE_VERSION,
} from "@ghuravia/contracts/schemas";
import { useLocale } from "../../../lib/locale-context";
import { errorMessage } from "../../../lib/localization/format";
import {
  resolveIdempotencyKey,
  type IdempotencySlot,
} from "../../../lib/idempotency";
import {
  canAccessOnboardingRoute,
  onboardingRouteFor,
  type OnboardingScreenId,
} from "../../../lib/onboarding-routes";

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

/** Bootstrap when onboarding row does not exist yet (ONB-001 begin). */
export function emptyOnboardingBootstrap(
  aggregateId: string,
): OnboardingResource {
  return {
    aggregateId,
    state: "NOT_STARTED",
    version: 0,
    personalizationCatalogueVersion: PERSONALIZATION_CATALOGUE_VERSION,
    originCatalogueVersion: ORIGIN_CATALOGUE_VERSION,
    nestReadinessCatalogueVersion: NEST_READINESS_CATALOGUE_VERSION,
    personalization: {
      path: null,
      status: "NOT_STARTED",
      crowOptionId: null,
      colorOptionId: null,
      styleOptionId: null,
      habitatOptionId: null,
      characterOptionId: null,
      accessoryOptionId: null,
      contrastOverrideAcknowledged: false,
      privacyPreviewAcknowledged: false,
    },
    origin: {
      status: "NOT_STARTED",
      regionOption: null,
      experienceOption: null,
      goalsOptions: [],
    },
    nestReadiness: {
      catalogueVersion: NEST_READINESS_CATALOGUE_VERSION,
      attemptId: null,
      attemptStatus: "NONE",
      answeredItemIds: [],
      answerCount: 0,
      totalItems: 10,
      canSubmit: false,
      score: null,
      band: null,
      weakCapabilityIds: [],
      resultAcknowledged: false,
    },
    locks: [],
    allowedNextActions: ["BEGIN_GUIDED_PERSONALIZATION", "BEGIN_QUICK_START"],
    accessibleScreens: ["ONB-001"],
    nestIntroHandoffAllowed: false,
    progressionImpact: {
      xp: 0,
      mastery: 0,
      rank: 0,
      prestige: 0,
      trust: 0,
    },
    nestIdentityImpact: {
      lineageAwarded: false,
      crossWingMajorCreated: false,
      evidenceSealIssued: false,
      fusionSignatureIssued: false,
      paymentEntitlementChanged: false,
    },
    localOnly: true,
  };
}

export function useOnboarding(
  screenId: OnboardingScreenId,
  options?: {
    initialResource?: OnboardingResource | null;
    activationAggregateId?: string;
  },
) {
  const router = useRouter();
  const { locale, msg } = useLocale();
  const initial = options?.initialResource ?? null;
  const bootstrapped =
    !initial && screenId === "ONB-001" && options?.activationAggregateId
      ? emptyOnboardingBootstrap(options.activationAggregateId)
      : null;
  const [resource, setResource] = useState<OnboardingResource | null>(
    initial ?? bootstrapped,
  );
  const [error, setError] = useState<string | null>(null);
  const [correlationId, setCorrelationId] = useState<string | undefined>();
  const [loading, setLoading] = useState(!initial && !bootstrapped);
  const [submitting, setSubmitting] = useState(false);
  const idempotencyRef = useRef<IdempotencySlot | null>(null);
  const lastCommandRef = useRef<string | null>(null);
  const resourceRef = useRef<OnboardingResource | null>(
    initial ?? bootstrapped,
  );

  useEffect(() => {
    if (!error) return;
    const el = document.getElementById("error-summary");
    el?.focus();
  }, [error, correlationId]);

  const mapErr = useCallback(
    (e: unknown) => {
      const apiErr = e as ApiError & Error;
      const category = apiErr.category ?? "INTERNAL_ERROR";
      setCorrelationId(apiErr.correlationId);
      setError(errorMessage(locale, category));
    },
    [locale],
  );

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await apiJson<OnboardingResource>("/api/onboarding");
      resourceRef.current = r;
      setResource(r);
      return r;
    } catch (e) {
      const apiErr = e as ApiError;
      if (apiErr.category === "NOT_FOUND") {
        const bootstrap = emptyOnboardingBootstrap(
          options?.activationAggregateId ?? "pending",
        );
        resourceRef.current = bootstrap;
        setResource(bootstrap);
        return bootstrap;
      }
      mapErr(e);
      resourceRef.current = null;
      setResource(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, [mapErr, options?.activationAggregateId]);

  const command = async (
    name: string,
    body: Record<string, unknown> = {},
    commandOptions?: {
      fingerprint?: string;
      newLogicalOp?: boolean;
      forceIdempotencyKey?: string;
      /** Local/test e2e only — forces optimistic version for CONFLICT coverage */
      forceExpectedVersion?: number;
    },
  ) => {
    let current = resourceRef.current;
    if (!current) {
      current = emptyOnboardingBootstrap(
        options?.activationAggregateId ?? "pending",
      );
      resourceRef.current = current;
    }
    setSubmitting(true);
    setError(null);
    const withCatalogue = {
      personalizationCatalogueVersion:
        body.personalizationCatalogueVersion ??
        PERSONALIZATION_CATALOGUE_VERSION,
      originCatalogueVersion:
        body.originCatalogueVersion ?? ORIGIN_CATALOGUE_VERSION,
      nestReadinessCatalogueVersion:
        body.nestReadinessCatalogueVersion ?? NEST_READINESS_CATALOGUE_VERSION,
      ...body,
    };
    const fingerprint =
      commandOptions?.fingerprint ??
      `${name}:${JSON.stringify(withCatalogue)}:${current.aggregateId}`;
    if (
      commandOptions?.newLogicalOp ||
      lastCommandRef.current !== fingerprint
    ) {
      idempotencyRef.current = null;
    }
    const resolved = resolveIdempotencyKey(
      idempotencyRef.current,
      name,
      fingerprint,
    );
    idempotencyRef.current = resolved.slot;
    lastCommandRef.current = fingerprint;
    const idempotencyKey = commandOptions?.forceIdempotencyKey ?? resolved.key;
    const expectedVersion =
      commandOptions?.forceExpectedVersion ?? current.version;
    try {
      const result = await apiJson<{
        resource: OnboardingResource;
        idempotencyResult?: "applied" | "replayed";
        aggregateVersion?: number;
        correlationId?: string;
      }>(`/api/onboarding/commands/${name}`, {
        method: "POST",
        idempotencyKey,
        body: JSON.stringify({
          expectedVersion,
          ...withCatalogue,
        }),
      });
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
        throw e;
      }
      mapErr(e);
      throw e;
    } finally {
      setSubmitting(false);
    }
  };

  const commandRef = useRef(command);

  useEffect(() => {
    commandRef.current = command;
  });

  useEffect(() => {
    let cancelled = false;
    const w = window as Window & {
      __GHURAVIA_E2E_ONBOARDING_COMMAND__?: (
        name: string,
        body?: Record<string, unknown>,
        opts?: {
          fingerprint?: string;
          newLogicalOp?: boolean;
          forceIdempotencyKey?: string;
          forceExpectedVersion?: number;
        },
      ) => Promise<unknown>;
    };
    void (async () => {
      try {
        const res = await fetch("/api/health");
        if (!res.ok || cancelled) return;
        const health = (await res.json()) as { runtimeMode?: string };
        const mode = health.runtimeMode;
        if (mode !== "automated_test" && mode !== "local_development") {
          return;
        }
        w.__GHURAVIA_E2E_ONBOARDING_COMMAND__ = (name, body = {}, opts) =>
          commandRef.current(name, body, opts);
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
      delete w.__GHURAVIA_E2E_ONBOARDING_COMMAND__;
    };
  }, []);

  useEffect(() => {
    if (initial) return;
    const timer = window.setTimeout(() => {
      void refresh();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [refresh, initial]);

  useEffect(() => {
    if (loading) return;
    const access = canAccessOnboardingRoute(screenId, resource);
    if (!access.allowed && access.redirectTo) {
      const target = onboardingRouteFor(access.redirectTo);
      if (
        typeof window !== "undefined" &&
        window.location.pathname !== target
      ) {
        router.replace(target);
      }
    }
  }, [resource, screenId, loading, router]);

  const access = canAccessOnboardingRoute(screenId, resource);

  return {
    resource,
    error,
    correlationId,
    loading,
    submitting,
    access,
    refresh,
    command,
    setError,
    clearLogicalOp: () => {
      idempotencyRef.current = null;
      lastCommandRef.current = null;
    },
  };
}
