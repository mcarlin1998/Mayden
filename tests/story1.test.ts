import { test, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

import Home from "@/app/page";

// Story 1: "As a shopper I want to view items on my shopping list,
// so I can see what I have chosen to purchase."

const html = renderToStaticMarkup(Home());

test("shows the groceries I chose to buy", () => {
  expect(html).toContain("Oat milk");
  expect(html).toContain("Soda bread");
  expect(html).toContain("Kale");
  expect(html).toContain("Weetabix");
});

test("shows the quantity and price of each grocery", () => {
  expect(html).toContain("x2");
  expect(html).toContain("£3.50"); // 2 x £1.75
  expect(html).toContain("£2.10"); // 1 x £2.10
});

test("shows the total cost of the shop", () => {
  expect(html).toContain("£12.40"); // £3.50 + £2.10 + £1.50 + £5.30
});