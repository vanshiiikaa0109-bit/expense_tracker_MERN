// src/controllers/notification.controller.js
// Handles in-app notifications for budgets, goals, and system alerts

import * as notificationService from "../services/notification.service.js";
import { STATUS_CODES } from "../constants/statusCodes.js";
import { NOTIFICATION_MESSAGES } from "../constants/messages.js";

// @desc    Get all notifications for user
// @route   GET /api/notifications
// @access  Private
export const getAllNotifications = async (req, res) => {
  try {
    const data = await notificationService.getAllNotifications(req.user.id, req.query);

    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: NOTIFICATION_MESSAGES.FETCHED,
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get unread notification count
// @route   GET /api/notifications/unread-count
// @access  Private
export const getUnreadCount = async (req, res) => {
  try {
    const data = await notificationService.getUnreadCount(req.user.id);

    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: NOTIFICATION_MESSAGES.FETCHED,
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Mark a single notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
export const markAsRead = async (req, res) => {
  try {
    const data = await notificationService.markAsRead(req.user.id, req.params.id);

    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: NOTIFICATION_MESSAGES.MARKED_READ,
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
export const markAllAsRead = async (req, res) => {
  try {
    await notificationService.markAllAsRead(req.user.id);

    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: NOTIFICATION_MESSAGES.ALL_MARKED_READ,
      data: null,
    });
  } catch (error) {
    return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete a notification
// @route   DELETE /api/notifications/:id
// @access  Private
export const deleteNotification = async (req, res) => {
  try {
    await notificationService.deleteNotification(req.user.id, req.params.id);

    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: NOTIFICATION_MESSAGES.DELETED,
      data: null,
    });
  } catch (error) {
    return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete all notifications for user
// @route   DELETE /api/notifications
// @access  Private
export const deleteAllNotifications = async (req, res) => {
  try {
    await notificationService.deleteAllNotifications(req.user.id);

    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: "All notifications deleted",
      data: null,
    });
  } catch (error) {
    return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};
