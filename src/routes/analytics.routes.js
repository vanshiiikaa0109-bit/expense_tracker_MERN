// src/routes/analytics.routes.js
// Analytics, statistics, and spending insight routes

import express from "express";
import {
  getSummary,
  getMonthlyTrend,
  getCategoryBreakdown,
  getTopCategories,
  getInsights,
  getDailySpending,
} from "../controllers/analytics.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// All analytics routes are private
router.use(protect);

// @route   GET /api/analytics/summary
// @access  Private
router.get("/summary", getSummary);

// @route   GET /api/analytics/monthly-trend
// @access  Private
router.get("/monthly-trend", getMonthlyTrend);

// @route   GET /api/analytics/by-category
// @access  Private
router.get("/by-category", getCategoryBreakdown);

// @route   GET /api/analytics/top-categories
// @access  Private
router.get("/top-categories", getTopCategories);

// @route   GET /api/analytics/insights
// @access  Private
router.get("/insights", getInsights);

// @route   GET /api/analytics/daily
// @access  Private
router.get("/daily", getDailySpending);

export default router;
