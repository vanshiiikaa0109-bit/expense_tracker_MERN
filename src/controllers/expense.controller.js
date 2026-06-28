// src/controllers/expense.controller.js
// Handles all expense CRUD operations

import * as expenseService from "../services/expense.service.js";
import { STATUS_CODES } from "../constants/statusCodes.js";
import { EXPENSE_MESSAGES } from "../constants/messages.js";

// @desc    Create a new expense
// @route   POST /api/expenses
// @access  Private
export const createExpense = async (req, res) => {
  try {
    const data = await expenseService.createExpense(req.user.id, req.body);

    return res.status(STATUS_CODES.CREATED).json({
      success: true,
      message: EXPENSE_MESSAGES.CREATED,
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all expenses for logged-in user (with filters & pagination)
// @route   GET /api/expenses
// @access  Private
export const getAllExpenses = async (req, res) => {
  try {
    const data = await expenseService.getAllExpenses(req.user.id, req.query);

    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: EXPENSE_MESSAGES.ALL_FETCHED,
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single expense by ID
// @route   GET /api/expenses/:id
// @access  Private
export const getExpenseById = async (req, res) => {
  try {
    const data = await expenseService.getExpenseById(req.user.id, req.params.id);

    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: EXPENSE_MESSAGES.FETCHED,
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update an expense
// @route   PUT /api/expenses/:id
// @access  Private
export const updateExpense = async (req, res) => {
  try {
    const data = await expenseService.updateExpense(req.user.id, req.params.id, req.body);

    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: EXPENSE_MESSAGES.UPDATED,
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete an expense
// @route   DELETE /api/expenses/:id
// @access  Private
export const deleteExpense = async (req, res) => {
  try {
    await expenseService.deleteExpense(req.user.id, req.params.id);

    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: EXPENSE_MESSAGES.DELETED,
      data: null,
    });
  } catch (error) {
    return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get expenses grouped by category
// @route   GET /api/expenses/by-category
// @access  Private
export const getExpensesByCategory = async (req, res) => {
  try {
    const data = await expenseService.getExpensesByCategory(req.user.id, req.query);

    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: EXPENSE_MESSAGES.ALL_FETCHED,
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};
