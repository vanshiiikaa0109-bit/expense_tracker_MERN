// src/utils/exportPDF.js
// Generates a PDF buffer for a monthly expense report using pdfkit

import PDFDocument from "pdfkit";
import { getMonthName, formatDateShort } from "./formatDate.js";

/**
 * Generate a PDF buffer for a monthly report
 * @param {object} report  - Report document from MongoDB
 * @param {Array}  expenses - Expense documents for the report month
 * @returns {Promise<Buffer>} PDF file buffer
 */
export const exportPDF = (report, expenses) => {
  return new Promise((resolve, reject) => {
    try {
      const doc    = new PDFDocument({ margin: 50, size: "A4" });
      const chunks = [];

      doc.on("data",  (chunk) => chunks.push(chunk));
      doc.on("end",   ()      => resolve(Buffer.concat(chunks)));
      doc.on("error", (err)   => reject(err));

      const monthName = getMonthName(report.month);
      const title     = `Expense Report — ${monthName} ${report.year}`;

      // ── Header ──────────────────────────────────────────────────────────────
      doc
        .fontSize(22)
        .fillColor("#2D3748")
        .text("Smart Expense Tracker", { align: "center" })
        .moveDown(0.3)
        .fontSize(14)
        .fillColor("#4A5568")
        .text(title, { align: "center" })
        .moveDown(0.3)
        .fontSize(10)
        .fillColor("#718096")
        .text(`Generated on: ${formatDateShort(new Date())}`, { align: "center" })
        .moveDown(1.5);

      // ── Summary Box ─────────────────────────────────────────────────────────
      doc
        .fontSize(13)
        .fillColor("#2D3748")
        .text("Financial Summary", { underline: true })
        .moveDown(0.5);

      const summaryItems = [
        ["Total Income",       `$${report.totalIncome.toFixed(2)}`],
        ["Total Expenses",     `$${report.totalExpense.toFixed(2)}`],
        ["Net Savings",        `$${report.netSavings.toFixed(2)}`],
        ["Total Transactions", `${report.totalTransactions}`],
        ["Avg Daily Spend",    `$${report.avgDailySpend.toFixed(2)}`],
        ["Top Category",       report.topCategory || "N/A"],
      ];

      summaryItems.forEach(([label, value]) => {
        doc
          .fontSize(11)
          .fillColor("#4A5568")
          .text(label, { continued: true, width: 200 })
          .fillColor("#2D3748")
          .text(value, { align: "left" });
      });

      doc.moveDown(1.5);

      // ── Category Breakdown ──────────────────────────────────────────────────
      if (report.categoryBreakdown && report.categoryBreakdown.length > 0) {
        doc
          .fontSize(13)
          .fillColor("#2D3748")
          .text("Spending by Category", { underline: true })
          .moveDown(0.5);

        // Table header
        doc
          .fontSize(10)
          .fillColor("#718096")
          .text("Category",   50,  doc.y, { width: 200, continued: true })
          .text("Amount",    250,  doc.y, { width: 100, continued: true })
          .text("Count",     350,  doc.y, { width: 80,  continued: true })
          .text("%",         430,  doc.y, { width: 60 })
          .moveDown(0.3);

        doc
          .moveTo(50, doc.y)
          .lineTo(550, doc.y)
          .strokeColor("#E2E8F0")
          .stroke()
          .moveDown(0.3);

        report.categoryBreakdown.forEach((cat, idx) => {
          const rowColor = idx % 2 === 0 ? "#F7FAFC" : "#FFFFFF";
          doc
            .rect(50, doc.y - 2, 500, 18)
            .fill(rowColor);

          doc
            .fontSize(10)
            .fillColor("#2D3748")
            .text(cat.category,              50,  doc.y, { width: 200, continued: true })
            .text(`$${cat.total.toFixed(2)}`, 250, doc.y, { width: 100, continued: true })
            .text(`${cat.count}`,             350, doc.y, { width: 80,  continued: true })
            .text(`${cat.percentage}%`,       430, doc.y, { width: 60 })
            .moveDown(0.3);
        });

        doc.moveDown(1.5);
      }

      // ── Transactions List ───────────────────────────────────────────────────
      if (expenses && expenses.length > 0) {
        doc
          .fontSize(13)
          .fillColor("#2D3748")
          .text("Transaction Details", { underline: true })
          .moveDown(0.5);

        // Table header
        doc
          .fontSize(9)
          .fillColor("#718096")
          .text("Date",     50,  doc.y, { width: 90,  continued: true })
          .text("Title",    140, doc.y, { width: 150, continued: true })
          .text("Category", 290, doc.y, { width: 110, continued: true })
          .text("Type",     400, doc.y, { width: 60,  continued: true })
          .text("Amount",   460, doc.y, { width: 80 })
          .moveDown(0.3);

        doc
          .moveTo(50, doc.y)
          .lineTo(550, doc.y)
          .strokeColor("#E2E8F0")
          .stroke()
          .moveDown(0.3);

        expenses.forEach((exp, idx) => {
          // Add new page if near bottom
          if (doc.y > 730) {
            doc.addPage();
          }

          const rowColor   = idx % 2 === 0 ? "#F7FAFC" : "#FFFFFF";
          const amtColor   = exp.type === "income" ? "#276749" : "#C53030";

          doc
            .rect(50, doc.y - 2, 500, 18)
            .fill(rowColor);

          doc
            .fontSize(9)
            .fillColor("#4A5568")
            .text(formatDateShort(exp.date), 50,  doc.y, { width: 90,  continued: true })
            .text(exp.title,                 140, doc.y, { width: 150, continued: true })
            .text(exp.category,              290, doc.y, { width: 110, continued: true })
            .text(exp.type,                  400, doc.y, { width: 60,  continued: true })
            .fillColor(amtColor)
            .text(
              `${exp.type === "income" ? "+" : "-"}$${exp.amount.toFixed(2)}`,
              460, doc.y, { width: 80 }
            )
            .moveDown(0.3);
        });
      }

      // ── Footer ──────────────────────────────────────────────────────────────
      doc
        .moveDown(2)
        .fontSize(9)
        .fillColor("#A0AEC0")
        .text(
          "This report was automatically generated by Smart Expense Tracker.",
          { align: "center" }
        );

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};
