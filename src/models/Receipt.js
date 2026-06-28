// src/models/Receipt.js
// Receipt image schema — stores Cloudinary URL and links to an expense

import mongoose from "mongoose";

const receiptSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
      index: true,
    },

    // Cloudinary image URL
    imageUrl: {
      type: String,
      required: [true, "Image URL is required"],
    },

    // Cloudinary public ID (needed for deletion)
    publicId: {
      type: String,
      required: [true, "Cloudinary public ID is required"],
    },

    // Linked expense (optional — can be linked after upload)
    expense: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Expense",
      default: null,
    },

    note: {
      type: String,
      trim: true,
      maxlength: [200, "Note cannot exceed 200 characters"],
      default: "",
    },

    // Original file name for display purposes
    originalName: {
      type: String,
      default: "",
    },

    // File size in bytes
    fileSize: {
      type: Number,
      default: 0,
    },

    // MIME type (image/jpeg, application/pdf, etc.)
    mimeType: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// ─── INDEXES ──────────────────────────────────────────────────────────────────
receiptSchema.index({ user: 1, createdAt: -1 });
receiptSchema.index({ expense: 1 });

const Receipt = mongoose.model("Receipt", receiptSchema);
export default Receipt;
