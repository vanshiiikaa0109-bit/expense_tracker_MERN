// src/controllers/receipt.controller.js
// Handles receipt image upload and management via Cloudinary

import * as receiptService from "../services/receipt.service.js";
import { STATUS_CODES } from "../constants/statusCodes.js";
import { RECEIPT_MESSAGES } from "../constants/messages.js";

// @desc    Upload a receipt image
// @route   POST /api/receipts/upload
// @access  Private
export const uploadReceipt = async (req, res) => {
  try {
    const data = await receiptService.uploadReceipt(req.user.id, req.file, req.body);

    return res.status(STATUS_CODES.CREATED).json({
      success: true,
      message: RECEIPT_MESSAGES.UPLOADED,
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all receipts for user
// @route   GET /api/receipts
// @access  Private
export const getAllReceipts = async (req, res) => {
  try {
    const data = await receiptService.getAllReceipts(req.user.id, req.query);

    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: RECEIPT_MESSAGES.ALL_FETCHED,
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single receipt by ID
// @route   GET /api/receipts/:id
// @access  Private
export const getReceiptById = async (req, res) => {
  try {
    const data = await receiptService.getReceiptById(req.user.id, req.params.id);

    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: RECEIPT_MESSAGES.FETCHED,
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete a receipt (also removes from Cloudinary)
// @route   DELETE /api/receipts/:id
// @access  Private
export const deleteReceipt = async (req, res) => {
  try {
    await receiptService.deleteReceipt(req.user.id, req.params.id);

    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: RECEIPT_MESSAGES.DELETED,
      data: null,
    });
  } catch (error) {
    return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Link a receipt to an expense
// @route   PUT /api/receipts/:id/link/:expenseId
// @access  Private
export const linkReceiptToExpense = async (req, res) => {
  try {
    const data = await receiptService.linkToExpense(
      req.user.id,
      req.params.id,
      req.params.expenseId
    );

    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: "Receipt linked to expense successfully",
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};
