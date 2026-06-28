// src/services/notification.service.js
// Business logic for managing in-app notifications

import Notification from "../models/Notification.js";
import { STATUS_CODES } from "../constants/statusCodes.js";
import { NOTIFICATION_MESSAGES } from "../constants/messages.js";

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

export const getAllNotifications = async (userId, query = {}) => {
  const { page = 1, limit = 20, isRead } = query;
  const skip = (page - 1) * limit;

  const filter = { user: userId };
  if (isRead !== undefined) filter.isRead = isRead === "true";

  const [notifications, total] = await Promise.all([
    Notification.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Notification.countDocuments(filter),
  ]);

  return {
    notifications,
    total,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(total / limit),
  };
};

export const getUnreadCount = async (userId) => {
  const count = await Notification.countDocuments({ user: userId, isRead: false });
  return { unreadCount: count };
};

export const markAsRead = async (userId, notificationId) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, user: userId },
    { $set: { isRead: true, readAt: new Date() } },
    { new: true }
  );
  if (!notification) {
    throw createError(NOTIFICATION_MESSAGES.NOT_FOUND, STATUS_CODES.NOT_FOUND);
  }
  return notification;
};

export const markAllAsRead = async (userId) => {
  await Notification.updateMany(
    { user: userId, isRead: false },
    { $set: { isRead: true, readAt: new Date() } }
  );
};

export const deleteNotification = async (userId, notificationId) => {
  const notification = await Notification.findOneAndDelete({
    _id: notificationId,
    user: userId,
  });
  if (!notification) {
    throw createError(NOTIFICATION_MESSAGES.NOT_FOUND, STATUS_CODES.NOT_FOUND);
  }
};

export const deleteAllNotifications = async (userId) => {
  await Notification.deleteMany({ user: userId });
};

// Utility used by other services to create a notification programmatically
export const createNotification = async ({ userId, title, message, type, refId, refModel }) => {
  return await Notification.create({
    user: userId,
    title,
    message,
    type: type || "system",
    refId:    refId    || null,
    refModel: refModel || null,
  });
};
