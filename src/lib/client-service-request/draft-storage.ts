import type { ClientServiceRequestBrief } from "./types";
import {
  buildClientScopedStorageKey,
  CLIENT_SCOPED_SCOPES,
  readScopedJson,
  removeScopedKey,
  writeScopedJson,
} from "@/lib/client-state/scoped-storage";

export const REQUEST_WIZARD_DRAFT_SCHEMA_VERSION = "request-wizard-draft-v1" as const;
export const REQUEST_WIZARD_DRAFT_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export type RequestWizardDraft = {
  schemaVersion: typeof REQUEST_WIZARD_DRAFT_SCHEMA_VERSION;
  savedAt: string;
  step: string;
  brief: ClientServiceRequestBrief;
};

function draftKey(accountScopeKey: string): string {
  return buildClientScopedStorageKey(CLIENT_SCOPED_SCOPES.REQUEST_WIZARD_DRAFT, accountScopeKey);
}

export function loadRequestWizardDraft(accountScopeKey: string): RequestWizardDraft | null {
  const raw = readScopedJson<RequestWizardDraft>(draftKey(accountScopeKey));
  if (!raw || raw.schemaVersion !== REQUEST_WIZARD_DRAFT_SCHEMA_VERSION) return null;
  const age = Date.now() - new Date(raw.savedAt).getTime();
  if (Number.isNaN(age) || age > REQUEST_WIZARD_DRAFT_TTL_MS) {
    removeScopedKey(draftKey(accountScopeKey));
    return null;
  }
  if (raw.brief.submittedAt) {
    removeScopedKey(draftKey(accountScopeKey));
    return null;
  }
  return raw;
}

export function saveRequestWizardDraft(
  accountScopeKey: string,
  draft: Omit<RequestWizardDraft, "schemaVersion" | "savedAt">,
): void {
  writeScopedJson(draftKey(accountScopeKey), {
    schemaVersion: REQUEST_WIZARD_DRAFT_SCHEMA_VERSION,
    savedAt: new Date().toISOString(),
    step: draft.step,
    brief: draft.brief,
  });
}

export function clearRequestWizardDraft(accountScopeKey: string): void {
  removeScopedKey(draftKey(accountScopeKey));
}
