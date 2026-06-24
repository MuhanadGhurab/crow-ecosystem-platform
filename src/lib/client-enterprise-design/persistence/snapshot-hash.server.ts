import "@/lib/server-only-guard";

import { createHash } from "node:crypto";

import type { ClientEnterpriseDesignDraft } from "../types";
import { sanitizeDraftForPersistence } from "./constants";

export function hashDraftSnapshot(draft: ClientEnterpriseDesignDraft): string {
  const sanitized = sanitizeDraftForPersistence(draft);
  return createHash("sha256").update(JSON.stringify(sanitized)).digest("hex").slice(0, 16);
}
