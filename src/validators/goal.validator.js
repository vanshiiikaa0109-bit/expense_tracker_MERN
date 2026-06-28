// src/validators/goal.validator.js
// express-validator chains for goal create and update routes

import { body } from "express-validator";
import { GOAL_CATEGORIES } from "../constants/categories.js";

// ─── Create Goal ──────────────────────────────────────────────────────────────
export const createGoalValidator = [
  body("title")
    .trim()
    .notEmpty().withMessage("Goal title is required")
    .isLength({ max: 100 }).withMessage("Title cannot exceed 100 characters"),

  body("targetAmount")
    .notEmpty().withMessage("Target amount is required")
    .isFloat({ gt: 0 }).withMessage("Target amount must be a positive number greater than 0"),

  body("deadline")
    .notEmpty().withMessage("Deadline is required")
    .isISO8601().withMessage("Deadline must be a valid ISO 8601 date")
    .toDate()
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error("Deadline must be a future date");
      }
      return true;
    }),

  body("category")
    .optional()
    .trim()
    .isIn(GOAL_CATEGORIES)
    .withMessage(`Category must be one of: ${GOAL_CATEGORIES.join(", ")}`),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 300 }).withMessage("Description cannot exceed 300 characters"),

  body("color")
    .optional()
    .trim()
    .matches(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/)
    .withMessage("Color must be a valid hex color code (e.g. #4CAF50)"),

  body("icon")
    .optional()
    .trim()
    .isLength({ max: 10 }).withMessage("Icon cannot exceed 10 characters"),
];

// ─── Update Goal ──────────────────────────────────────────────────────────────
export const updateGoalValidator = [
  body("title")
    .optional()
    .trim()
    .notEmpty().withMessage("Title cannot be empty")
    .isLength({ max: 100 }).withMessage("Title cannot exceed 100 characters"),

  body("targetAmount")
    .optional()
    .isFloat({ gt: 0 }).withMessage("Target amount must be a positive number greater than 0"),

  body("deadline")
    .optional()
    .isISO8601().withMessage("Deadline must be a valid ISO 8601 date")
    .toDate()
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error("Deadline must be a future date");
      }
      return true;
    }),

  body("category")
    .optional()
    .trim()
    .isIn(GOAL_CATEGORIES)
    .withMessage(`Category must be one of: ${GOAL_CATEGORIES.join(", ")}`),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 300 }).withMessage("Description cannot exceed 300 characters"),

  body("color")
    .optional()
    .trim()
    .matches(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/)
    .withMessage("Color must be a valid hex color code (e.g. #4CAF50)"),

  body("icon")
    .optional()
    .trim()
    .isLength({ max: 10 }).withMessage("Icon cannot exceed 10 characters"),
];

// ─── Contribute to Goal ───────────────────────────────────────────────────────
export const contributeValidator = [
  body("amount")
    .notEmpty().withMessage("Contribution amount is required")
    .isFloat({ gt: 0 }).withMessage("Contribution amount must be a positive number greater than 0"),

  body("note")
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage("Note cannot exceed 200 characters"),
];
