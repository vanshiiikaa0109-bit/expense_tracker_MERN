// src/repositories/expense.repository.js
// All database queries related to the Expense model

import Expense from "../models/Expense.js";

// Create a new expense
export const createExpense = async (data) => {
  return await Expense.create(data);
};

// Find a single expense by ID and user (ownership check)
export const findExpenseById = async (expenseId, userId) => {
  return await Expense.findOne({ _id: expenseId, user: userId })
    .populate("wallet", "name type currency")
    .populate("receipt", "imageUrl");
};

// Find all expenses for a user with optional filters and pagination
export const findAllExpenses = async (userId, filters = {}, options = {}) => {
  const {
    category,
    type,
    startDate,
    endDate,
    wallet,
    isRecurring,
    search,
  } = filters;

  const { page = 1, limit = 10, sortBy = "date", sortOrder = "desc" } = options;

  const query = { user: userId };

  if (category) query.category = category;
  if (type) query.type = type;
  if (wallet) query.wallet = wallet;
  if (isRecurring !== undefined) query.isRecurring = isRecurring;

  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);
  }

  if (search) {
    query.title = { $regex: search, $options: "i" };
  }

  const skip = (page - 1) * limit;
  const sort = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

  const [expenses, total] = await Promise.all([
    Expense.find(query)
      .populate("wallet", "name type currency")
      .populate("receipt", "imageUrl")
      .sort(sort)
      .skip(skip)
      .limit(Number(limit)),
    Expense.countDocuments(query),
  ]);

  return {
    expenses,
    total,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(total / limit),
  };
};

// Update an expense by ID and user
export const updateExpenseById = async (expenseId, userId, updateData) => {
  return await Expense.findOneAndUpdate(
    { _id: expenseId, user: userId },
    { $set: updateData },
    { new: true, runValidators: true }
  ).populate("wallet", "name type currency");
};

// Delete an expense by ID and user
export const deleteExpenseById = async (expenseId, userId) => {
  return await Expense.findOneAndDelete({ _id: expenseId, user: userId });
};

// Aggregate expenses grouped by category for a user
export const aggregateByCategory = async (userId, startDate, endDate) => {
  const match = {
    user: userId,
    type: "expense",
  };

  if (startDate || endDate) {
    match.date = {};
    if (startDate) match.date.$gte = new Date(startDate);
    if (endDate) match.date.$lte = new Date(endDate);
  }

  return await Expense.aggregate([
    { $match: match },
    {
      $group: {
        _id: "$category",
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
    { $sort: { total: -1 } },
    {
      $project: {
        _id: 0,
        category: "$_id",
        total: 1,
        count: 1,
      },
    },
  ]);
};

// Aggregate monthly spending totals for a given year
export const aggregateMonthlyTrend = async (userId, year) => {
  return await Expense.aggregate([
    {
      $match: {
        user: userId,
        type: "expense",
        date: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { month: { $month: "$date" } },
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.month": 1 } },
    {
      $project: {
        _id: 0,
        month: "$_id.month",
        total: 1,
        count: 1,
      },
    },
  ]);
};

// Aggregate total income and expense for a given date range
export const aggregateSummary = async (userId, startDate, endDate) => {
  const match = { user: userId };

  if (startDate || endDate) {
    match.date = {};
    if (startDate) match.date.$gte = new Date(startDate);
    if (endDate) match.date.$lte = new Date(endDate);
  }

  return await Expense.aggregate([
    { $match: match },
    {
      $group: {
        _id: "$type",
        total: { $sum: "$amount" },
        count: { $sum: 1 },
        avg: { $avg: "$amount" },
      },
    },
  ]);
};

// Aggregate daily spending for a given month and year
export const aggregateDailySpending = async (userId, month, year) => {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59, 999);

  return await Expense.aggregate([
    {
      $match: {
        user: userId,
        type: "expense",
        date: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: { day: { $dayOfMonth: "$date" } },
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.day": 1 } },
    {
      $project: {
        _id: 0,
        day: "$_id.day",
        total: 1,
        count: 1,
      },
    },
  ]);
};

// Get expenses for a specific month and year (used in report generation)
export const findExpensesByMonthYear = async (userId, month, year) => {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59, 999);

  return await Expense.find({
    user: userId,
    date: { $gte: startDate, $lte: endDate },
  }).sort({ date: -1 });
};
