import styles from "./page.module.css";
import AddItemForm from "./components/AddItemForm";
import ItemRow from "./components/ItemRow";
import { formatPrice, totalOf } from "./money";
import { getItems } from "@/lib/db";

export default async function Home() {
  const items = getItems();

  const remaining = items.filter((item) => !item.isChecked);

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1 className={styles.title}>Weekly shop</h1>
        <p className={styles.subtitle}>
          {items.length > 0 &&
            (remaining.length === 0
              ? "All picked up"
              : `${remaining.length} of ${items.length} still to find`)}
        </p>
      </header>

      <AddItemForm />

      {items.length === 0 ? (
        <p className={styles.empty}>Nothing on the list yet.</p>
      ) : (
        <ul className={styles.list}>
          {items.map((item) => (
            <ItemRow key={item.id} item={item} />
          ))}
        </ul>
      )}

      <footer className={styles.footer}>
        <div className={styles.footerTotals}>
          <span className={styles.footerLabel}>Total</span>
          <span className={styles.footerTotal}>{formatPrice(totalOf(items))}</span>
        </div>
      </footer>
    </main>
  );
}