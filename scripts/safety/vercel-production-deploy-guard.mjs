/**
 * CROW.GAP015.2 — Vercel Ignored Build Step: Production deploy guard.
 *
 * Policy: Production builds are blocked by default unless explicit owner
 * authorization env vars match the commit SHA. Preview / non-production
 * builds always proceed.
 *
 * Vercel Ignored Build Step exit semantics (critical):
 *   exit 0 → ignore / skip the build
 *   exit 1 → do not ignore; allow the build to proceed
 *
 * Safety:
 *   - no secrets printed
 *   - no raw env dump
 *   - no database access
 *   - no hosted writes / migrations
 *   - no Vercel deploy trigger / GitHub mutation
 *
 * Usage (Vercel Project → Settings → Git → Ignored Build Step):
 *   node scripts/safety/vercel-production-deploy-guard.mjs
 *
 * Authorization (Production only — set then clear after deploy):
 *   CROW_PRODUCTION_DEPLOY_AUTHORIZED=true
 *   CROW_PRODUCTION_DEPLOY_SHA=<exact VERCEL_GIT_COMMIT_SHA>
 *   CROW_PRODUCTION_DEPLOY_REASON=<non-empty owner reason>
 */

/**
 * @typedef {"ALLOW_NON_PRODUCTION_BUILD" | "ALLOW_AUTHORIZED_PRODUCTION_BUILD" | "BLOCK_UNAUTHORIZED_PRODUCTION_BUILD"} GuardDecision
 */

/**
 * @typedef {object} GuardInput
 * @property {string | undefined} vercelEnv
 * @property {string | undefined} commitSha
 * @property {string | undefined} authorized
 * @property {string | undefined} authorizedSha
 * @property {string | undefined} reason
 */

/**
 * @typedef {object} GuardResult
 * @property {GuardDecision} decision
 * @property {number} exitCode  0 = skip build (block), 1 = allow build
 * @property {boolean} isProduction
 * @property {boolean} authFlagPresent
 * @property {boolean} commitShaPresent
 * @property {boolean} authorizedShaPresent
 * @property {boolean} shaMatch
 * @property {boolean} reasonPresent
 * @property {string} vercelEnvLabel
 * @property {string} commitShaPrefix
 */

/**
 * @param {string | undefined} value
 * @returns {boolean}
 */
export function isTruthyFlag(value) {
  if (!value) return false;
  const v = value.trim().toLowerCase();
  return v === "true" || v === "1" || v === "yes";
}

/**
 * @param {string | undefined} value
 * @returns {boolean}
 */
export function isNonEmpty(value) {
  return Boolean(value && value.trim().length > 0);
}

/**
 * @param {string | undefined} sha
 * @returns {string}
 */
export function shortSha(sha) {
  if (!sha || !sha.trim()) return "(missing)";
  const t = sha.trim();
  if (t.length <= 7) return t;
  return t.slice(0, 7);
}

/**
 * Pure evaluation — safe for unit tests (no I/O, no process.exit).
 * @param {GuardInput} input
 * @returns {GuardResult}
 */
export function evaluateProductionDeployGuard(input) {
  const vercelEnv = (input.vercelEnv ?? "").trim().toLowerCase();
  const isProduction = vercelEnv === "production";
  const commitSha = (input.commitSha ?? "").trim();
  const authorizedSha = (input.authorizedSha ?? "").trim();
  const authFlagPresent = isTruthyFlag(input.authorized);
  const commitShaPresent = isNonEmpty(commitSha);
  const authorizedShaPresent = isNonEmpty(authorizedSha);
  const shaMatch =
    commitShaPresent &&
    authorizedShaPresent &&
    commitSha.toLowerCase() === authorizedSha.toLowerCase();
  const reasonPresent = isNonEmpty(input.reason);

  /** @type {GuardDecision} */
  let decision;
  /** @type {number} */
  let exitCode;

  if (!isProduction) {
    decision = "ALLOW_NON_PRODUCTION_BUILD";
    // Exit 1 = do not ignore → allow Preview/dev/local builds
    exitCode = 1;
  } else if (authFlagPresent && shaMatch && reasonPresent) {
    decision = "ALLOW_AUTHORIZED_PRODUCTION_BUILD";
    exitCode = 1;
  } else {
    decision = "BLOCK_UNAUTHORIZED_PRODUCTION_BUILD";
    // Exit 0 = ignore/skip Production build
    exitCode = 0;
  }

  return {
    decision,
    exitCode,
    isProduction,
    authFlagPresent,
    commitShaPresent,
    authorizedShaPresent,
    shaMatch,
    reasonPresent,
    vercelEnvLabel: vercelEnv || "(unset)",
    commitShaPrefix: shortSha(commitSha),
  };
}

/**
 * @param {GuardResult} result
 */
export function printGuardStatus(result) {
  console.log("vercel-production-deploy-guard (redacted)");
  console.log(`VERCEL_ENV=${result.vercelEnvLabel}`);
  console.log(`commit_sha_present=${result.commitShaPresent}`);
  console.log(`commit_sha_prefix=${result.commitShaPrefix}`);
  console.log(`authorization_flag_present=${result.authFlagPresent}`);
  console.log(`authorized_sha_present=${result.authorizedShaPresent}`);
  console.log(`sha_match=${result.shaMatch}`);
  console.log(`reason_present=${result.reasonPresent}`);
  console.log(`decision=${result.decision}`);
  console.log(`exit_code=${result.exitCode}`);
  console.log(
    "NOTE: exit 0=skip/ignore build; exit 1=allow build (Vercel Ignored Build Step)",
  );
}

/**
 * @param {NodeJS.ProcessEnv} [env]
 * @returns {GuardResult}
 */
export function evaluateFromEnv(env = process.env) {
  return evaluateProductionDeployGuard({
    vercelEnv: env.VERCEL_ENV,
    commitSha: env.VERCEL_GIT_COMMIT_SHA,
    authorized: env.CROW_PRODUCTION_DEPLOY_AUTHORIZED,
    authorizedSha: env.CROW_PRODUCTION_DEPLOY_SHA,
    reason: env.CROW_PRODUCTION_DEPLOY_REASON,
  });
}

function main() {
  const result = evaluateFromEnv(process.env);
  printGuardStatus(result);
  process.exit(result.exitCode);
}

const invokedDirectly =
  process.argv[1] &&
  /vercel-production-deploy-guard\.mjs$/.test(
    process.argv[1].replace(/\\/g, "/"),
  );

if (invokedDirectly) {
  main();
}
