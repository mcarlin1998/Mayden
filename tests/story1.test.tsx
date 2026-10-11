import { test, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import Home from "@/app/page";

// Story 1: "As a shopper I want to view items on my shopping list,
// so I can see what I have chosen to purchase."

test("shows the groceries I chose to buy", () => {
  render(<Home />);

  expect(screen.getByText("Oat milk")).toBeDefined();
  expect(screen.getByText("Soda bread")).toBeDefined();
  expect(screen.getByText("Kale")).toBeDefined();
  expect(screen.getByText("Weetabix")).toBeDefined();
});

test("shows the quantity and price of each grocery", () => {
  render(<Home />);

  // Oat milk is 2 x £1.75; soda bread is 1 x £2.10; weetabix is 2 x £2.65.
  expect(screen.getByText("£3.50")).toBeDefined();
  expect(screen.getByText("£2.10")).toBeDefined();
  expect(screen.getByText("£5.30")).toBeDefined();
});

test("shows the total cost of the shop", () => {
  render(<Home />);

  expect(screen.getByText("£12.40")).toBeDefined(); // £3.50 + £2.10 + £1.50 + £5.30
});