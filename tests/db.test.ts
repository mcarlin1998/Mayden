import { test, expect, beforeEach, afterAll } from "vitest";

import { db, deleteItem, getItems, insertItem, toggleItem } from "@/lib/db";

// Story 5: "As a shopper I want to be able to still see the state of my
// shopping list when I come back to it."

// Each test starts from a known list, so the seeded items are cleared first.
beforeEach(() => {
  db.exec("DELETE FROM items");
  insertItem({ name: "Kale", quantity: 1, unitPricePence: 150 });
});

afterAll(() => {
  db.exec("DELETE FROM items");
});

test("items are read back in order", () => {
  insertItem({ name: "Milk", quantity: 2, unitPricePence: 175 });

  expect(getItems().map((item) => item.name)).toEqual(["Kale", "Milk"]);
});

test("an item keeps its quantity, price and checked state", () => {
  const [item] = getItems();

  expect(item.name).toBe("Kale");
  expect(item.quantity).toBe(1);
  expect(item.unitPricePence).toBe(150);
  expect(item.isChecked).toBe(false);
});

test("a new item is not already checked", () => {
  insertItem({ name: "Milk", quantity: 1, unitPricePence: 100 });

  expect(getItems().every((item) => item.isChecked === false)).toBe(true);
});

test("an item can be ticked off and back on", () => {
  const [item] = getItems();

  toggleItem(item.id);
  expect(getItems()[0].isChecked).toBe(true);

  toggleItem(item.id);
  expect(getItems()[0].isChecked).toBe(false);
});

test("removing an item leaves the others alone", () => {
  insertItem({ name: "Milk", quantity: 1, unitPricePence: 175 });

  deleteItem(getItems()[0].id);

  expect(getItems().map((item) => item.name)).toEqual(["Milk"]);
});

test("a duplicate name is rejected by the database", () => {
  expect(() => insertItem({ name: "Kale", quantity: 1, unitPricePence: 999 })).toThrow();
});

test("a duplicate name is rejected whatever the capitalisation", () => {
  expect(() => insertItem({ name: "KALE", quantity: 1, unitPricePence: 999 })).toThrow();
});