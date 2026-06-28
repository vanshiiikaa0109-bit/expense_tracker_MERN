// src/models/Report.js
// Monthly financial report schema with category breakdown and savings

import mongoose from "mongoose";

const categoryBreakdownSchema = new mongoose.Schema(
  {
    category: { type: String, required: true },
    total: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
    percentage: { type: Number, default: 0 },
  },
  { _id: false }
);

const reportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
      index: true,
    },

    month: {
      type: Number,
      required: [true, "Month is required"],
      min: [1, "Month must be between 1 and 12"],
      max: [12, "Month must be between 1 and 12"],
    },

    year: {
      type: Number,
      required: [true, "Year is required"],
      min: [2000, "Year must be 2000 or later"],
    },

    totalExpense: {
      type: Number,
      default: 0,
    },

    totalIncome: {
      type: Number,
      default: 0,
    },

    netSavings: {
      type: Number,
      default: 0,
    },

    totalTransactions: {
      type: Number,
      default: 0,
    },

    categoryBreakdown: {
      type: [categoryBreakdownSchema],
      default: [],
    },

    // Top spending category for the month
    topCategory: {
      type: String,
      default: "",
    },

    // Average daily spending
    avgDailySpend: {
      type: Number,
      default: 0,
    },

    // Budget summary snapshot at time of report generation
    budgetSummary: [
      {
        category: String,
        limit: Number,
        spent: Number,
        usagePercent: Number,
        _id: false,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// ─── COMPOUND INDEX: One report per user per month/year ──────────────────────
reportSchema.index({ user: 1, month: 1, year: 1 }, { unique: true });

const Report = mongoose.model("Report", reportSchema);
export default Report;
