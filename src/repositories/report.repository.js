// src/repositories/report.repository.js
// All database queries related to the Report model

import Report from "../models/Report.js";

// Create a new report
export const createReport = async (data) => {
  return await Report.create(data);
};

// Find a report by ID and user (ownership check)
export const findReportById = async (reportId, userId) => {
  return await Report.findOne({ _id: reportId, user: userId });
};

// Find a report by user, month, and year
export const findReportByMonthYear = async (userId, month, year) => {
  return await Report.findOne({ user: userId, month, year });
};

// Find all reports for a user, sorted by most recent first
export const findAllReports = async (userId) => {
  return await Report.find({ user: userId }).sort({ year: -1, month: -1 });
};

// Update an existing report by ID and user
export const updateReportById = async (reportId, userId, updateData) => {
  return await Report.findOneAndUpdate(
    { _id: reportId, user: userId },
    { $set: updateData },
    { new: true, runValidators: true }
  );
};

// Create a report if it doesn't exist, or update it if it does (upsert)
export const upsertReport = async (userId, month, year, reportData) => {
  return await Report.findOneAndUpdate(
    { user: userId, month, year },
    { $set: { ...reportData, user: userId, month, year } },
    { new: true, upsert: true, runValidators: true }
  );
};

// Delete a report by ID and user
export const deleteReportById = async (reportId, userId) => {
  return await Report.findOneAndDelete({ _id: reportId, user: userId });
};

// Get report count for a user
export const countReports = async (userId) => {
  return await Report.countDocuments({ user: userId });
};
