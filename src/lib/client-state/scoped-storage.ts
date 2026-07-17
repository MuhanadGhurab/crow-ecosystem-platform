/** CROW.UAT.1 — user-scoped browser storage; cleared on sign-out. */

export const CLIENT_SCOPED_STORAGE_VERSION = "crow-client-scoped-v1" as const;

export const CLIENT_SCOPED_SCOPES = {
  REQUEST_WIZARD_DRAFT: "request-wizard-draft",
  DISCOVERY_DESIGN_DRAFT: "discovery-design-draft",
} as const;

function localStore(): Storage | null {
  return typeof globalThis.localStorage !== "undefined" ? globalThis.localStorage : null;
}

function sessionStore(): Storage | null {
  return typeof globalThis.sessionStorage !== "undefined" ? globalThis.sessionStorage : null;
}

export function deriveAccountScopeKey(platformAccountId: string): string {
  let h = 2166136261;
  for (let i = 0; i < platformAccountId.length; i++) {
    h ^= platformAccountId.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return `pa-${(h >>> 0).toString(36)}`;
}

export function buildClientScopedStorageKey(scope: string, accountScopeKey: string): string {
  return `${CLIENT_SCOPED_STORAGE_VERSION}:${scope}:${accountScopeKey}`;
}

export function clearAllClientScopedStorage(): void {
  const prefix = `${CLIENT_SCOPED_STORAGE_VERSION}:`;
  const removeFrom = (store: Storage | null) => {
    if (!store) return;
    const keys: string[] = [];
    for (let i = 0; i < store.length; i++) {
      const key = store.key(i);
      if (key?.startsWith(prefix)) keys.push(key);
    }
    keys.forEach((k) => store.removeItem(k));
  };
  removeFrom(localStore());
  removeFrom(sessionStore());
}

export function readScopedJson<T>(key: string): T | null {
  try {
    const raw = localStore()?.getItem(key) ?? sessionStore()?.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function writeScopedJson(key: string, value: unknown, persist: "local" | "session" = "local"): void {
  const store = persist === "session" ? sessionStore() : localStore();
  if (!store) return;
  store.setItem(key, JSON.stringify(value));
}

export function removeScopedKey(key: string): void {
  localStore()?.removeItem(key);
  sessionStore()?.removeItem(key);
}
