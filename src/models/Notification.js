// src/models/Notification.js
// In-app notification schema for budget alerts, goal updates, and system messages

import mongoose from "mongoose";

const NOTIFICATION_TYPES = ["budget", "goal", "system", "reminder", "report"];

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
      index: true,
    },

    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },

    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      maxlength: [500, "Message cannot exceed 500 characters"],
    },

    type: {
      type: String,
      required: [true, "Notification type is required"],
      enum: {
        values: NOTIFICATION_TYPES,
        message: "{VALUE} is not a valid notification type",
      },
      default: "system",
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    readAt: {
      type: Date,
      default: null,
    },

    // Optional deep link reference (e.g., budget ID, goal ID)
    refId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    refModel: {
      type: String,
      enum: ["Budget", "Goal", "Expense", "Report", null],
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// ─── PRE-SAVE: Set readAt when isRead is marked true ─────────────────────────
notificationSchema.pre("save", function (next) {
  if (this.isModified("isRead") && this.isRead && !this.readAt) {
    this.readAt = new Date();
  }
  next();
});

// ─── INDEXES ──────────────────────────────────────────────────────────────────
notificationSchema.index({ user: 1, isRead: 1 });
notificationSchema.index({ user: 1, createdAt: -1 });

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
