// src/models/Budget.js
// Budget schema with per-category spending limits and alert thresholds

import mongoose from "mongoose";
import {
  EXPENSE_CATEGORIES,
  BUDGET_PERIODS,
} from "../constants/categories.js";

const budgetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
      index: true,
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: EXPENSE_CATEGORIES,
        message: "{VALUE} is not a valid expense category",
      },
    },

    limit: {
      type: Number,
      required: [true, "Budget limit is required"],
      min: [1, "Budget limit must be greater than 0"],
    },

    spent: {
      type: Number,
      default: 0,
      min: 0,
    },

    period: {
      type: String,
      required: [true, "Budget period is required"],
      enum: {
        values: BUDGET_PERIODS,
        message: "{VALUE} is not a valid period. Use weekly, monthly, or yearly",
      },
    },

    // Alert when spending reaches this % of the limit
    alertThreshold: {
      type: Number,
      default: 80,
      min: [1, "Alert threshold must be at least 1%"],
      max: [100, "Alert threshold cannot exceed 100%"],
    },

    startDate: {
      type: Date,
      default: () => {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), 1);
      },
    },

    endDate: {
      type: Date,
      default: () => {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth() + 1, 0);
      },
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── VIRTUAL: Remaining budget ────────────────────────────────────────────────
budgetSchema.virtual("remaining").get(function () {
  return Math.max(this.limit - this.spent, 0);
});

// ─── VIRTUAL: Usage percentage ────────────────────────────────────────────────
budgetSchema.virtual("usagePercent").get(function () {
  if (this.limit === 0) return 0;
  return parseFloat(((this.spent / this.limit) * 100).toFixed(2));
});

// ─── INDEXES ──────────────────────────────────────────────────────────────────
budgetSchema.index({ user: 1, category: 1, period: 1 });

const Budget = mongoose.model("Budget", budgetSchema);
export default Budget;
