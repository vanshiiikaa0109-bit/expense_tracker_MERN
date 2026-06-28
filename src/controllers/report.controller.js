// src/controllers/report.controller.js
// Handles report generation and export (PDF / Excel)

import * as reportService from "../services/report.service.js";
import { STATUS_CODES } from "../constants/statusCodes.js";
import { REPORT_MESSAGES } from "../constants/messages.js";

// @desc    Generate a monthly report
// @route   POST /api/reports/generate
// @access  Private
export const generateReport = async (req, res) => {
  try {
    const data = await reportService.generateMonthlyReport(req.user.id, req.body);

    return res.status(STATUS_CODES.CREATED).json({
      success: true,
      message: REPORT_MESSAGES.GENERATED,
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all reports for user
// @route   GET /api/reports
// @access  Private
export const getAllReports = async (req, res) => {
  try {
    const data = await reportService.getAllReports(req.user.id);

    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: REPORT_MESSAGES.ALL_FETCHED,
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get a single report
// @route   GET /api/reports/:id
// @access  Private
export const getReportById = async (req, res) => {
  try {
    const data = await reportService.getReportById(req.user.id, req.params.id);

    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: REPORT_MESSAGES.FETCHED,
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Export report as PDF
// @route   GET /api/reports/:id/export/pdf
// @access  Private
export const exportReportPDF = async (req, res) => {
  try {
    const pdfBuffer = await reportService.exportAsPDF(req.user.id, req.params.id);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="report-${req.params.id}.pdf"`,
    });

    return res.send(pdfBuffer);
  } catch (error) {
    return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Export report as Excel
// @route   GET /api/reports/:id/export/excel
// @access  Private
export const exportReportExcel = async (req, res) => {
  try {
    const excelBuffer = await reportService.exportAsExcel(req.user.id, req.params.id);

    res.set({
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="report-${req.params.id}.xlsx"`,
    });

    return res.send(excelBuffer);
  } catch (error) {
    return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete a report
// @route   DELETE /api/reports/:id
// @access  Private
export const deleteReport = async (req, res) => {
  try {
    await reportService.deleteReport(req.user.id, req.params.id);

    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: REPORT_MESSAGES.FETCHED,
      data: null,
    });
  } catch (error) {
    return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};
