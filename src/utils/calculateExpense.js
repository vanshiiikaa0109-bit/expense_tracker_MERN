// src/utils/calculateExpense.js
// Reusable helper functions for expense calculations

/**
 * Calculate the total amount from an array of expense objects
 * @param {Array} expenses - Array of expense documents
 * @param {string} type - "expense" | "income" | undefined (all)
 * @returns {number} Total amount rounded to 2 decimal places
 */
export const calculateTotal = (expenses, type) => {
  const filtered = type
    ? expenses.filter((e) => e.type === type)
    : expenses;

  return parseFloat(
    filtered.reduce((sum, e) => sum + e.amount, 0).toFixed(2)
  );
};

/**
 * Calculate net savings (income - expense)
 * @param {number} totalIncome
 * @param {number} totalExpense
 * @returns {number}
 */
export const calculateNetSavings = (totalIncome, totalExpense) => {
  return parseFloat((totalIncome - totalExpense).toFixed(2));
};

/**
 * Calculate savings rate as a percentage
 * @param {number} netSavings
 * @param {number} totalIncome
 * @returns {number} Percentage (0-100)
 */
export const calculateSavingsRate = (netSavings, totalIncome) => {
  if (totalIncome === 0) return 0;
  return parseFloat(((netSavings / totalIncome) * 100).toFixed(2));
};

/**
 * Calculate average amount from an array of expenses
 * @param {Array} expenses
 * @returns {number}
 */
export const calculateAverage = (expenses) => {
  if (!expenses || expenses.length === 0) return 0;
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  return parseFloat((total / expenses.length).toFixed(2));
};

/**
 * Calculate budget usage percentage
 * @param {number} spent
 * @param {number} limit
 * @returns {number} Percentage (can exceed 100)
 */
export const calculateBudgetUsage = (spent, limit) => {
  if (limit === 0) return 0;
  return parseFloat(((spent / limit) * 100).toFixed(2));
};

/**
 * Group expenses by category and sum amounts
 * @param {Array} expenses
 * @returns {Array} [{ category, total, count, percentage }]
 */
export const groupByCategory = (expenses) => {
  const map = {};

  expenses.forEach((e) => {
    if (e.type !== "expense") return;
    if (!map[e.category]) {
      map[e.category] = { category: e.category, total: 0, count: 0 };
    }
    map[e.category].total += e.amount;
    map[e.category].count += 1;
  });

  const result = Object.values(map);
  const grandTotal = result.reduce((sum, r) => sum + r.total, 0);

  return result
    .map((r) => ({
      ...r,
      total: parseFloat(r.total.toFixed(2)),
      percentage:
        grandTotal > 0
          ? parseFloat(((r.total / grandTotal) * 100).toFixed(2))
          : 0,
    }))
    .sort((a, b) => b.total - a.total);
};

/**
 * Calculate average daily spending for a month
 * @param {number} totalExpense
 * @param {number} month - 1-12
 * @param {number} year
 * @returns {number}
 */
export const calculateAvgDailySpend = (totalExpense, month, year) => {
  const daysInMonth = new Date(year, month, 0).getDate();
  return parseFloat((totalExpense / daysInMonth).toFixed(2));
};
