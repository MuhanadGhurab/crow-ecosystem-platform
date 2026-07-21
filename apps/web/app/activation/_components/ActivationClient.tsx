"use client";

import { useCallback, useState, startTransition } from "react";
import type { ActivationResource } from "@ghuravia/contracts/schemas";

async function api<T>(
  path: string,
  init?: RequestInit & { idempotencyKey?: string },
): Promise<T> {
  const headers = new Headers(init?.headers);
  headers.set("Content-Type", "application/json");
  if (init?.idempotencyKey) {
    headers.set("Idempotency-Key", init.idempotencyKey);
  }
  const res = await fetch(path, { ...init, headers, credentials: "include" });
  const body = await res.json();
  if (!res.ok) {
    throw new Error(body.message ?? body.category ?? "error");
  }
  return body as T;
}

export function useActivation() {
  const [resource, setResource] = useState<ActivationResource | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await api<ActivationResource>("/api/activation");
      startTransition(() => setResource(r));
    } catch (e) {
      setError(e instanceof Error ? e.message : "error");
      startTransition(() => setResource(null));
    } finally {
      setLoading(false);
    }
  }, []);

  const ensureSession = async () => {
    await api("/api/local/synthetic-session", { method: "POST" });
    await refresh();
  };

  const command = async (name: string, body: Record<string, unknown> = {}) => {
    if (!resource) throw new Error("No resource");
    const key = `${name}:${resource.version}:${Date.now()}`;
    const result = await api<{ resource: ActivationResource }>(
      `/api/activation/commands/${name}`,
      {
        method: "POST",
        idempotencyKey: key,
        body: JSON.stringify({
          expectedVersion: resource.version,
          ...body,
        }),
      },
    );
    startTransition(() => setResource(result.resource));
    return result;
  };

  return {
    resource,
    error,
    loading,
    refresh,
    ensureSession,
    command,
    setError,
  };
}

export function LockList({ resource }: { resource: ActivationResource }) {
  if (resource.locks.length === 0) return null;
  return (
    <section aria-labelledby="locks-heading">
      <h2 id="locks-heading">أقفال التفعيل</h2>
      <ul>
        {resource.locks.map((lock) => (
          <li key={lock.code}>
            <strong>{lock.messageAr}</strong>
            {lock.messageEn ? <span dir="ltr"> — {lock.messageEn}</span> : null}
            <div>الإجراء التالي: {lock.nextAction}</div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function SessionBootstrap({ onReady }: { onReady: () => void }) {
  return (
    <p>
      <button type="button" onClick={() => void onReady()}>
        إنشاء جلسة محلية اصطناعية
      </button>
    </p>
  );
}
