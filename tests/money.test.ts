import { test, expect } from "vitest";

import { toPence, formatPrice, totalOf } from "@/app/money";

test("converts pounds to pence, rounding a half penny up", () => {
  expect(toPence("1.75")).toBe(175);
  expect(toPence("12")).toBe(1200);
  // 1.005 * 100 is 100.49999999999999 in floating point, so Math.round
  // would give 100 and undercharge by a penny.
  expect(toPence("1.005")).toBe(101);
  expect(toPence("abc")).toBeNull();
});

test("formats pence as pounds", () => {
  expect(formatPrice(175)).toBe("£1.75");
  expect(formatPrice(1240)).toBe("£12.40");
});

test("totals a list exactly in pence", () => {
  // 0.1 + 0.2 is 0.30000000000000004 in floating point; in pence it is 30.
  expect(
    totalOf([
      { quantity: 1, unitPricePence: 10 },
      { quantity: 1, unitPricePence: 20 },
    ]),
  ).toBe(30);
});