// src/routes/report.routes.js
// Report generation and PDF/Excel export routes

import express from "express";
import {
  generateReport,
  getAllReports,
  getReportById,
  exportReportPDF,
  exportReportExcel,
  deleteReport,
} from "../controllers/report.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { exportLimiter } from "../middleware/rateLimit.middleware.js";

const router = express.Router();

// All report routes are private
router.use(protect);

// @route   GET  /api/reports
// @access  Private
router.get("/", getAllReports);

// @route   POST /api/reports/generate
// @access  Private
router.post("/generate", generateReport);

// @route   GET /api/reports/:id/export/pdf
// @access  Private
router.get("/:id/export/pdf", exportLimiter, exportReportPDF);

// @route   GET /api/reports/:id/export/excel
// @access  Private
router.get("/:id/export/excel", exportLimiter, exportReportExcel);

// @route   GET    /api/reports/:id
// @route   DELETE /api/reports/:id
// @access  Private
router
  .route("/:id")
  .get(getReportById)
  .delete(deleteReport);

export default router;
