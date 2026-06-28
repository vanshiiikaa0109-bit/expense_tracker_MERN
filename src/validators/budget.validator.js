// src/validators/budget.validator.js
// express-validator chains for budget create and update routes

import { body } from "express-validator";
import { EXPENSE_CATEGORIES, BUDGET_PERIODS } from "../constants/categories.js";

// ─── Create Budget ────────────────────────────────────────────────────────────
export const createBudgetValidator = [
  body("category")
    .trim()
    .notEmpty().withMessage("Category is required")
    .isIn(EXPENSE_CATEGORIES)
    .withMessage(`Category must be one of: ${EXPENSE_CATEGORIES.join(", ")}`),

  body("limit")
    .notEmpty().withMessage("Budget limit is required")
    .isFloat({ gt: 0 }).withMessage("Budget limit must be a positive number greater than 0"),

  body("period")
    .trim()
    .notEmpty().withMessage("Period is required")
    .isIn(BUDGET_PERIODS)
    .withMessage(`Period must be one of: ${BUDGET_PERIODS.join(", ")}`),

  body("alertThreshold")
    .optional()
    .isFloat({ min: 1, max: 100 })
    .withMessage("Alert threshold must be a number between 1 and 100"),

  body("startDate")
    .optional()
    .isISO8601().withMessage("Start date must be a valid ISO 8601 date")
    .toDate(),

  body("endDate")
    .optional()
    .isISO8601().withMessage("End date must be a valid ISO 8601 date")
    .toDate()
    .custom((value, { req }) => {
      if (req.body.startDate && value && new Date(value) <= new Date(req.body.startDate)) {
        throw new Error("End date must be after start date");
      }
      return true;
    }),
];

// ─── Update Budget ────────────────────────────────────────────────────────────
export const updateBudgetValidator = [
  body("category")
    .optional()
    .trim()
    .isIn(EXPENSE_CATEGORIES)
    .withMessage(`Category must be one of: ${EXPENSE_CATEGORIES.join(", ")}`),

  body("limit")
    .optional()
    .isFloat({ gt: 0 }).withMessage("Budget limit must be a positive number greater than 0"),

  body("period")
    .optional()
    .trim()
    .isIn(BUDGET_PERIODS)
    .withMessage(`Period must be one of: ${BUDGET_PERIODS.join(", ")}`),

  body("alertThreshold")
    .optional()
    .isFloat({ min: 1, max: 100 })
    .withMessage("Alert threshold must be a number between 1 and 100"),

  body("startDate")
    .optional()
    .isISO8601().withMessage("Start date must be a valid ISO 8601 date")
    .toDate(),

  body("endDate")
    .optional()
    .isISO8601().withMessage("End date must be a valid ISO 8601 date")
    .toDate()
    .custom((value, { req }) => {
      if (req.body.startDate && value && new Date(value) <= new Date(req.body.startDate)) {
        throw new Error("End date must be after start date");
      }
      return true;
    }),

  body("isActive")
    .optional()
    .isBoolean().withMessage("isActive must be a boolean"),
];
