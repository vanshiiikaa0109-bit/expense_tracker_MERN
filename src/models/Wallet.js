// src/models/Wallet.js
// Wallet / account schema for managing multiple financial accounts

import mongoose from "mongoose";
import { WALLET_TYPES } from "../constants/categories.js";

const walletSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
      index: true,
    },

    name: {
      type: String,
      required: [true, "Wallet name is required"],
      trim: true,
      maxlength: [50, "Wallet name cannot exceed 50 characters"],
    },

    type: {
      type: String,
      required: [true, "Wallet type is required"],
      enum: {
        values: WALLET_TYPES,
        message: "{VALUE} is not a valid wallet type",
      },
    },

    balance: {
      type: Number,
      required: [true, "Balance is required"],
      default: 0,
    },

    currency: {
      type: String,
      default: "USD",
      uppercase: true,
      trim: true,
    },

    color: {
      type: String,
      default: "#4CAF50",
    },

    icon: {
      type: String,
      default: "💳",
    },

    // Only one wallet can be the default per user
    isDefault: {
      type: Boolean,
      default: false,
    },

    description: {
      type: String,
      trim: true,
      maxlength: [200, "Description cannot exceed 200 characters"],
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// ─── PRE-SAVE: Ensure only one default wallet per user ───────────────────────
walletSchema.pre("save", async function (next) {
  if (this.isModified("isDefault") && this.isDefault) {
    await this.constructor.updateMany(
      { user: this.user, _id: { $ne: this._id } },
      { isDefault: false }
    );
  }
  next();
});

// ─── INDEXES ──────────────────────────────────────────────────────────────────
walletSchema.index({ user: 1 });
walletSchema.index({ user: 1, isDefault: 1 });

const Wallet = mongoose.model("Wallet", walletSchema);
export default Wallet;
