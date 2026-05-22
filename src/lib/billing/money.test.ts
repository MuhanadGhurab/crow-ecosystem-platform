import { sarToStripeAmount, stripeAmountToSar } from "./money";

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

assert(sarToStripeAmount(1499) === 149900, "1499 SAR → halala");
assert(stripeAmountToSar(149900) === 1499, "halala → SAR");
assert(sarToStripeAmount(0) === 0, "zero");

console.log("billing/money: OK");
