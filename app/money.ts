const gbp = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
});

export function formatPrice(pence: number): string {
  return gbp.format(pence / 100);
}

export function toPence(pounds: string): number | null {
  const trimmed = pounds.trim();

  // Must be digits with at most one decimal point, ending in a digit.
  if (!/^\d*\.?\d+$/.test(trimmed)) return null;

  const [whole = "0", fraction = ""] = trimmed.split(".");

  // Take the first two decimal places as pence, ignoring anything beyond.
  const pence =
    Number(whole || "0") * 100 + Number(`${fraction}00`.slice(0, 2));

  // Round up when the third decimal place is 5 or more.
  const thirdDigit = fraction.length > 2 ? Number(fraction[2]) : 0;

  return thirdDigit >= 5 ? pence + 1 : pence;
}

// Total cost of a list, calculated in pence so it stays exact.
export function totalOf(
  items: { quantity: number; unitPricePence: number }[],
): number {
  return items.reduce(
    (sum, item) => sum + item.quantity * item.unitPricePence,
    0,
  );
}

// Story 8: how much the shop is over its spending limit, or null when no limit
// has been set. Only strictly greater counts as over budget.
export function overBudgetBy(totalPence: number, limitPence: number | null): number | null {
  if (limitPence === null) return null;
  return totalPence > limitPence ? totalPence - limitPence : 0;
}
