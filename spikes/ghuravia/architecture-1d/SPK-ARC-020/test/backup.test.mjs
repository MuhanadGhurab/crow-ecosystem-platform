/**
 * GHURAVIA TECHNICAL SPIKE
 * NON-PRODUCT CODE
 * NOT APPROVED FOR RUNTIME OR PRODUCTION
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createBackupStore } from '../../shared/kernels.mjs';

describe('SPK-ARC-020 backup restore', () => {
  it('targeted restore preserves audit', () => {
    const b = createBackupStore();
    b.put({ id: 'acc1', revision: 1, kind: 'account' });
    b.backup('t1');
    b.delete('acc1');
    assert.equal(b.get('acc1'), null);
    b.restoreTargeted('t1', 'acc1');
    assert.equal(b.get('acc1').revision, 1);
    assert.equal(b.auditLog().length, 1);
    assert.equal(b.auditLog()[0].action, 'TARGETED_RESTORE');
  });
});
