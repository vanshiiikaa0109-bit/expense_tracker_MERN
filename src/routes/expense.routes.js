// src/routes/expense.routes.js
// Expense CRUD and category grouping routes

import express from "express";
import {
  createExpense,
  getAllExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getExpensesByCategory,
} from "../controllers/expense.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validation.middleware.js";
import {
  createExpenseValidator,
  updateExpenseValidator,
} from "../validators/expense.validator.js";

const router = express.Router();

// All expense routes are private
router.use(protect);

// @route   GET /api/expenses/by-category
// @access  Private
// NOTE: This must be defined BEFORE /:id to avoid being caught as an ID param
router.get("/by-category", getExpensesByCategory);

// @route   GET  /api/expenses
// @route   POST /api/expenses
// @access  Private
router
  .route("/")
  .get(getAllExpenses)
  .post(createExpenseValidator, validate, createExpense);

// @route   GET    /api/expenses/:id
// @route   PUT    /api/expenses/:id
// @route   DELETE /api/expenses/:id
// @access  Private
router
  .route("/:id")
  .get(getExpenseById)
  .put(updateExpenseValidator, validate, updateExpense)
  .delete(deleteExpense);

export default router;
