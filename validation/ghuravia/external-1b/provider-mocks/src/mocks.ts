/**
 * GHURAVIA IMPLEMENTATION-ENTRY VALIDATION HARNESS
 * NON-PRODUCT CODE
 * NOT APPROVED FOR RUNTIME OR PRODUCTION
 */

export type MockResult = Readonly<Record<string, string | boolean>>;

const synthetic = (value: string): string => {
  if (!value.startsWith("SYNTHETIC:")) throw new Error("synthetic marker required");
  return value;
};

export const identity = (subject: string): MockResult => ({ subject: synthetic(subject), authenticated: false, activationRequired: true });
export const email = (address: string): MockResult => ({ to: synthetic(address), delivered: false });
export const mobile = (phone: string): MockResult => ({ to: synthetic(phone), delivered: false });
export const payments = (token: string): MockResult => ({ token: synthetic(token), captured: false });
export const objectStorage = (key: string): MockResult => ({ key: synthetic(key), isolated: true, uploaded: false });
export const malwareScan = (): MockResult => ({ verdict: "blocked", failClosed: true });
export const secretScan = (): MockResult => ({ verdict: "blocked", failClosed: true, redacted: true });
export const kms = (key: string): MockResult => ({ key: synthetic(key), localOnly: true, cloudKeyMaterial: false });
export const realtime = (): MockResult => ({ provider: "realtime", status: "blocked" });
export const search = (query: string): MockResult => ({ query: synthetic(query), localOnly: true, scaleValidated: false });
export const notifications = (message: string): MockResult => ({ message: synthetic(message), delivered: false });
export const observability = (event: string): MockResult => ({ event: synthetic(event), productionExport: false });
export const enterpriseSso = (subject: string): MockResult => ({ ...identity(subject), enterpriseConfigured: false });
export const governmentFederation = (subject: string): MockResult => ({ ...identity(subject), governmentConnected: false });
