import styles from "./page.module.css";
import AddItemForm from "./components/AddItemForm";
import BudgetForm from "./components/BudgetForm";
import ItemRow from "./components/ItemRow";
import { formatPrice, overBudgetBy, totalOf } from "./money";
import { getBudgetLimit, getItems } from "@/lib/db";

export default async function Home() {
  const items = getItems();
  const limitPence = getBudgetLimit();

  const remaining = items.filter((item) => !item.isChecked);
  const totalPence = totalOf(items);
  const overBy = overBudgetBy(totalPence, limitPence);

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

      {overBy !== null && overBy > 0 && (
        // Stated in words as well as colour, so the warning does not rely on
        // being able to see red.
        <p className={styles.overBudget} role="alert">
          Over budget by {formatPrice(overBy)}
        </p>
      )}

      <footer className={styles.footer}>
        <div className={styles.footerTotals}>
          <span className={styles.footerLabel}>Total</span>
          <span className={overBy ? styles.footerTotalOver : styles.footerTotal}>
            {formatPrice(totalPence)}
          </span>
        </div>
        {limitPence !== null && (
          <div className={styles.footerTotals}>
            <span className={styles.footerNote}>Limit</span>
            <span className={styles.footerRemaining}>{formatPrice(limitPence)}</span>
          </div>
        )}
      </footer>

      <BudgetForm limitPence={limitPence} />
    </main>
  );
}