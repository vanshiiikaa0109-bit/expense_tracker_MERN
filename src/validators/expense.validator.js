// src/validators/expense.validator.js
// express-validator chains for expense create and update routes

import { body } from "express-validator";
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  TRANSACTION_TYPES,
  RECURRING_FREQUENCIES,
} from "../constants/categories.js";

const ALL_CATEGORIES = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];

// ─── Create Expense ───────────────────────────────────────────────────────────
export const createExpenseValidator = [
  body("title")
    .trim()
    .notEmpty().withMessage("Title is required")
    .isLength({ max: 100 }).withMessage("Title cannot exceed 100 characters"),

  body("amount")
    .notEmpty().withMessage("Amount is required")
    .isFloat({ gt: 0 }).withMessage("Amount must be a positive number greater than 0"),

  body("category")
    .trim()
    .notEmpty().withMessage("Category is required")
    .isIn(ALL_CATEGORIES)
    .withMessage(`Category must be one of: ${ALL_CATEGORIES.join(", ")}`),

  body("type")
    .trim()
    .notEmpty().withMessage("Type is required")
    .isIn(TRANSACTION_TYPES)
    .withMessage("Type must be either 'expense' or 'income'"),

  body("date")
    .notEmpty().withMessage("Date is required")
    .isISO8601().withMessage("Date must be a valid ISO 8601 date")
    .toDate(),

  body("note")
    .optional()
    .trim()
    .isLength({ max: 300 }).withMessage("Note cannot exceed 300 characters"),

  body("wallet")
    .optional()
    .isMongoId().withMessage("Wallet must be a valid ID"),

  body("isRecurring")
    .optional()
    .isBoolean().withMessage("isRecurring must be a boolean"),

  body("recurringFrequency")
    .optional()
    .isIn(RECURRING_FREQUENCIES)
    .withMessage(`Frequency must be one of: ${RECURRING_FREQUENCIES.join(", ")}`)
    .custom((value, { req }) => {
      if (req.body.isRecurring === true && !value) {
        throw new Error("Recurring frequency is required when isRecurring is true");
      }
      return true;
    }),

  body("tags")
    .optional()
    .isArray().withMessage("Tags must be an array"),

  body("tags.*")
    .optional()
    .trim()
    .isString().withMessage("Each tag must be a string")
    .isLength({ max: 30 }).withMessage("Each tag cannot exceed 30 characters"),
];

// ─── Update Expense ───────────────────────────────────────────────────────────
export const updateExpenseValidator = [
  body("title")
    .optional()
    .trim()
    .notEmpty().withMessage("Title cannot be empty")
    .isLength({ max: 100 }).withMessage("Title cannot exceed 100 characters"),

  body("amount")
    .optional()
    .isFloat({ gt: 0 }).withMessage("Amount must be a positive number greater than 0"),

  body("category")
    .optional()
    .trim()
    .isIn(ALL_CATEGORIES)
    .withMessage(`Category must be one of: ${ALL_CATEGORIES.join(", ")}`),

  body("type")
    .optional()
    .trim()
    .isIn(TRANSACTION_TYPES)
    .withMessage("Type must be either 'expense' or 'income'"),

  body("date")
    .optional()
    .isISO8601().withMessage("Date must be a valid ISO 8601 date")
    .toDate(),

  body("note")
    .optional()
    .trim()
    .isLength({ max: 300 }).withMessage("Note cannot exceed 300 characters"),

  body("wallet")
    .optional()
    .isMongoId().withMessage("Wallet must be a valid ID"),

  body("isRecurring")
    .optional()
    .isBoolean().withMessage("isRecurring must be a boolean"),

  body("recurringFrequency")
    .optional()
    .isIn(RECURRING_FREQUENCIES)
    .withMessage(`Frequency must be one of: ${RECURRING_FREQUENCIES.join(", ")}`),

  body("tags")
    .optional()
    .isArray().withMessage("Tags must be an array"),
];
