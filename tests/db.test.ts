import { test, expect, beforeEach } from "vitest";

import { db, deleteItem, getItems, insertItem, moveItemUp, toggleItem } from "@/lib/db";

// Stories 5 and 6: the shopping list is stored, and its order can be changed.

const names = () => getItems().map((item) => item.name);

// Each test starts from the same known list. The in-memory database is left
// empty by lib/db.ts, so seed a single item here.
beforeEach(() => {
  db.exec("DELETE FROM items");
  insertItem({ name: "Kale", quantity: 1, unitPricePence: 150 });
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
  toggleItem(getItems()[0].id);
  expect(getItems()[0].isChecked).toBe(true);

  toggleItem(getItems()[0].id);
  expect(getItems()[0].isChecked).toBe(false);
});

test("a duplicate name is rejected whatever the capitalisation", () => {
  expect(() => insertItem({ name: "KALE", quantity: 1, unitPricePence: 999 })).toThrow();
});

test("removing an item leaves the others alone", () => {
  insertItem({ name: "Milk", quantity: 1, unitPricePence: 175 });
  // List is Milk, Kale.

  deleteItem(getItems()[0].id);

  expect(names()).toEqual(["Kale"]);
});

test("a new item is added to the top of the list", () => {
  insertItem({ name: "Milk", quantity: 1, unitPricePence: 175 });
  insertItem({ name: "Bread", quantity: 1, unitPricePence: 210 });
  // List is Bread, Milk, Kale.

  expect(names()).toEqual(["Bread", "Milk", "Kale"]);
});

test("an item can be moved earlier in the list", () => {
  insertItem({ name: "Milk", quantity: 1, unitPricePence: 175 });
  insertItem({ name: "Bread", quantity: 1, unitPricePence: 210 });
  // List is Bread, Milk, Kale.

  moveItemUp(getItems()[2].id); // move Kale up one place

  expect(names()).toEqual(["Bread", "Kale", "Milk"]);
});

test("the first item cannot move any earlier", () => {
  moveItemUp(getItems()[0].id);

  expect(names()).toEqual(["Kale"]);
});

test("removing an item keeps the rest in order", () => {
  insertItem({ name: "Milk", quantity: 1, unitPricePence: 175 });
  insertItem({ name: "Bread", quantity: 1, unitPricePence: 210 });
  // List is Bread, Milk, Kale.

  deleteItem(getItems()[1].id); // remove Milk from the middle

  expect(names()).toEqual(["Bread", "Kale"]);

  moveItemUp(getItems()[1].id); // ordering must still work afterwards

  expect(names()).toEqual(["Kale", "Bread"]);
});