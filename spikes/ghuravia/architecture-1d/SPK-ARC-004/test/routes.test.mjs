/**
 * GHURAVIA TECHNICAL SPIKE
 * NON-PRODUCT CODE
 * NOT APPROVED FOR RUNTIME OR PRODUCTION
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { buildGovernedRouteRegistry, assertRegistryInvariants, resolveAccess } from '../../shared/route-registry.mjs';

describe('SPK-ARC-004 92-route shell composition', () => {
  it('represents 92 routes across 7 shells with 0 aliases', () => {
    const routes = buildGovernedRouteRegistry();
    const inv = assertRegistryInvariants(routes);
    assert.equal(inv.routes, 92);
    assert.equal(inv.aliases, 0);
    assert.equal(inv.shells, 7);
    assert.equal(inv.duplicates, 0);
  });

  it('enforces auth activation entitlement and operator separation', () => {
    const routes = buildGovernedRouteRegistry();
    const core = routes.find((r) => r.shell === 'Core');
    const admin = routes.find((r) => r.shell === 'Admin');
    const com = routes.find((r) => r.shell === 'Commercial');
    assert.equal(resolveAccess(core, { authenticated: true, activated: false }).reason, 'ACTIVATION_REQUIRED');
    assert.equal(resolveAccess(com, { authenticated: true, activated: true, entitled: false }).explainableLock, true);
    assert.equal(resolveAccess(admin, { authenticated: true, activated: true, roles: [] }).allow, false);
    assert.equal(resolveAccess(admin, { authenticated: true, activated: true, roles: ['admin'] }).allow, true);
  });
});
