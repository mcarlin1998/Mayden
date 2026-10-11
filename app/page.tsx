"use client";

import { useState } from "react";
import styles from "./page.module.css";
import AddItemForm from "./components/AddItemForm";
import ItemRow from "./components/ItemRow";
import { formatPrice, totalOf } from "./money";
import type { Item } from "./types";

// Hardcoded until the list is stored. New items are added to this below.
const startingItems: Item[] = [
  { id: 1, name: "Oat milk", quantity: 2, unitPricePence: 175 },
  { id: 2, name: "Soda bread", quantity: 1, unitPricePence: 210 },
  { id: 3, name: "Kale", quantity: 1, unitPricePence: 150 },
  { id: 4, name: "Weetabix", quantity: 2, unitPricePence: 265 },
];

export default function Home() {
  const [items, setItems] = useState(startingItems);

  // Highest id plus one, so ids stay unique after items are removed.
  const nextId = items.length > 0 ? Math.max(...items.map((item) => item.id)) + 1 : 1;

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1 className={styles.title}>Weekly shop</h1>
        <p className={styles.subtitle}>{items.length} items</p>
      </header>

      <AddItemForm
        existingItems={items}
        nextId={nextId}
        onAdd={(item) => setItems([...items, item])}
      />

      {items.length === 0 ? (
        <p className={styles.empty}>Nothing on the list yet.</p>
      ) : (
        <ul className={styles.list}>
          {items.map((item) => (
            <ItemRow
              key={item.id}
              item={item}
              onRemove={(id) => setItems(items.filter((i) => i.id !== id))}
            />
          ))}
        </ul>
      )}

      <footer className={styles.footer}>
        <span className={styles.footerLabel}>Total</span>
        <span className={styles.footerTotal}>{formatPrice(totalOf(items))}</span>
      </footer>
    </main>
  );
}