// src/models/Expense.js
// Expense / income transaction schema with recurring support

import mongoose from "mongoose";
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  TRANSACTION_TYPES,
  RECURRING_FREQUENCIES,
} from "../constants/categories.js";

const ALL_CATEGORIES = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];

const expenseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
      index: true,
    },

    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },

    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0.01, "Amount must be greater than 0"],
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: ALL_CATEGORIES,
        message: "{VALUE} is not a valid category",
      },
    },

    type: {
      type: String,
      required: [true, "Type is required"],
      enum: {
        values: TRANSACTION_TYPES,
        message: "{VALUE} is not a valid type. Use 'expense' or 'income'",
      },
    },

    date: {
      type: Date,
      required: [true, "Date is required"],
      default: Date.now,
    },

    note: {
      type: String,
      trim: true,
      maxlength: [300, "Note cannot exceed 300 characters"],
      default: "",
    },

    wallet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wallet",
      default: null,
    },

    receipt: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Receipt",
      default: null,
    },

    // Recurring expense fields
    isRecurring: {
      type: Boolean,
      default: false,
    },

    recurringFrequency: {
      type: String,
      enum: {
        values: RECURRING_FREQUENCIES,
        message: "{VALUE} is not a valid frequency",
      },
      default: null,
    },

    nextDueDate: {
      type: Date,
      default: null,
    },

    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// ─── INDEXES for faster queries ───────────────────────────────────────────────
expenseSchema.index({ user: 1, date: -1 });
expenseSchema.index({ user: 1, category: 1 });
expenseSchema.index({ user: 1, type: 1 });
expenseSchema.index({ isRecurring: 1, nextDueDate: 1 });

const Expense = mongoose.model("Expense", expenseSchema);
export default Expense;
