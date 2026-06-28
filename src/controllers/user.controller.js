// src/controllers/user.controller.js
// Handles user profile management

import * as userService from "../services/auth.service.js";
import { STATUS_CODES } from "../constants/statusCodes.js";
import { USER_MESSAGES } from "../constants/messages.js";

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getProfile = async (req, res) => {
  try {
    const data = await userService.getUserProfile(req.user.id);

    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: USER_MESSAGES.PROFILE_FETCHED,
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const { name, currency, timezone } = req.body;
    const data = await userService.updateUserProfile(req.user.id, { name, currency, timezone });

    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: USER_MESSAGES.PROFILE_UPDATED,
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Upload / update profile avatar
// @route   PUT /api/users/avatar
// @access  Private
export const updateAvatar = async (req, res) => {
  try {
    const data = await userService.updateAvatar(req.user.id, req.file);

    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: USER_MESSAGES.AVATAR_UPDATED,
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete user account
// @route   DELETE /api/users/account
// @access  Private
export const deleteAccount = async (req, res) => {
  try {
    await userService.deleteUserAccount(req.user.id);

    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: USER_MESSAGES.ACCOUNT_DELETED,
      data: null,
    });
  } catch (error) {
    return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};
