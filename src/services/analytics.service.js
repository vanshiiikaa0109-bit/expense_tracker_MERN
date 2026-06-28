// src/services/analytics.service.js
// Business logic for spending analytics, trends, and insights

import { STATUS_CODES } from "../constants/statusCodes.js";
import {
  aggregateSummary,
  aggregateMonthlyTrend,
  aggregateByCategory,
  aggregateDailySpending,
} from "../repositories/expense.repository.js";

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

export const getExpenseSummary = async (userId, query = {}) => {
  const { startDate, endDate } = query;
  const results = await aggregateSummary(userId, startDate, endDate);

  const summary = { totalExpense: 0, totalIncome: 0, expenseCount: 0, incomeCount: 0, avgExpense: 0, avgIncome: 0 };

  results.forEach((r) => {
    if (r._id === "expense") {
      summary.totalExpense  = parseFloat(r.total.toFixed(2));
      summary.expenseCount  = r.count;
      summary.avgExpense    = parseFloat(r.avg.toFixed(2));
    }
    if (r._id === "income") {
      summary.totalIncome   = parseFloat(r.total.toFixed(2));
      summary.incomeCount   = r.count;
      summary.avgIncome     = parseFloat(r.avg.toFixed(2));
    }
  });

  summary.netSavings = parseFloat((summary.totalIncome - summary.totalExpense).toFixed(2));
  summary.savingsRate = summary.totalIncome > 0
    ? parseFloat(((summary.netSavings / summary.totalIncome) * 100).toFixed(2))
    : 0;

  return summary;
};

export const getMonthlyTrend = async (userId, query = {}) => {
  const year = parseInt(query.year) || new Date().getFullYear();
  const data  = await aggregateMonthlyTrend(userId, year);

  // Fill in all 12 months with 0 for months with no data
  const months = Array.from({ length: 12 }, (_, i) => {
    const found = data.find((d) => d.month === i + 1);
    return {
      month: i + 1,
      monthName: new Date(year, i, 1).toLocaleString("default", { month: "short" }),
      total: found ? parseFloat(found.total.toFixed(2)) : 0,
      count: found ? found.count : 0,
    };
  });

  return { year, months };
};

export const getCategoryBreakdown = async (userId, query = {}) => {
  const { startDate, endDate } = query;
  const data = await aggregateByCategory(userId, startDate, endDate);

  const grandTotal = data.reduce((sum, d) => sum + d.total, 0);

  return data.map((d) => ({
    ...d,
    total: parseFloat(d.total.toFixed(2)),
    percentage: grandTotal > 0
      ? parseFloat(((d.total / grandTotal) * 100).toFixed(2))
      : 0,
  }));
};

export const getTopCategories = async (userId, query = {}) => {
  const { startDate, endDate, limit = 5 } = query;
  const data = await aggregateByCategory(userId, startDate, endDate);
  return data.slice(0, Number(limit));
};

export const getDailySpending = async (userId, query = {}) => {
  const month = parseInt(query.month) || new Date().getMonth() + 1;
  const year  = parseInt(query.year)  || new Date().getFullYear();

  const data = await aggregateDailySpending(userId, month, year);

  // Fill all days of the month
  const daysInMonth = new Date(year, month, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const found = data.find((d) => d.day === i + 1);
    return {
      day: i + 1,
      total: found ? parseFloat(found.total.toFixed(2)) : 0,
      count: found ? found.count : 0,
    };
  });

  return { month, year, days };
};

export const getSpendingInsights = async (userId) => {
  const now      = new Date();
  const month    = now.getMonth() + 1;
  const year     = now.getFullYear();
  const lastMonth = month === 1 ? 12 : month - 1;
  const lastYear  = month === 1 ? year - 1 : year;

  // Current month summary
  const startOfMonth = new Date(year, month - 1, 1).toISOString();
  const endOfMonth   = new Date(year, month, 0, 23, 59, 59).toISOString();

  // Previous month summary
  const startOfLast = new Date(lastYear, lastMonth - 1, 1).toISOString();
  const endOfLast   = new Date(lastYear, lastMonth, 0, 23, 59, 59).toISOString();

  const [currentResults, lastResults, topCategories] = await Promise.all([
    aggregateSummary(userId, startOfMonth, endOfMonth),
    aggregateSummary(userId, startOfLast, endOfLast),
    aggregateByCategory(userId, startOfMonth, endOfMonth),
  ]);

  const currentExpense = currentResults.find((r) => r._id === "expense")?.total || 0;
  const lastExpense    = lastResults.find((r) => r._id === "expense")?.total    || 0;

  const changePercent = lastExpense > 0
    ? parseFloat((((currentExpense - lastExpense) / lastExpense) * 100).toFixed(2))
    : null;

  const insights = [];

  // Insight: spending change vs last month
  if (changePercent !== null) {
    if (changePercent > 20) {
      insights.push({
        type: "warning",
        message: `Your spending is up ${changePercent}% compared to last month. Consider reviewing your expenses.`,
      });
    } else if (changePercent < -10) {
      insights.push({
        type: "success",
        message: `Great job! Your spending is down ${Math.abs(changePercent)}% compared to last month.`,
      });
    } else {
      insights.push({
        type: "info",
        message: `Your spending is relatively stable compared to last month (${changePercent > 0 ? "+" : ""}${changePercent}%).`,
      });
    }
  }

  // Insight: top spending category
  if (topCategories.length > 0) {
    const top = topCategories[0];
    insights.push({
      type: "info",
      message: `Your highest spending category this month is "${top.category}" at $${top.total.toFixed(2)}.`,
    });
  }

  // Insight: if no expenses this month
  if (currentExpense === 0) {
    insights.push({
      type: "info",
      message: "No expenses recorded this month yet. Start tracking to see insights.",
    });
  }

  return {
    currentMonthExpense: parseFloat(currentExpense.toFixed(2)),
    lastMonthExpense:    parseFloat(lastExpense.toFixed(2)),
    changePercent,
    topCategory: topCategories[0]?.category || null,
    insights,
  };
};
