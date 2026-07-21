/**
 * GHURAVIA TECHNICAL SPIKE
 * NON-PRODUCT CODE
 * NOT APPROVED FOR RUNTIME OR PRODUCTION
 * Shared 92-screen registry for SPK-ARC-004 / 002 / 017
 */
export const SHELL_COUNTS = Object.freeze({
  Public: 8,
  Activation: 12,
  Onboarding: 14,
  Core: 39,
  Commercial: 6,
  Trust: 6,
  Admin: 7,
});

const ACTIVATION_ACTIVE = [
  'ACT-001', 'ACT-002', 'ACT-003', 'ACT-005', 'ACT-006', 'ACT-007',
  'ACT-008', 'ACT-009', 'ACT-010', 'ACT-011', 'ACT-012', 'ACT-013',
];

const SHELL_AUTH = {
  Public: 'public',
  Activation: 'activation',
  Onboarding: 'authenticated',
  Core: 'authenticated',
  Commercial: 'authenticated',
  Trust: 'authenticated',
  Admin: 'operator',
};

function pad(n) {
  return String(n).padStart(3, '0');
}

export function buildGovernedRouteRegistry() {
  const routes = [];
  const counters = { PUB: 0, ONB: 0, COR: 0, COM: 0, TRU: 0, ADM: 0 };
  for (const [shell, count] of Object.entries(SHELL_COUNTS)) {
    for (let i = 0; i < count; i++) {
      let id;
      if (shell === 'Activation') {
        id = ACTIVATION_ACTIVE[i];
      } else if (shell === 'Public') {
        id = `PUB-${pad(++counters.PUB)}`;
      } else if (shell === 'Onboarding') {
        id = `ONB-${pad(++counters.ONB)}`;
      } else if (shell === 'Core') {
        id = `COR-${pad(++counters.COR)}`;
      } else if (shell === 'Commercial') {
        id = `COM-${pad(++counters.COM)}`;
      } else if (shell === 'Trust') {
        id = `TRU-${pad(++counters.TRU)}`;
      } else {
        id = `ADM-${pad(++counters.ADM)}`;
      }
      routes.push({
        id,
        shell,
        path: `/${shell.toLowerCase()}/${id.toLowerCase()}`,
        authClass: SHELL_AUTH[shell],
        localeStrategy: 'rtl-default-with-locale-prefix',
        historicalAlias: false,
      });
    }
  }
  return routes;
}

export function assertRegistryInvariants(routes) {
  const ids = routes.map((r) => r.id);
  if (ids.includes('ACT-004')) throw new Error('ACT-004 alias must not be active route');
  if (!ids.includes('ACT-013')) throw new Error('ACT-013 required');
  if (new Set(ids).size !== ids.length) throw new Error('Duplicate route IDs');
  if (ids.length !== 92) throw new Error(`Expected 92, got ${ids.length}`);
  for (const [shell, count] of Object.entries(SHELL_COUNTS)) {
    const n = routes.filter((r) => r.shell === shell).length;
    if (n !== count) throw new Error(`Shell ${shell} expected ${count} got ${n}`);
  }
  return { routes: 92, aliases: 0, shells: 7, missingShellMaps: 0, duplicates: 0 };
}

export function resolveAccess(route, ctx) {
  if (route.authClass === 'public') return { allow: true };
  if (route.authClass === 'activation') {
    if (!ctx.authenticated) return { allow: false, reason: 'AUTH_REQUIRED' };
    return { allow: true };
  }
  if (route.authClass === 'operator') {
    if (!ctx.roles?.includes('admin') && !ctx.roles?.includes('operator')) {
      return { allow: false, reason: 'OPERATOR_REQUIRED' };
    }
    return { allow: true };
  }
  if (!ctx.authenticated) return { allow: false, reason: 'AUTH_REQUIRED' };
  if (!ctx.activated) return { allow: false, reason: 'ACTIVATION_REQUIRED', explainableLock: true };
  if (route.shell === 'Commercial' && !ctx.entitled) {
    return { allow: false, reason: 'ENTITLEMENT_REQUIRED', explainableLock: true };
  }
  return { allow: true };
}
