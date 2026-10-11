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

      -- Story 2: an item name may only appear once. Enforced here rather than
      -- in the UI so it cannot be bypassed.
      UNIQUE (name COLLATE NOCASE)
    );
  `);

  // Seeds a new database so the list is not empty on first run.
  const { count } = database.prepare("SELECT COUNT(*) AS count FROM items").get() as {
    count: number;
  };

  if (count === 0) {
    const add = database.prepare(
      "INSERT INTO items (name, quantity, unit_price_pence, is_checked) VALUES (?, ?, ?, ?)",
    );
    add.run("Oat milk", 2, 175, 0);
    add.run("Soda bread", 1, 210, 0);
    add.run("Kale", 1, 150, 0);
    add.run("Weetabix", 2, 265, 0);
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
       FROM items ORDER BY id`,
    )
    .all() as unknown as (Omit<Item, "isChecked"> & { isChecked: number })[];

  return rows.map((row) => ({ ...row, isChecked: row.isChecked === 1 }));
}

export function insertItem(item: Omit<Item, "id" | "isChecked">): void {
  db.prepare(
    "INSERT INTO items (name, quantity, unit_price_pence, is_checked) VALUES (?, ?, ?, 0)",
  ).run(item.name, item.quantity, item.unitPricePence);
}

export function deleteItem(id: number): void {
  db.prepare("DELETE FROM items WHERE id = ?").run(id);
}

export function toggleItem(id: number): void {
  db.prepare("UPDATE items SET is_checked = 1 - is_checked WHERE id = ?").run(id);
}