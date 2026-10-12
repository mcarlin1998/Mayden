import { test, expect } from "vitest";

import { toPence, formatPrice, overBudgetBy, totalOf } from "@/app/money";

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

// Story 8: "See clearly if the total cost of my shop is higher than the limit."

// The page warns when this returns a number greater than zero, so the boundary
// cases below check the warning condition directly.
const wouldWarn = (total: number, limit: number | null) => {
  const over = overBudgetBy(total, limit);
  return over !== null && over > 0;
};

test("no limit set means nothing to compare against", () => {
  expect(overBudgetBy(1240, null)).toBeNull();
  expect(wouldWarn(1240, null)).toBe(false);
});

test("a total under the limit does not warn", () => {
  expect(wouldWarn(1240, 2000)).toBe(false);
});

test("a total exactly on the limit does not warn", () => {
  // £20.00 spent against a £20.00 limit is on budget, not over it.
  expect(wouldWarn(2000, 2000)).toBe(false);
});

test("a total one penny over the limit warns", () => {
  expect(wouldWarn(2001, 2000)).toBe(true);
  expect(overBudgetBy(2001, 2000)).toBe(1);
});

test("reports how far over the limit the shop is", () => {
  expect(overBudgetBy(5240, 3000)).toBe(2240);
});