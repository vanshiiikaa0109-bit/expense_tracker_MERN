// src/jobs/recurringExpense.job.js
// Cron job that automatically creates recurring expenses on their due date

import cron from "node-cron";
import Expense from "../models/Expense.js";
import Notification from "../models/Notification.js";

/**
 * Calculate the next due date based on frequency
 * @param {Date} lastDate - Last expense date
 * @param {string} frequency - daily | weekly | monthly | yearly
 * @returns {Date}
 */
const getNextDueDate = (lastDate, frequency) => {
  const next = new Date(lastDate);

  switch (frequency) {
    case "daily":
      next.setDate(next.getDate() + 1);
      break;
    case "weekly":
      next.setDate(next.getDate() + 7);
      break;
    case "monthly":
      next.setMonth(next.getMonth() + 1);
      break;
    case "yearly":
      next.setFullYear(next.getFullYear() + 1);
      break;
    default:
      break;
  }

  return next;
};

/**
 * Process all recurring expenses that are due today
 */
const processRecurringExpenses = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Find all recurring expenses whose nextDueDate falls today
    const dueExpenses = await Expense.find({
      isRecurring: true,
      nextDueDate: { $gte: today, $lt: tomorrow },
    });

    if (dueExpenses.length === 0) {
      console.log("[RecurringExpenseJob] No recurring expenses due today.");
      return;
    }

    console.log(`[RecurringExpenseJob] Processing ${dueExpenses.length} recurring expense(s)...`);

    for (const expense of dueExpenses) {
      // Create a new expense entry cloned from the recurring template
      const newExpense = await Expense.create({
        user: expense.user,
        title: expense.title,
        amount: expense.amount,
        category: expense.category,
        type: expense.type,
        date: today,
        note: expense.note,
        wallet: expense.wallet,
        isRecurring: false, // The clone itself is not recurring
      });

      // Update the nextDueDate on the original recurring expense
      const nextDue = getNextDueDate(expense.nextDueDate, expense.recurringFrequency);
      await Expense.findByIdAndUpdate(expense._id, { nextDueDate: nextDue });

      // Send an in-app notification to the user
      await Notification.create({
        user: expense.user,
        title: "Recurring Expense Added",
        message: `Your recurring expense "${expense.title}" of $${expense.amount} has been automatically added.`,
        type: "reminder",
      });

      console.log(
        `[RecurringExpenseJob] Created expense "${newExpense.title}" for user ${expense.user}`
      );
    }

    console.log("[RecurringExpenseJob] Done.");
  } catch (error) {
    console.error(`[RecurringExpenseJob] Error: ${error.message}`);
  }
};

/**
 * Start the recurring expense cron job
 * Runs every day at 12:00 AM (midnight)
 */
export const startRecurringExpenseJob = () => {
  // Schedule: every day at 00:00
  cron.schedule("0 0 * * *", async () => {
    console.log("[RecurringExpenseJob] Running at midnight...");
    await processRecurringExpenses();
  });

  console.log("[RecurringExpenseJob] Scheduled — runs daily at midnight.");
};
