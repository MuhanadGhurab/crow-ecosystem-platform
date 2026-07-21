/**
 * GHURAVIA TECHNICAL SPIKE
 * NON-PRODUCT CODE
 * NOT APPROVED FOR RUNTIME OR PRODUCTION
 *
 * Harmless synthetic scanners only — no malware samples.
 */
const SECRET_MARKERS = [
  'AKIAIOSFODNN7EXAMPLE',
  'ghp_exampletoken000000000000000000000',
  'BEGIN RSA PRIVATE KEY',
];

// Harmless EICAR-like test string (not a virus; ASCII test signature)
const HARMLESS_MALWARE_SIG = 'GHV-TEST-SIGNATURE-NOT-MALWARE-X5O!P%@AP';

export function createScannerPipeline({ failOpen = false } = {}) {
  /** @type {Map<string, any>} */
  const jobs = new Map();

  return {
    enqueue(objectId, contentBuffer) {
      const text = contentBuffer.toString('utf8');
      jobs.set(objectId, { objectId, status: 'SCAN_PENDING', content: text, results: null });
      return { objectId, status: 'SCAN_PENDING' };
    },
    run(objectId, { scannerDown = false } = {}) {
      const job = jobs.get(objectId);
      if (!job) throw new Error('UNKNOWN_JOB');
      if (scannerDown) {
        job.status = 'SCAN_INCONCLUSIVE';
        job.results = { malware: 'INCONCLUSIVE', secret: 'INCONCLUSIVE', reason: 'SCANNER_OUTAGE' };
        // fail-closed: never release on outage
        return { ...job.results, releaseAllowed: false, failOpen };
      }
      job.status = 'SCAN_RUNNING';
      const malwareHit = job.content.includes(HARMLESS_MALWARE_SIG);
      const secretHit = SECRET_MARKERS.some((m) => job.content.includes(m));
      let status = 'SCAN_PASSED';
      if (malwareHit || secretHit) status = 'SCAN_FAILED';
      job.status = status;
      job.results = {
        malware: malwareHit ? 'FAILED' : 'PASSED',
        secret: secretHit ? 'FAILED' : 'PASSED',
        fileTypeOk: true,
      };
      const releaseAllowed = status === 'SCAN_PASSED' && !failOpen;
      // even if failOpen flag true, architecture forbids release on fail — enforce closed
      const closedRelease = status === 'SCAN_PASSED';
      return {
        status,
        ...job.results,
        releaseAllowed: closedRelease,
        failOpenAttempted: failOpen,
      };
    },
    get(objectId) {
      return jobs.get(objectId) || null;
    },
  };
}

export { HARMLESS_MALWARE_SIG, SECRET_MARKERS };
