// src/routes/receipt.routes.js
// Receipt upload, retrieval, and expense linking routes

import express from "express";
import {
  uploadReceipt,
  getAllReceipts,
  getReceiptById,
  deleteReceipt,
  linkReceiptToExpense,
} from "../controllers/receipt.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import {
  uploadReceipt as uploadReceiptMiddleware,
  handleUploadError,
} from "../middleware/upload.middleware.js";
import { uploadLimiter } from "../middleware/rateLimit.middleware.js";

const router = express.Router();

// All receipt routes are private
router.use(protect);

// @route   GET  /api/receipts
// @access  Private
router.get("/", getAllReceipts);

// @route   POST /api/receipts/upload
// @access  Private
router.post(
  "/upload",
  uploadLimiter,
  uploadReceiptMiddleware,
  handleUploadError,
  uploadReceipt
);

// @route   PUT /api/receipts/:id/link/:expenseId
// @access  Private
// NOTE: Must be defined before /:id to avoid param conflict
router.put("/:id/link/:expenseId", linkReceiptToExpense);

// @route   GET    /api/receipts/:id
// @route   DELETE /api/receipts/:id
// @access  Private
router
  .route("/:id")
  .get(getReceiptById)
  .delete(deleteReceipt);

export default router;
