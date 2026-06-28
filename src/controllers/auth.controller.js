// src/controllers/auth.controller.js
// Handles all authentication-related requests

import * as authService from "../services/auth.service.js";
import { STATUS_CODES } from "../constants/statusCodes.js";
import { AUTH_MESSAGES } from "../constants/messages.js";

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const data = await authService.registerUser({ name, email, password });

    return res.status(STATUS_CODES.CREATED).json({
      success: true,
      message: AUTH_MESSAGES.REGISTER_SUCCESS,
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const data = await authService.loginUser({ email, password });

    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: AUTH_MESSAGES.LOGIN_SUCCESS,
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get currently logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const data = await authService.getAuthUser(req.user.id);

    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: AUTH_MESSAGES.LOGIN_SUCCESS,
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    await authService.changePassword(req.user.id, currentPassword, newPassword);

    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: AUTH_MESSAGES.PASSWORD_CHANGED,
      data: null,
    });
  } catch (error) {
    return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Send password reset email
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    await authService.forgotPassword(email);

    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: AUTH_MESSAGES.RESET_EMAIL_SENT,
      data: null,
    });
  } catch (error) {
    return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Reset password using token
// @route   PUT /api/auth/reset-password/:token
// @access  Public
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;
    await authService.resetPassword(token, newPassword);

    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: AUTH_MESSAGES.RESET_SUCCESS,
      data: null,
    });
  } catch (error) {
    return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};
