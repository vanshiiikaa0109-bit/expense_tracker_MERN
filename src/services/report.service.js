// src/services/report.service.js
// Business logic for monthly report generation and PDF/Excel export

import { STATUS_CODES } from "../constants/statusCodes.js";
import { REPORT_MESSAGES } from "../constants/messages.js";
import {
  upsertReport,
  findReportById,
  findAllReports,
  deleteReportById,
} from "../repositories/report.repository.js";
import {
  findExpensesByMonthYear,
  aggregateByCategory,
} from "../repositories/expense.repository.js";
import Budget from "../models/Budget.js";
import { exportPDF } from "../utils/exportPDF.js";
import { exportExcel } from "../utils/exportExcel.js";

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

export const generateMonthlyReport = async (userId, { month, year }) => {
  const expenses = await findExpensesByMonthYear(userId, month, year);

  const totalExpense = expenses
    .filter((e) => e.type === "expense")
    .reduce((sum, e) => sum + e.amount, 0);

  const totalIncome = expenses
    .filter((e) => e.type === "income")
    .reduce((sum, e) => sum + e.amount, 0);

  const netSavings = totalIncome - totalExpense;

  // Category breakdown
  const startDate = new Date(year, month - 1, 1);
  const endDate   = new Date(year, month, 0, 23, 59, 59, 999);

  const rawCategories = await aggregateByCategory(userId, startDate, endDate);
  const grandTotal = rawCategories.reduce((sum, c) => sum + c.total, 0);

  const categoryBreakdown = rawCategories.map((c) => ({
    category: c.category,
    total: parseFloat(c.total.toFixed(2)),
    count: c.count,
    percentage: grandTotal > 0
      ? parseFloat(((c.total / grandTotal) * 100).toFixed(2))
      : 0,
  }));

  const topCategory = categoryBreakdown.length > 0 ? categoryBreakdown[0].category : "";

  const daysInMonth = new Date(year, month, 0).getDate();
  const avgDailySpend = daysInMonth > 0
    ? parseFloat((totalExpense / daysInMonth).toFixed(2))
    : 0;

  // Budget summary snapshot
  const budgets = await Budget.find({ user: userId, isActive: true });
  const budgetSummary = budgets.map((b) => ({
    category: b.category,
    limit: b.limit,
    spent: b.spent,
    usagePercent: b.limit > 0
      ? parseFloat(((b.spent / b.limit) * 100).toFixed(2))
      : 0,
  }));

  const report = await upsertReport(userId, month, year, {
    totalExpense: parseFloat(totalExpense.toFixed(2)),
    totalIncome:  parseFloat(totalIncome.toFixed(2)),
    netSavings:   parseFloat(netSavings.toFixed(2)),
    totalTransactions: expenses.length,
    categoryBreakdown,
    topCategory,
    avgDailySpend,
    budgetSummary,
  });

  return report;
};

export const getAllReports = async (userId) => {
  return await findAllReports(userId);
};

export const getReportById = async (userId, reportId) => {
  const report = await findReportById(reportId, userId);
  if (!report) throw createError(REPORT_MESSAGES.NOT_FOUND, STATUS_CODES.NOT_FOUND);
  return report;
};

export const exportAsPDF = async (userId, reportId) => {
  const report = await findReportById(reportId, userId);
  if (!report) throw createError(REPORT_MESSAGES.NOT_FOUND, STATUS_CODES.NOT_FOUND);

  const expenses = await findExpensesByMonthYear(userId, report.month, report.year);
  return await exportPDF(report, expenses);
};

export const exportAsExcel = async (userId, reportId) => {
  const report = await findReportById(reportId, userId);
  if (!report) throw createError(REPORT_MESSAGES.NOT_FOUND, STATUS_CODES.NOT_FOUND);

  const expenses = await findExpensesByMonthYear(userId, report.month, report.year);
  return await exportExcel(report, expenses);
};

export const deleteReport = async (userId, reportId) => {
  const report = await deleteReportById(reportId, userId);
  if (!report) throw createError(REPORT_MESSAGES.NOT_FOUND, STATUS_CODES.NOT_FOUND);
};
