/**
 * Security analyst view: audit trail emphasis (localStorage).
 */

import { readAuditLog } from "./storage.js";
import { renderAuditTableSection } from "./audit-ui.js";

export function initAuditPage() {
  const root = document.getElementById("audit-root");
  if (!root) return;

  const entries = readAuditLog();
  root.innerHTML = renderAuditTableSection(entries, {
    title: "Security audit trail (demo)",
    hint:
      "Read-only browser copy for analysts. DEMO ONLY: not real authentication or tamper-proof logging.",
  });
}
