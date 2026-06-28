// src/services/expense.service.js
// Business logic for expense and income transaction management

import { STATUS_CODES } from "../constants/statusCodes.js";
import { EXPENSE_MESSAGES } from "../constants/messages.js";
import {
  createExpense,
  findExpenseById,
  findAllExpenses,
  updateExpenseById,
  deleteExpenseById,
  aggregateByCategory,
} from "../repositories/expense.repository.js";
import Notification from "../models/Notification.js";
import Budget from "../models/Budget.js";

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

// ─── Check budget threshold and notify user ───────────────────────────────────
const checkBudgetAlert = async (userId, category, type) => {
  if (type !== "expense") return;

  const budget = await Budget.findOne({ user: userId, category, isActive: true });
  if (!budget) return;

  const usagePercent = (budget.spent / budget.limit) * 100;

  if (usagePercent >= 100) {
    await Notification.create({
      user: userId,
      title: "Budget Exceeded!",
      message: `You have exceeded your ${category} budget. Spent: $${budget.spent} / Limit: $${budget.limit}`,
      type: "budget",
      refId: budget._id,
      refModel: "Budget",
    });
  } else if (usagePercent >= budget.alertThreshold) {
    await Notification.create({
      user: userId,
      title: "Budget Alert",
      message: `You have used ${usagePercent.toFixed(1)}% of your ${category} budget.`,
      type: "budget",
      refId: budget._id,
      refModel: "Budget",
    });
  }
};

// ─── Update budget spent amount ───────────────────────────────────────────────
const updateBudgetSpent = async (userId, category, amountDelta) => {
  await Budget.findOneAndUpdate(
    { user: userId, category, isActive: true },
    { $inc: { spent: amountDelta } }
  );
};

// ─── CRUD ─────────────────────────────────────────────────────────────────────

export const createExpense = async (userId, data) => {
  const expense = await createExpense({ ...data, user: userId });

  // Update budget tracking for expense type
  if (data.type === "expense") {
    await updateBudgetSpent(userId, data.category, data.amount);
    await checkBudgetAlert(userId, data.category, data.type);
  }

  return expense;
};

export const getAllExpenses = async (userId, query = {}) => {
  const {
    category, type, startDate, endDate,
    wallet, isRecurring, search,
    page, limit, sortBy, sortOrder,
  } = query;

  return await findAllExpenses(
    userId,
    { category, type, startDate, endDate, wallet, isRecurring, search },
    { page, limit, sortBy, sortOrder }
  );
};

export const getExpenseById = async (userId, expenseId) => {
  const expense = await findExpenseById(expenseId, userId);
  if (!expense) throw createError(EXPENSE_MESSAGES.NOT_FOUND, STATUS_CODES.NOT_FOUND);
  return expense;
};

export const updateExpense = async (userId, expenseId, data) => {
  const existing = await findExpenseById(expenseId, userId);
  if (!existing) throw createError(EXPENSE_MESSAGES.NOT_FOUND, STATUS_CODES.NOT_FOUND);

  // Reverse the old budget impact and apply the new one
  if (existing.type === "expense") {
    await updateBudgetSpent(userId, existing.category, -existing.amount);
  }

  const updated = await updateExpenseById(expenseId, userId, data);

  if (updated.type === "expense") {
    await updateBudgetSpent(userId, updated.category, updated.amount);
    await checkBudgetAlert(userId, updated.category, updated.type);
  }

  return updated;
};

export const deleteExpense = async (userId, expenseId) => {
  const expense = await findExpenseById(expenseId, userId);
  if (!expense) throw createError(EXPENSE_MESSAGES.NOT_FOUND, STATUS_CODES.NOT_FOUND);

  // Reverse the budget impact
  if (expense.type === "expense") {
    await updateBudgetSpent(userId, expense.category, -expense.amount);
  }

  await deleteExpenseById(expenseId, userId);
};

export const getExpensesByCategory = async (userId, query = {}) => {
  const { startDate, endDate } = query;
  return await aggregateByCategory(userId, startDate, endDate);
};
