// src/routes/goal.routes.js
// Savings goal management and contribution routes

import express from "express";
import {
  createGoal,
  getAllGoals,
  getGoalById,
  updateGoal,
  contributeToGoal,
  deleteGoal,
} from "../controllers/goal.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validation.middleware.js";
import {
  createGoalValidator,
  updateGoalValidator,
} from "../validators/goal.validator.js";

const router = express.Router();

// All goal routes are private
router.use(protect);

// @route   GET  /api/goals
// @route   POST /api/goals
// @access  Private
router
  .route("/")
  .get(getAllGoals)
  .post(createGoalValidator, validate, createGoal);

// @route   POST /api/goals/:id/contribute
// @access  Private
// NOTE: Must be defined before /:id to avoid param conflict
router.post("/:id/contribute", contributeToGoal);

// @route   GET    /api/goals/:id
// @route   PUT    /api/goals/:id
// @route   DELETE /api/goals/:id
// @access  Private
router
  .route("/:id")
  .get(getGoalById)
  .put(updateGoalValidator, validate, updateGoal)
  .delete(deleteGoal);

export default router;
