// src/utils/exportExcel.js
// Generates an Excel (.xlsx) buffer for a monthly expense report using exceljs

import ExcelJS from "exceljs";
import { getMonthName, formatDateISO } from "./formatDate.js";

/**
 * Generate an Excel buffer for a monthly report
 * @param {object} report   - Report document from MongoDB
 * @param {Array}  expenses - Expense documents for the report month
 * @returns {Promise<Buffer>} Excel file buffer
 */
export const exportExcel = async (report, expenses) => {
  const workbook  = new ExcelJS.Workbook();
  const monthName = getMonthName(report.month);

  workbook.creator  = "Smart Expense Tracker";
  workbook.created  = new Date();
  workbook.modified = new Date();

  // ── Styles ──────────────────────────────────────────────────────────────────
  const headerFill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF2D3748" },
  };

  const headerFont  = { bold: true, color: { argb: "FFFFFFFF" }, size: 11 };
  const titleFont   = { bold: true, size: 14, color: { argb: "FF2D3748" } };
  const labelFont   = { bold: true, color: { argb: "FF4A5568" } };
  const incomeColor = { argb: "FF276749" };
  const expenseColor = { argb: "FFC53030" };
  const altRowFill  = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF7FAFC" } };

  const borderStyle = {
    top:    { style: "thin", color: { argb: "FFE2E8F0" } },
    left:   { style: "thin", color: { argb: "FFE2E8F0" } },
    bottom: { style: "thin", color: { argb: "FFE2E8F0" } },
    right:  { style: "thin", color: { argb: "FFE2E8F0" } },
  };

  // ══════════════════════════════════════════════════════════════════════════
  // SHEET 1 — Summary
  // ══════════════════════════════════════════════════════════════════════════
  const summarySheet = workbook.addWorksheet("Summary");
  summarySheet.columns = [
    { key: "label", width: 28 },
    { key: "value", width: 20 },
  ];

  // Title
  summarySheet.mergeCells("A1:B1");
  const titleCell = summarySheet.getCell("A1");
  titleCell.value = `Expense Report — ${monthName} ${report.year}`;
  titleCell.font  = titleFont;
  titleCell.alignment = { horizontal: "center" };

  summarySheet.mergeCells("A2:B2");
  summarySheet.getCell("A2").value = `Generated: ${formatDateISO(new Date())}`;
  summarySheet.getCell("A2").font  = { italic: true, color: { argb: "FF718096" } };
  summarySheet.getCell("A2").alignment = { horizontal: "center" };

  summarySheet.addRow([]);

  // Section header
  const secRow = summarySheet.addRow(["Financial Summary", ""]);
  secRow.getCell(1).font = { bold: true, size: 12, color: { argb: "FF2D3748" } };

  // Summary rows
  const summaryData = [
    ["Total Income",       `$${report.totalIncome.toFixed(2)}`],
    ["Total Expenses",     `$${report.totalExpense.toFixed(2)}`],
    ["Net Savings",        `$${report.netSavings.toFixed(2)}`],
    ["Total Transactions", report.totalTransactions],
    ["Avg Daily Spend",    `$${report.avgDailySpend.toFixed(2)}`],
    ["Top Category",       report.topCategory || "N/A"],
  ];

  summaryData.forEach(([label, value]) => {
    const row = summarySheet.addRow([label, value]);
    row.getCell(1).font   = labelFont;
    row.getCell(1).border = borderStyle;
    row.getCell(2).border = borderStyle;

    if (label === "Total Income")    row.getCell(2).font = { color: incomeColor, bold: true };
    if (label === "Total Expenses")  row.getCell(2).font = { color: expenseColor, bold: true };
    if (label === "Net Savings") {
      row.getCell(2).font = {
        color: report.netSavings >= 0 ? incomeColor : expenseColor,
        bold: true,
      };
    }
  });

  summarySheet.addRow([]);

  // ── Category Breakdown ────────────────────────────────────────────────────
  if (report.categoryBreakdown && report.categoryBreakdown.length > 0) {
    const catHeaderRow = summarySheet.addRow(["Spending by Category", "", "", ""]);
    catHeaderRow.getCell(1).font = { bold: true, size: 12, color: { argb: "FF2D3748" } };

    summarySheet.mergeCells(`A${catHeaderRow.number}:D${catHeaderRow.number}`);

    const catColRow = summarySheet.addRow(["Category", "Amount", "Count", "Percentage"]);
    catColRow.eachCell((cell) => {
      cell.fill   = headerFill;
      cell.font   = headerFont;
      cell.border = borderStyle;
      cell.alignment = { horizontal: "center" };
    });

    report.categoryBreakdown.forEach((cat, idx) => {
      const row = summarySheet.addRow([
        cat.category,
        `$${cat.total.toFixed(2)}`,
        cat.count,
        `${cat.percentage}%`,
      ]);

      if (idx % 2 === 0) {
        row.eachCell((cell) => { cell.fill = altRowFill; });
      }

      row.eachCell((cell) => { cell.border = borderStyle; });
    });
  }

  // ══════════════════════════════════════════════════════════════════════════
  // SHEET 2 — Transactions
  // ══════════════════════════════════════════════════════════════════════════
  const txSheet = workbook.addWorksheet("Transactions");
  txSheet.columns = [
    { header: "Date",     key: "date",     width: 14 },
    { header: "Title",    key: "title",    width: 28 },
    { header: "Category", key: "category", width: 20 },
    { header: "Type",     key: "type",     width: 12 },
    { header: "Amount",   key: "amount",   width: 14 },
    { header: "Note",     key: "note",     width: 30 },
  ];

  // Style the header row
  const txHeader = txSheet.getRow(1);
  txHeader.eachCell((cell) => {
    cell.fill      = headerFill;
    cell.font      = headerFont;
    cell.border    = borderStyle;
    cell.alignment = { horizontal: "center" };
  });

  // Add transaction rows
  expenses.forEach((exp, idx) => {
    const row = txSheet.addRow({
      date:     formatDateISO(exp.date),
      title:    exp.title,
      category: exp.category,
      type:     exp.type,
      amount:   exp.amount,
      note:     exp.note || "",
    });

    if (idx % 2 === 0) {
      row.eachCell((cell) => { cell.fill = altRowFill; });
    }

    row.eachCell((cell) => { cell.border = borderStyle; });

    // Color the amount cell based on type
    const amtCell = row.getCell("amount");
    amtCell.font  = { color: exp.type === "income" ? incomeColor : expenseColor };
    amtCell.numFmt = '"$"#,##0.00';
  });

  // Totals row
  txSheet.addRow([]);
  const totalsRow = txSheet.addRow({
    date:   "TOTAL",
    title:  "",
    category: "",
    type:   "",
    amount: expenses.reduce((sum, e) => e.type === "expense" ? sum - e.amount : sum + e.amount, 0),
    note:   "",
  });
  totalsRow.getCell("date").font   = { bold: true };
  totalsRow.getCell("amount").font = {
    bold: true,
    color: totalsRow.getCell("amount").value >= 0 ? incomeColor : expenseColor,
  };
  totalsRow.getCell("amount").numFmt = '"$"#,##0.00';

  // ══════════════════════════════════════════════════════════════════════════
  // SHEET 3 — Budget Summary
  // ══════════════════════════════════════════════════════════════════════════
  if (report.budgetSummary && report.budgetSummary.length > 0) {
    const budgetSheet = workbook.addWorksheet("Budget Summary");
    budgetSheet.columns = [
      { header: "Category",     key: "category",     width: 22 },
      { header: "Limit ($)",    key: "limit",        width: 14 },
      { header: "Spent ($)",    key: "spent",        width: 14 },
      { header: "Remaining ($)",key: "remaining",    width: 16 },
      { header: "Usage (%)",    key: "usagePercent", width: 14 },
      { header: "Status",       key: "status",       width: 16 },
    ];

    const budgetHeader = budgetSheet.getRow(1);
    budgetHeader.eachCell((cell) => {
      cell.fill      = headerFill;
      cell.font      = headerFont;
      cell.border    = borderStyle;
      cell.alignment = { horizontal: "center" };
    });

    report.budgetSummary.forEach((b, idx) => {
      const remaining = b.limit - b.spent;
      const status    = b.usagePercent >= 100 ? "Exceeded" : b.usagePercent >= 80 ? "Warning" : "On Track";

      const row = budgetSheet.addRow({
        category:     b.category,
        limit:        b.limit,
        spent:        b.spent,
        remaining:    Math.max(remaining, 0),
        usagePercent: `${b.usagePercent}%`,
        status,
      });

      if (idx % 2 === 0) row.eachCell((cell) => { cell.fill = altRowFill; });
      row.eachCell((cell) => { cell.border = borderStyle; });

      const statusCell = row.getCell("status");
      if (status === "Exceeded") statusCell.font = { color: expenseColor, bold: true };
      if (status === "Warning")  statusCell.font = { color: { argb: "FFDD6B20" }, bold: true };
      if (status === "On Track") statusCell.font = { color: incomeColor, bold: true };

      ["limit", "spent", "remaining"].forEach((key) => {
        row.getCell(key).numFmt = '"$"#,##0.00';
      });
    });
  }

  // Write workbook to buffer
  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
};
