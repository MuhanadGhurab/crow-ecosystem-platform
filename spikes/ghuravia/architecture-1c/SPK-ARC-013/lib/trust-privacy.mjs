/**
 * GHURAVIA TECHNICAL SPIKE
 * NON-PRODUCT CODE
 * NOT APPROVED FOR RUNTIME OR PRODUCTION
 *
 * Trust remains non-public and non-numeric. Moderation cases are restricted.
 */
export function createTrustStore() {
  /** @type {Map<string, any>} */
  const userFacing = new Map();
  /** @type {Map<string, any>} */
  const restricted = new Map();
  /** @type {Map<string, any>} */
  const cases = new Map();

  return {
    setUserFacing(userId, state) {
      // state is categorical, never a public score
      if (typeof state.score === 'number') throw new Error('NUMERIC_TRUST_PROHIBITED');
      userFacing.set(userId, {
        userId,
        eligibility: state.eligibility || 'ELIGIBLE',
        restrictions: state.restrictions || [],
        publicNumericScore: null,
        visibleToPublic: false,
      });
      return userFacing.get(userId);
    },
    setRestrictedSignal(userId, signal) {
      restricted.set(userId, { ...signal, classification: 'HIGHLY_RESTRICTED' });
    },
    openCase({ caseId, subjectId, reporterId, reason }) {
      cases.set(caseId, {
        caseId,
        subjectId,
        reporterId,
        reason,
        status: 'OPEN',
        decision: null,
      });
    },
    decide({ caseId, decision, restriction, actorId }) {
      const c = cases.get(caseId);
      if (!c) throw new Error('NOT_FOUND');
      c.status = 'DECIDED';
      c.decision = decision;
      c.decidedBy = actorId;
      if (decision === 'RESTRICT' && restriction) {
        const uf = userFacing.get(c.subjectId) || this.setUserFacing(c.subjectId, {});
        uf.restrictions = [...new Set([...(uf.restrictions || []), restriction])];
        uf.eligibility = 'RESTRICTED';
      }
      return c;
    },
    overturn({ caseId, actorId, reason }) {
      const c = cases.get(caseId);
      if (!c) throw new Error('NOT_FOUND');
      c.status = 'OVERTURNED';
      c.overturnedBy = actorId;
      c.overturnReason = reason;
      const uf = userFacing.get(c.subjectId);
      if (uf) {
        uf.restrictions = [];
        uf.eligibility = 'ELIGIBLE';
      }
      // mastery untouched — not stored here
      return { case: c, masteryUnchanged: true };
    },
    publicView(userId) {
      // must never expose trust
      return { userId, trust: undefined, score: undefined };
    },
    moderatorView(actor, userId) {
      if (!actor.roles?.includes('moderator') && !actor.roles?.includes('admin')) {
        throw new Error('FORBIDDEN');
      }
      if (actor.roles.includes('moderator') && !actor.canViewPrivateIdentity) {
        return {
          userFacing: userFacing.get(userId),
          restricted: restricted.get(userId),
          privateIdentity: null,
        };
      }
      return {
        userFacing: userFacing.get(userId),
        restricted: restricted.get(userId),
        privateIdentity: actor.canViewPrivateIdentity ? { note: 'authorized' } : null,
      };
    },
  };
}
