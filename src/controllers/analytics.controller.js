// src/controllers/analytics.controller.js
// Handles spending analytics, statistics, and insights

import * as analyticsService from "../services/analytics.service.js";
import { STATUS_CODES } from "../constants/statusCodes.js";
import { ANALYTICS_MESSAGES } from "../constants/messages.js";

// @desc    Get overall expense summary (total, avg, count)
// @route   GET /api/analytics/summary
// @access  Private
export const getSummary = async (req, res) => {
  try {
    const data = await analyticsService.getExpenseSummary(req.user.id, req.query);

    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: ANALYTICS_MESSAGES.SUMMARY_FETCHED,
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get monthly spending trend
// @route   GET /api/analytics/monthly-trend
// @access  Private
export const getMonthlyTrend = async (req, res) => {
  try {
    const data = await analyticsService.getMonthlyTrend(req.user.id, req.query);

    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: ANALYTICS_MESSAGES.FETCHED,
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get spending breakdown by category
// @route   GET /api/analytics/by-category
// @access  Private
export const getCategoryBreakdown = async (req, res) => {
  try {
    const data = await analyticsService.getCategoryBreakdown(req.user.id, req.query);

    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: ANALYTICS_MESSAGES.FETCHED,
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get top spending categories
// @route   GET /api/analytics/top-categories
// @access  Private
export const getTopCategories = async (req, res) => {
  try {
    const data = await analyticsService.getTopCategories(req.user.id, req.query);

    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: ANALYTICS_MESSAGES.FETCHED,
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get spending insights and AI-like tips
// @route   GET /api/analytics/insights
// @access  Private
export const getInsights = async (req, res) => {
  try {
    const data = await analyticsService.getSpendingInsights(req.user.id);

    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: ANALYTICS_MESSAGES.INSIGHTS_FETCHED,
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get daily spending for a given month
// @route   GET /api/analytics/daily
// @access  Private
export const getDailySpending = async (req, res) => {
  try {
    const data = await analyticsService.getDailySpending(req.user.id, req.query);

    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: ANALYTICS_MESSAGES.FETCHED,
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};
