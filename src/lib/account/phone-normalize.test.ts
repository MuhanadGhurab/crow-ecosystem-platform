import assert from "node:assert/strict";

import { maskPhoneE164, normalizePhoneToE164 } from "@/lib/account/phone-normalize";

{
  const sa = normalizePhoneToE164({ countryCode: "SA", nationalNumber: "512345678" });
  assert(sa.ok, "SA mobile should normalize");
  if (sa.ok) {
    assert(sa.e164.startsWith("+966"), "SA E.164 prefix");
    assert(sa.masked.includes("•"), "masked phone hides digits");
  }
}

{
  const bad = normalizePhoneToE164({ countryCode: "SA", nationalNumber: "123" });
  assert(!bad.ok, "invalid SA number rejected");
}

console.log("phone-normalize: passed");
