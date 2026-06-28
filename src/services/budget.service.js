// src/services/budget.service.js
// Business logic for budget creation, management, and status tracking

import Budget from "../models/Budget.js";
import { STATUS_CODES } from "../constants/statusCodes.js";
import { BUDGET_MESSAGES } from "../constants/messages.js";
import { aggregateByCategory } from "../repositories/expense.repository.js";

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

export const createBudget = async (userId, data) => {
  // Prevent duplicate active budget for same category + period
  const existing = await Budget.findOne({
    user: userId,
    category: data.category,
    period: data.period,
    isActive: true,
  });

  if (existing) {
    throw createError(
      `An active ${data.period} budget for ${data.category} already exists`,
      STATUS_CODES.CONFLICT
    );
  }

  return await Budget.create({ ...data, user: userId });
};

export const getAllBudgets = async (userId) => {
  return await Budget.find({ user: userId }).sort({ createdAt: -1 });
};

export const getBudgetById = async (userId, budgetId) => {
  const budget = await Budget.findOne({ _id: budgetId, user: userId });
  if (!budget) throw createError(BUDGET_MESSAGES.NOT_FOUND, STATUS_CODES.NOT_FOUND);
  return budget;
};

export const updateBudget = async (userId, budgetId, data) => {
  const budget = await Budget.findOneAndUpdate(
    { _id: budgetId, user: userId },
    { $set: data },
    { new: true, runValidators: true }
  );
  if (!budget) throw createError(BUDGET_MESSAGES.NOT_FOUND, STATUS_CODES.NOT_FOUND);
  return budget;
};

export const deleteBudget = async (userId, budgetId) => {
  const budget = await Budget.findOneAndDelete({ _id: budgetId, user: userId });
  if (!budget) throw createError(BUDGET_MESSAGES.NOT_FOUND, STATUS_CODES.NOT_FOUND);
};

export const getBudgetStatus = async (userId, budgetId) => {
  const budget = await Budget.findOne({ _id: budgetId, user: userId });
  if (!budget) throw createError(BUDGET_MESSAGES.NOT_FOUND, STATUS_CODES.NOT_FOUND);

  // Re-calculate spent from actual expenses for accuracy
  const categoryData = await aggregateByCategory(
    userId,
    budget.startDate,
    budget.endDate
  );

  const categorySpend = categoryData.find((c) => c.category === budget.category);
  const spent = categorySpend ? categorySpend.total : 0;

  // Sync the budget's spent field
  await Budget.findByIdAndUpdate(budgetId, { spent });

  return {
    budget: {
      ...budget.toObject(),
      spent,
      remaining: Math.max(budget.limit - spent, 0),
      usagePercent: budget.limit > 0
        ? parseFloat(((spent / budget.limit) * 100).toFixed(2))
        : 0,
      isExceeded: spent > budget.limit,
      isNearLimit: spent / budget.limit >= (budget.alertThreshold / 100),
    },
  };
};
