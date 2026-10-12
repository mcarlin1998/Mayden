import { DatabaseSync } from "node:sqlite";
import path from "node:path";

import type { Item } from "@/app/types";

// A file-backed database so the shopping list survives page reloads and server
// restarts. Ignored by git via the *.db rule.
const DB_PATH = process.env.DATABASE_PATH ?? path.join(process.cwd(), "shopping_list.db");

declare global {
  // The dev server re-evaluates modules on hot reload. Caching the connection
  // on globalThis avoids opening a new handle each time.
  var __db: DatabaseSync | undefined;
}

function createDatabase(): DatabaseSync {
  const database = new DatabaseSync(DB_PATH);

  database.exec(`
    CREATE TABLE IF NOT EXISTS items (
      id               INTEGER PRIMARY KEY AUTOINCREMENT,
      name             TEXT    NOT NULL,
      quantity         INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
      unit_price_pence INTEGER NOT NULL CHECK (unit_price_pence >= 0),
      is_checked       INTEGER NOT NULL DEFAULT 0 CHECK (is_checked IN (0, 1)),
      -- Story 6: the order the shopper walks through the shop.
      position         INTEGER NOT NULL,

      -- Story 2: an item name may only appear once. Enforced here rather than
      -- in the UI so it cannot be bypassed.
      UNIQUE (name COLLATE NOCASE)
    );

    -- Story 8: the shop's spending limit, in pence. Null until one is set.
    CREATE TABLE IF NOT EXISTS settings (
      key   TEXT PRIMARY KEY,
      value INTEGER
    );
  `);

  // Seeds a new database so the list is not empty on first run. Tests use an
  // in-memory database and set their own data, so they are left empty.
  const { count } = database.prepare("SELECT COUNT(*) AS count FROM items").get() as {
    count: number;
  };

  if (count === 0 && DB_PATH !== ":memory:") {
    const add = database.prepare(
      "INSERT INTO items (name, quantity, unit_price_pence, is_checked, position) VALUES (?, ?, ?, 0, ?)",
    );
    const examples: [string, number, number][] = [
      ["Oat milk", 2, 175],
      ["Soda bread", 1, 210],
      ["Kale", 1, 150],
      ["Weetabix", 2, 265],
    ];

    examples.forEach(([name, quantity, unitPricePence], position) => {
      add.run(name, quantity, unitPricePence, position);
    });
  }

  return database;
}

export const db: DatabaseSync = globalThis.__db ?? createDatabase();

if (process.env.NODE_ENV !== "production") {
  globalThis.__db = db;
}

export function getItems(): Item[] {
  // Aliased so the column names match the Item type used across the app.
  // SQLite has no boolean type, so is_checked arrives as 0 or 1.
  const rows = db
    .prepare(
      `SELECT id, name, quantity, unit_price_pence AS unitPricePence,
              is_checked AS isChecked
       FROM items ORDER BY position`,
    )
    .all() as unknown as (Omit<Item, "isChecked"> & { isChecked: number })[];

  return rows.map((row) => ({ ...row, isChecked: row.isChecked === 1 }));
}

export function insertItem(item: Omit<Item, "id" | "isChecked">): void {
  // A new item goes to the top of the route, because you add it while
  // standing in the aisle where you found it.
  const { next } = db.prepare("SELECT COALESCE(MIN(position), 0) - 1 AS next FROM items").get() as {
    next: number;
  };

  db.prepare(
    "INSERT INTO items (name, quantity, unit_price_pence, is_checked, position) VALUES (?, ?, ?, 0, ?)",
  ).run(item.name, item.quantity, item.unitPricePence, next);
}

/**
 * Swaps an item with the one directly before it. Positions are always
 * contiguous, so exchanging the two is enough.
 */
export function moveItemUp(id: number): void {
  const rows = db
    .prepare("SELECT id, position FROM items ORDER BY position")
    .all() as { id: number; position: number }[];

  const index = rows.findIndex((row) => row.id === id);
  if (index <= 0) return; // already first, nothing to do

  db.exec("BEGIN");
  try {
    const swap = db.prepare("UPDATE items SET position = ? WHERE id = ?");
    swap.run(rows[index - 1].position, rows[index].id);
    swap.run(rows[index].position, rows[index - 1].id);
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

export function deleteItem(id: number): void {
  // Closing the gap keeps the remaining positions contiguous, so ordering by
  // position stays correct.
  const removed = db.prepare("SELECT position FROM items WHERE id = ?").get(id) as
    | { position: number }
    | undefined;
  if (!removed) return;

  db.exec("BEGIN");
  try {
    db.prepare("DELETE FROM items WHERE id = ?").run(id);
    db.prepare("UPDATE items SET position = position - 1 WHERE position > ?").run(
      removed.position,
    );
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

export function toggleItem(id: number): void {
  db.prepare("UPDATE items SET is_checked = 1 - is_checked WHERE id = ?").run(id);
}

/** The shop's spending limit in pence, or null when none has been set. */
export function getBudgetLimit(): number | null {
  const row = db.prepare("SELECT value FROM settings WHERE key = 'budget_limit_pence'").get() as
    | { value: number | null }
    | undefined;

  return row?.value ?? null;
}

export function setBudgetLimit(pence: number | null): void {
  db.prepare(
    "INSERT INTO settings (key, value) VALUES ('budget_limit_pence', ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
  ).run(pence);
}