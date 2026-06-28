// src/jobs/budgetReminder.job.js
// Cron job that checks budget usage and sends alerts when threshold is exceeded

import cron from "node-cron";
import Budget from "../models/Budget.js";
import Expense from "../models/Expense.js";
import Notification from "../models/Notification.js";
import { sendMail } from "../config/mail.js";
import User from "../models/User.js";

/**
 * Get the start and end date range for a budget period
 * @param {string} period - weekly | monthly | yearly
 * @returns {{ startDate: Date, endDate: Date }}
 */
const getPeriodRange = (period) => {
  const now = new Date();
  let startDate, endDate;

  switch (period) {
    case "weekly": {
      const day = now.getDay();
      startDate = new Date(now);
      startDate.setDate(now.getDate() - day);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      endDate.setHours(23, 59, 59, 999);
      break;
    }
    case "monthly": {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      break;
    }
    case "yearly": {
      startDate = new Date(now.getFullYear(), 0, 1);
      endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
      break;
    }
    default:
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  }

  return { startDate, endDate };
};

/**
 * Check all budgets and send alerts if usage crosses the threshold
 */
const checkBudgetAlerts = async () => {
  try {
    const budgets = await Budget.find({});

    if (budgets.length === 0) {
      console.log("[BudgetReminderJob] No budgets found.");
      return;
    }

    console.log(`[BudgetReminderJob] Checking ${budgets.length} budget(s)...`);

    for (const budget of budgets) {
      const { startDate, endDate } = getPeriodRange(budget.period);

      // Calculate total spent in this budget's category for the current period
      const result = await Expense.aggregate([
        {
          $match: {
            user: budget.user,
            category: budget.category,
            type: "expense",
            date: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $group: {
            _id: null,
            totalSpent: { $sum: "$amount" },
          },
        },
      ]);

      const totalSpent = result.length > 0 ? result[0].totalSpent : 0;
      const usagePercent = (totalSpent / budget.limit) * 100;
      const threshold = budget.alertThreshold || 80;

      // Update the spent field on the budget document
      await Budget.findByIdAndUpdate(budget._id, { spent: totalSpent });

      // Skip if usage is below threshold
      if (usagePercent < threshold) continue;

      const isExceeded = usagePercent >= 100;
      const alertTitle = isExceeded ? "Budget Exceeded!" : "Budget Alert";
      const alertMessage = isExceeded
        ? `You have exceeded your ${budget.category} budget! Spent: $${totalSpent.toFixed(2)} / Limit: $${budget.limit}`
        : `You have used ${usagePercent.toFixed(1)}% of your ${budget.category} budget. Spent: $${totalSpent.toFixed(2)} / Limit: $${budget.limit}`;

      // Avoid duplicate notifications — check if one was already sent today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const existingNotification = await Notification.findOne({
        user: budget.user,
        type: "budget",
        title: alertTitle,
        createdAt: { $gte: today, $lt: tomorrow },
        message: { $regex: budget.category },
      });

      if (existingNotification) {
        console.log(
          `[BudgetReminderJob] Alert already sent today for ${budget.category} — skipping.`
        );
        continue;
      }

      // Create in-app notification
      await Notification.create({
        user: budget.user,
        title: alertTitle,
        message: alertMessage,
        type: "budget",
      });

      // Send email alert to user
      const user = await User.findById(budget.user).select("name email");
      if (user) {
        await sendMail({
          to: user.email,
          subject: `Smart Expense Tracker — ${alertTitle}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
              <h2 style="color: ${isExceeded ? "#e53e3e" : "#dd6b20"};">${alertTitle}</h2>
              <p>Hi <strong>${user.name}</strong>,</p>
              <p>${alertMessage}</p>
              <hr />
              <table style="width:100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px; border: 1px solid #ddd;"><strong>Category</strong></td>
                  <td style="padding: 8px; border: 1px solid #ddd;">${budget.category}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border: 1px solid #ddd;"><strong>Period</strong></td>
                  <td style="padding: 8px; border: 1px solid #ddd;">${budget.period}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border: 1px solid #ddd;"><strong>Budget Limit</strong></td>
                  <td style="padding: 8px; border: 1px solid #ddd;">$${budget.limit}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border: 1px solid #ddd;"><strong>Amount Spent</strong></td>
                  <td style="padding: 8px; border: 1px solid #ddd;">$${totalSpent.toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border: 1px solid #ddd;"><strong>Usage</strong></td>
                  <td style="padding: 8px; border: 1px solid #ddd;">${usagePercent.toFixed(1)}%</td>
                </tr>
              </table>
              <p style="margin-top: 20px; color: #718096; font-size: 12px;">
                This is an automated alert from Smart Expense Tracker.
              </p>
            </div>
          `,
        });

        console.log(
          `[BudgetReminderJob] Alert sent to ${user.email} for category "${budget.category}" (${usagePercent.toFixed(1)}% used).`
        );
      }
    }

    console.log("[BudgetReminderJob] Done.");
  } catch (error) {
    console.error(`[BudgetReminderJob] Error: ${error.message}`);
  }
};

/**
 * Start the budget reminder cron job
 * Runs every day at 8:00 AM
 */
export const startBudgetReminderJob = () => {
  // Schedule: every day at 08:00
  cron.schedule("0 8 * * *", async () => {
    console.log("[BudgetReminderJob] Running at 8:00 AM...");
    await checkBudgetAlerts();
  });

  console.log("[BudgetReminderJob] Scheduled — runs daily at 8:00 AM.");
};
