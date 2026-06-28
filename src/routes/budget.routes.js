// src/routes/budget.routes.js
// Budget management and status check routes

import express from "express";
import {
  createBudget,
  getAllBudgets,
  getBudgetById,
  updateBudget,
  deleteBudget,
  getBudgetStatus,
} from "../controllers/budget.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validation.middleware.js";
import {
  createBudgetValidator,
  updateBudgetValidator,
} from "../validators/budget.validator.js";

const router = express.Router();

// All budget routes are private
router.use(protect);

// @route   GET  /api/budgets
// @route   POST /api/budgets
// @access  Private
router
  .route("/")
  .get(getAllBudgets)
  .post(createBudgetValidator, validate, createBudget);

// @route   GET /api/budgets/:id/status
// @access  Private
// NOTE: Must be before /:id to avoid ID conflict
router.get("/:id/status", getBudgetStatus);

// @route   GET    /api/budgets/:id
// @route   PUT    /api/budgets/:id
// @route   DELETE /api/budgets/:id
// @access  Private
router
  .route("/:id")
  .get(getBudgetById)
  .put(updateBudgetValidator, validate, updateBudget)
  .delete(deleteBudget);

export default router;
