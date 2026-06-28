// src/models/Goal.js
// Savings goal schema with progress tracking and contributions

import mongoose from "mongoose";
import { GOAL_CATEGORIES } from "../constants/categories.js";

const goalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
      index: true,
    },

    title: {
      type: String,
      required: [true, "Goal title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [300, "Description cannot exceed 300 characters"],
      default: "",
    },

    targetAmount: {
      type: Number,
      required: [true, "Target amount is required"],
      min: [1, "Target amount must be greater than 0"],
    },

    savedAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    category: {
      type: String,
      enum: {
        values: GOAL_CATEGORIES,
        message: "{VALUE} is not a valid goal category",
      },
      default: "Other",
    },

    deadline: {
      type: Date,
      required: [true, "Deadline is required"],
    },

    isCompleted: {
      type: Boolean,
      default: false,
    },

    completedAt: {
      type: Date,
      default: null,
    },

    // History of individual contributions
    contributions: [
      {
        amount: { type: Number, required: true },
        date: { type: Date, default: Date.now },
        note: { type: String, default: "" },
      },
    ],

    color: {
      type: String,
      default: "#4CAF50",
    },

    icon: {
      type: String,
      default: "🎯",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── VIRTUAL: Progress percentage ────────────────────────────────────────────
goalSchema.virtual("progressPercent").get(function () {
  if (this.targetAmount === 0) return 0;
  return parseFloat(
    Math.min((this.savedAmount / this.targetAmount) * 100, 100).toFixed(2)
  );
});

// ─── VIRTUAL: Remaining amount needed ────────────────────────────────────────
goalSchema.virtual("remainingAmount").get(function () {
  return Math.max(this.targetAmount - this.savedAmount, 0);
});

// ─── PRE-SAVE: Auto-mark goal as completed when target is reached ─────────────
goalSchema.pre("save", function (next) {
  if (this.savedAmount >= this.targetAmount && !this.isCompleted) {
    this.isCompleted = true;
    this.completedAt = new Date();
  }
  next();
});

// ─── INDEXES ──────────────────────────────────────────────────────────────────
goalSchema.index({ user: 1, isCompleted: 1 });
goalSchema.index({ user: 1, deadline: 1 });

const Goal = mongoose.model("Goal", goalSchema);
export default Goal;
