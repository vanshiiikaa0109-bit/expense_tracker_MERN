// src/controllers/budget.controller.js
// Handles budget creation, updates, and alert checks

import * as budgetService from "../services/budget.service.js";
import { STATUS_CODES } from "../constants/statusCodes.js";
import { BUDGET_MESSAGES } from "../constants/messages.js";

// @desc    Create a budget
// @route   POST /api/budgets
// @access  Private
export const createBudget = async (req, res) => {
  try {
    const data = await budgetService.createBudget(req.user.id, req.body);

    return res.status(STATUS_CODES.CREATED).json({
      success: true,
      message: BUDGET_MESSAGES.CREATED,
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all budgets for user
// @route   GET /api/budgets
// @access  Private
export const getAllBudgets = async (req, res) => {
  try {
    const data = await budgetService.getAllBudgets(req.user.id);

    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: BUDGET_MESSAGES.ALL_FETCHED,
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single budget by ID
// @route   GET /api/budgets/:id
// @access  Private
export const getBudgetById = async (req, res) => {
  try {
    const data = await budgetService.getBudgetById(req.user.id, req.params.id);

    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: BUDGET_MESSAGES.FETCHED,
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update a budget
// @route   PUT /api/budgets/:id
// @access  Private
export const updateBudget = async (req, res) => {
  try {
    const data = await budgetService.updateBudget(req.user.id, req.params.id, req.body);

    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: BUDGET_MESSAGES.UPDATED,
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete a budget
// @route   DELETE /api/budgets/:id
// @access  Private
export const deleteBudget = async (req, res) => {
  try {
    await budgetService.deleteBudget(req.user.id, req.params.id);

    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: BUDGET_MESSAGES.DELETED,
      data: null,
    });
  } catch (error) {
    return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get budget usage/status (spent vs limit)
// @route   GET /api/budgets/:id/status
// @access  Private
export const getBudgetStatus = async (req, res) => {
  try {
    const data = await budgetService.getBudgetStatus(req.user.id, req.params.id);

    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: BUDGET_MESSAGES.FETCHED,
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};
