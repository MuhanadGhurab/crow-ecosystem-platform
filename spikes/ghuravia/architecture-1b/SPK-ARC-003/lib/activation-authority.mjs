/**
 * GHURAVIA TECHNICAL SPIKE
 * NON-PRODUCT CODE
 * NOT APPROVED FOR RUNTIME OR PRODUCTION
 * Gate: GHV.ARCHITECTURE.1B
 * Spike: SPK-ARC-003
 */

/** Server-authoritative activation aggregate (synthetic). */
export function createActivationStore() {
  /** @type {Map<string, object>} */
  const accounts = new Map();
  return {
    createAccount(id) {
      if (accounts.has(id)) throw new Error("duplicate");
      const row = {
        id,
        email_verified: false,
        current_terms_accepted: false,
        account_risk_status: "unknown",
        activation_complete: false,
        history: [],
      };
      accounts.set(id, row);
      return structuredClone(row);
    },
    get(id) {
      const row = accounts.get(id);
      return row ? structuredClone(row) : null;
    },
    applyEmailResult(id, outcome) {
      const row = accounts.get(id);
      if (!row) throw new Error("missing");
      if (outcome === "VERIFIED") row.email_verified = true;
      row.history.push({ type: "email_result", outcome, at: Date.now() });
      return structuredClone(row);
    },
    acceptTerms(id) {
      const row = accounts.get(id);
      if (!row) throw new Error("missing");
      if (!row.email_verified) throw new Error("email_not_verified");
      row.current_terms_accepted = true;
      row.history.push({ type: "terms", at: Date.now() });
      return structuredClone(row);
    },
    acceptRisk(id) {
      const row = accounts.get(id);
      if (!row) throw new Error("missing");
      if (!row.email_verified || !row.current_terms_accepted) {
        throw new Error("preconditions");
      }
      row.account_risk_status = "acceptable";
      row.history.push({ type: "risk", at: Date.now() });
      return structuredClone(row);
    },
    completeActivation(id) {
      const row = accounts.get(id);
      if (!row) throw new Error("missing");
      const ok =
        row.email_verified &&
        row.current_terms_accepted &&
        row.account_risk_status === "acceptable";
      if (!ok) throw new Error("formula_incomplete");
      row.activation_complete = true;
      row.history.push({ type: "activated", at: Date.now() });
      return structuredClone(row);
    },
    /** Client cannot forge activation by patching a DTO alone. */
    tryClientForge(id, forged) {
      const row = accounts.get(id);
      if (!row) throw new Error("missing");
      // Ignore client-claimed flags; only server transitions mutate.
      return {
        accepted: false,
        authoritative: structuredClone(row),
        forgedRejected: forged,
      };
    },
  };
}

export const SCREEN_STATE_SOURCE = Object.freeze({
  "ACT-003": "server.email_verification_pending",
  "ACT-011": "server.email_verification_result",
  "ACT-012": "server.activation_recovery",
  "ACT-005": "server.terms_acceptance",
  "ACT-013": "server.account_risk_status",
  "ACT-006": "server.activation_complete",
  "ACT-004": "HISTORICAL_ONLY_NOT_ACTIVE",
});
