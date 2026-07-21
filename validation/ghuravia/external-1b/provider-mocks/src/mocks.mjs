/**
 * GHURAVIA IMPLEMENTATION-ENTRY VALIDATION HARNESS
 * NON-PRODUCT CODE
 * NOT APPROVED FOR RUNTIME OR PRODUCTION
 */

const synthetic = (value) => {
  if (!String(value).startsWith("SYNTHETIC:")) throw new Error("synthetic marker required");
  return value;
};
const blocked = (provider) => ({ provider, status: "blocked", synthetic: true });

export const identity = (subject) => ({ subject: synthetic(subject), authenticated: false, activationRequired: true });
export const email = (address) => ({ to: synthetic(address), delivered: false, reason: "mock-no-delivery" });
export const mobile = (phone) => ({ to: synthetic(phone), delivered: false, reason: "mock-no-delivery" });
export const payments = (token) => ({ token: synthetic(token), status: "not-captured", currency: "SYNTHETIC" });
export const objectStorage = (key) => ({ key: synthetic(key), isolated: true, uploaded: false });
export const malwareScan = () => ({ verdict: "blocked", failClosed: true });
export const secretScan = () => ({ verdict: "blocked", failClosed: true, redacted: true });
export const kms = (key) => ({ key: synthetic(key), localOnly: true, cloudKeyMaterial: false });
export const realtime = () => blocked("realtime");
export const search = (query) => ({ query: synthetic(query), localOnly: true, scaleValidated: false });
export const notifications = (message) => ({ message: synthetic(message), delivered: false });
export const observability = (event) => ({ event: synthetic(event), productionExport: false });
export const enterpriseSso = (subject) => ({ ...identity(subject), enterpriseConfigured: false });
export const governmentFederation = (subject) => ({ ...identity(subject), governmentConnected: false });
