// src/controllers/goal.controller.js
// Handles savings goal management and contributions

import * as goalService from "../services/auth.service.js";
import { STATUS_CODES } from "../constants/statusCodes.js";
import { GOAL_MESSAGES } from "../constants/messages.js";

// @desc    Create a savings goal
// @route   POST /api/goals
// @access  Private
export const createGoal = async (req, res) => {
  try {
    const data = await goalService.createGoal(req.user.id, req.body);

    return res.status(STATUS_CODES.CREATED).json({
      success: true,
      message: GOAL_MESSAGES.CREATED,
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all goals for user
// @route   GET /api/goals
// @access  Private
export const getAllGoals = async (req, res) => {
  try {
    const data = await goalService.getAllGoals(req.user.id);

    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: GOAL_MESSAGES.ALL_FETCHED,
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single goal by ID
// @route   GET /api/goals/:id
// @access  Private
export const getGoalById = async (req, res) => {
  try {
    const data = await goalService.getGoalById(req.user.id, req.params.id);

    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: GOAL_MESSAGES.FETCHED,
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update a goal
// @route   PUT /api/goals/:id
// @access  Private
export const updateGoal = async (req, res) => {
  try {
    const data = await goalService.updateGoal(req.user.id, req.params.id, req.body);

    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: GOAL_MESSAGES.UPDATED,
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Add contribution amount to a goal
// @route   POST /api/goals/:id/contribute
// @access  Private
export const contributeToGoal = async (req, res) => {
  try {
    const { amount } = req.body;
    const data = await goalService.contributeToGoal(req.user.id, req.params.id, amount);

    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: GOAL_MESSAGES.CONTRIBUTION_ADDED,
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete a goal
// @route   DELETE /api/goals/:id
// @access  Private
export const deleteGoal = async (req, res) => {
  try {
    await goalService.deleteGoal(req.user.id, req.params.id);

    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: GOAL_MESSAGES.DELETED,
      data: null,
    });
  } catch (error) {
    return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};
