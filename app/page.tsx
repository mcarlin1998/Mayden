"use client";

import { useState } from "react";
import styles from "./page.module.css";
import AddItemForm from "./components/AddItemForm";

type Item = {
  id: number;
  name: string;
  quantity: number;
  unitPricePence: number;
};

// Hardcoded until the list is stored. New items are added to this below.
const startingItems: Item[] = [
  { id: 1, name: "Oat milk", quantity: 2, unitPricePence: 175 },
  { id: 2, name: "Soda bread", quantity: 1, unitPricePence: 210 },
  { id: 3, name: "Kale", quantity: 1, unitPricePence: 150 },
  { id: 4, name: "Weetabix", quantity: 2, unitPricePence: 265 },
];

// Prices are held as integer pence to avoid floating point rounding errors.
// Dividing by 100 for display only.
const gbp = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
});

const formatPrice = (pence: number) => gbp.format(pence / 100);

export default function Home() {
  const [items, setItems] = useState(startingItems);

  const totalPence = items.reduce((sum, item) => sum + item.quantity * item.unitPricePence, 0);
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
            <li key={item.id} className={styles.row}>
              <span className={styles.name}>{item.name}</span>
              <span className={styles.quantity}>x{item.quantity}</span>
              <span className={styles.lineTotal}>
                {formatPrice(item.quantity * item.unitPricePence)}
              </span>
            </li>
          ))}
        </ul>
      )}

      <footer className={styles.footer}>
        <span className={styles.footerLabel}>Total</span>
        <span className={styles.footerTotal}>{formatPrice(totalPence)}</span>
      </footer>
    </main>
  );
}