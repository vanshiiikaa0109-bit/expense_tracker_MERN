// src/models/User.js
// User account schema with password hashing and token generation

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
} from "../constants/categories.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Never returned in queries by default
    },

    avatar: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },

    currency: {
      type: String,
      default: "USD",
      uppercase: true,
      trim: true,
    },

    timezone: {
      type: String,
      default: "UTC",
    },

    // Password reset fields
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpire: { type: Date, select: false },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// ─── PRE-SAVE: Hash password before saving ───────────────────────────────────
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ─── METHOD: Compare entered password with hashed password ───────────────────
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ─── METHOD: Generate and store a password reset token ───────────────────────
userSchema.methods.generateResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  // Hash and store the token (store hash, send plain token to user via email)
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Token expires in 15 minutes
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

// ─── TRANSFORM: Remove sensitive fields from JSON output ─────────────────────
userSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.resetPasswordToken;
    delete ret.resetPasswordExpire;
    return ret;
  },
});

const User = mongoose.model("User", userSchema);
export default User;
