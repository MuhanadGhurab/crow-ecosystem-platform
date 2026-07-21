/**
 * GHURAVIA TECHNICAL SPIKE
 * NON-PRODUCT CODE
 * NOT APPROVED FOR RUNTIME OR PRODUCTION
 * Gate: GHV.ARCHITECTURE.1B
 * Spike: SPK-ARC-011 — formula-version historical reproduction
 */

export function createFormulaRegistry() {
  /** @type {Map<string, object>} */
  const formulas = new Map();
  return {
    register(id, version, impl) {
      formulas.set(`${id}@${version}`, { id, version, impl });
    },
    get(id, version) {
      return formulas.get(`${id}@${version}`);
    },
  };
}

/** Deterministic XP band classifier — two versions differ intentionally. */
export function xpBandV1(xp) {
  if (xp < 100) return "Fledgling";
  if (xp < 500) return "Skilled";
  return "Expert";
}

export function xpBandV2(xp) {
  // Parameter change — must NOT rewrite history computed under v1
  if (xp < 120) return "Fledgling";
  if (xp < 600) return "Skilled";
  return "Expert";
}

export function createHistoricalStandingStore() {
  /** @type {Map<string, object>} */
  const rows = new Map();
  return {
    record(userId, xp, formulaId, formulaVersion, classifier) {
      const band = classifier(xp);
      const key = `${userId}:${formulaId}@${formulaVersion}`;
      rows.set(key, { userId, xp, formulaId, formulaVersion, band });
      return rows.get(key);
    },
    reproduce(userId, formulaId, formulaVersion, classifier) {
      const key = `${userId}:${formulaId}@${formulaVersion}`;
      const hist = rows.get(key);
      if (!hist) throw new Error("missing_history");
      const replayBand = classifier(hist.xp);
      return {
        match: replayBand === hist.band,
        historical: hist,
        replayBand,
      };
    },
  };
}
