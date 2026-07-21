/**
 * GHURAVIA TECHNICAL SPIKE
 * NON-PRODUCT CODE
 * NOT APPROVED FOR RUNTIME OR PRODUCTION
 */
export function createAuditLedger() {
  /** @type {any[]} */
  const entries = [];
  let seq = 0;

  function append(event) {
    if (!event.actorId) throw new Error('ACTOR_REQUIRED');
    if (!event.reason) throw new Error('REASON_REQUIRED');
    if (!event.authority) throw new Error('AUTHORITY_REQUIRED');
    // forbid evidence body / secrets
    const blob = JSON.stringify(event);
    if (/BEGIN RSA PRIVATE KEY|password\s*=/i.test(blob)) throw new Error('SECRET_IN_AUDIT');
    if (event.evidenceContent) throw new Error('EVIDENCE_CONTENT_PROHIBITED');
    const record = {
      id: `AUD-${++seq}`,
      recordedAt: Date.now(),
      effectiveAt: event.effectiveAt || Date.now(),
      ...event,
    };
    entries.push(record);
    return record;
  }

  return {
    append,
    privilegedCorrect({ actorId, subjectId, resource, priorRef, resultRef, reason, authority, dualControlApprover }) {
      if (authority === 'BREAK_GLASS' && !dualControlApprover) {
        throw new Error('DUAL_CONTROL_REQUIRED');
      }
      return append({
        actorId,
        subjectId,
        action: 'PRIVILEGED_CORRECTION',
        resource,
        reason,
        authority,
        priorStateRef: priorRef,
        resultingStateRef: resultRef,
        dualControlApprover: dualControlApprover || null,
        sensitivity: 'HIGHLY_RESTRICTED',
        reviewStatus: 'PENDING_POST_ACTION_REVIEW',
      });
    },
    reverse({ actorId, originalAuditId, reason, authority }) {
      const orig = entries.find((e) => e.id === originalAuditId);
      if (!orig) throw new Error('NOT_FOUND');
      return append({
        actorId,
        subjectId: orig.subjectId,
        action: 'CORRECTION_REVERSAL',
        resource: orig.resource,
        reason,
        authority,
        priorStateRef: orig.resultingStateRef,
        resultingStateRef: orig.priorStateRef,
        correlatesTo: originalAuditId,
        sensitivity: 'HIGHLY_RESTRICTED',
        reviewStatus: 'PENDING_POST_ACTION_REVIEW',
      });
    },
    all() {
      return [...entries];
    },
  };
}
