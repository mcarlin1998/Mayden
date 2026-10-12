"use client";

import styles from "../page.module.css";
import { setBudget } from "../actions";

// Story 8: the spending limit sits next to the total, because that is where it
// is compared. Blank clears the limit.
export default function BudgetForm({ limitPence }: { limitPence: number | null }) {
  return (
    <form action={setBudget} className={styles.budgetForm}>
      <label className={styles.budgetLabel} htmlFor="budget-limit">
        Spending limit
      </label>
      <input
        id="budget-limit"
        name="limit"
        type="number"
        min="0"
        step="0.01"
        className={`${styles.input} ${styles.budgetInput}`}
        defaultValue={limitPence === null ? "" : (limitPence / 100).toString()}
        placeholder="No limit"
      />
      <button className={styles.button} type="submit">
        Set
      </button>
    </form>
  );
}