// src/services/receipt.service.js
// Business logic for receipt upload, retrieval, and Cloudinary management

import Receipt from "../models/Receipt.js";
import Expense from "../models/Expense.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../config/cloudinary.js";
import { STATUS_CODES } from "../constants/statusCodes.js";
import { RECEIPT_MESSAGES } from "../constants/messages.js";

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

export const uploadReceipt = async (userId, file, body = {}) => {
  if (!file) throw createError("No file provided", STATUS_CODES.BAD_REQUEST);

  // Upload to Cloudinary
  const result = await uploadToCloudinary(file.buffer, "receipts");

  const receipt = await Receipt.create({
    user: userId,
    imageUrl:     result.secure_url,
    publicId:     result.public_id,
    originalName: file.originalname,
    fileSize:     file.size,
    mimeType:     file.mimetype,
    note:         body.note || "",
    expense:      body.expenseId || null,
  });

  // If an expenseId was provided, link receipt to the expense
  if (body.expenseId) {
    await Expense.findOneAndUpdate(
      { _id: body.expenseId, user: userId },
      { receipt: receipt._id }
    );
  }

  return receipt;
};

export const getAllReceipts = async (userId, query = {}) => {
  const { page = 1, limit = 10 } = query;
  const skip = (page - 1) * limit;

  const [receipts, total] = await Promise.all([
    Receipt.find({ user: userId })
      .populate("expense", "title amount date category")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Receipt.countDocuments({ user: userId }),
  ]);

  return {
    receipts,
    total,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(total / limit),
  };
};

export const getReceiptById = async (userId, receiptId) => {
  const receipt = await Receipt.findOne({ _id: receiptId, user: userId })
    .populate("expense", "title amount date category");
  if (!receipt) throw createError(RECEIPT_MESSAGES.NOT_FOUND, STATUS_CODES.NOT_FOUND);
  return receipt;
};

export const deleteReceipt = async (userId, receiptId) => {
  const receipt = await Receipt.findOne({ _id: receiptId, user: userId });
  if (!receipt) throw createError(RECEIPT_MESSAGES.NOT_FOUND, STATUS_CODES.NOT_FOUND);

  // Remove from Cloudinary
  await deleteFromCloudinary(receipt.publicId);

  // Unlink from expense if linked
  if (receipt.expense) {
    await Expense.findByIdAndUpdate(receipt.expense, { receipt: null });
  }

  await Receipt.findByIdAndDelete(receiptId);
};

export const linkToExpense = async (userId, receiptId, expenseId) => {
  const receipt = await Receipt.findOne({ _id: receiptId, user: userId });
  if (!receipt) throw createError(RECEIPT_MESSAGES.NOT_FOUND, STATUS_CODES.NOT_FOUND);

  const expense = await Expense.findOne({ _id: expenseId, user: userId });
  if (!expense) throw createError("Expense not found", STATUS_CODES.NOT_FOUND);

  receipt.expense = expenseId;
  await receipt.save();

  await Expense.findByIdAndUpdate(expenseId, { receipt: receiptId });

  return receipt;
};
