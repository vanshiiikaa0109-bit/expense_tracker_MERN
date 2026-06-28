// src/routes/notification.routes.js
// Notification read, delete, and count routes

import express from "express";
import {
  getAllNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
} from "../controllers/notification.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// All notification routes are private
router.use(protect);

// @route   GET    /api/notifications
// @route   DELETE /api/notifications
// @access  Private
router
  .route("/")
  .get(getAllNotifications)
  .delete(deleteAllNotifications);

// @route   GET /api/notifications/unread-count
// @access  Private
// NOTE: Must be defined before /:id to avoid param conflict
router.get("/unread-count", getUnreadCount);

// @route   PUT /api/notifications/read-all
// @access  Private
// NOTE: Must be defined before /:id to avoid param conflict
router.put("/read-all", markAllAsRead);

// @route   PUT /api/notifications/:id/read
// @access  Private
router.put("/:id/read", markAsRead);

// @route   DELETE /api/notifications/:id
// @access  Private
router.delete("/:id", deleteNotification);

export default router;
