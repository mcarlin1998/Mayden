"use client";

import { useState } from "react";
import styles from "./page.module.css";
import AddItemForm from "./components/AddItemForm";
import ItemRow from "./components/ItemRow";
import { formatPrice, totalOf } from "./money";
import type { Item } from "./types";

// Hardcoded until the list is stored. New items are added to this below.
const startingItems: Item[] = [
  { id: 1, name: "Oat milk", quantity: 2, unitPricePence: 175, isChecked: false },
  { id: 2, name: "Soda bread", quantity: 1, unitPricePence: 210, isChecked: false },
  { id: 3, name: "Kale", quantity: 1, unitPricePence: 150, isChecked: false },
  { id: 4, name: "Weetabix", quantity: 2, unitPricePence: 265, isChecked: false },
];

export default function Home() {
  const [items, setItems] = useState(startingItems);

  // Highest id plus one, so ids stay unique after items are removed.
  const nextId = items.length > 0 ? Math.max(...items.map((item) => item.id)) + 1 : 1;

  // Crossing an item off marks it as picked up. It still counts towards the
  // total, because the shop costs the same whether it is in the basket or not.
  const toggleItem = (id: number) =>
    setItems(
      items.map((item) => (item.id === id ? { ...item, isChecked: !item.isChecked } : item)),
    );

  // Splitting the list lets a shopper see what is still needed without reading
  // through everything they have already picked up.
  const toFind = items.filter((item) => !item.isChecked);
  const inBasket = items.filter((item) => item.isChecked);

  const renderRows = (list: Item[]) =>
    list.map((item) => (
      <ItemRow
        key={item.id}
        item={item}
        onToggle={toggleItem}
        onRemove={(id) => setItems(items.filter((i) => i.id !== id))}
      />
    ));

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1 className={styles.title}>Weekly shop</h1>
        <p className={styles.subtitle}>
          {toFind.length === 0 && items.length > 0
            ? "All picked up"
            : `${toFind.length} of ${items.length} still to find`}
        </p>
      </header>

      <AddItemForm
        existingItems={items}
        nextId={nextId}
        onAdd={(item) => setItems([...items, { ...item, isChecked: false }])}
      />

      {items.length === 0 ? (
        <p className={styles.empty}>Nothing on the list yet.</p>
      ) : (
        <>
          {toFind.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionHeading}>Still to find</h2>
              <ul className={styles.list}>{renderRows(toFind)}</ul>
            </section>
          )}

          {inBasket.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionHeading}>In basket</h2>
              <ul className={styles.list}>{renderRows(inBasket)}</ul>
            </section>
          )}
        </>
      )}

      <footer className={styles.footer}>
        <div className={styles.footerTotals}>
          <span className={styles.footerLabel}>Total</span>
          <span className={styles.footerTotal}>{formatPrice(totalOf(items))}</span>
        </div>
        {inBasket.length > 0 && toFind.length > 0 && (
          <div className={styles.footerTotals}>
            <span className={styles.footerNote}>Left to spend</span>
            <span className={styles.footerRemaining}>{formatPrice(totalOf(toFind))}</span>
          </div>
        )}
      </footer>
    </main>
  );
}