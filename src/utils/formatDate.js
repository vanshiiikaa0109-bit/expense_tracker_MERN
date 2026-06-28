// src/utils/formatDate.js
// Reusable date formatting and manipulation helpers

/**
 * Format a date to a readable string
 * @param {Date|string} date
 * @param {string} locale - e.g. "en-US", "en-IN"
 * @returns {string} e.g. "June 15, 2024"
 */
export const formatDateLong = (date, locale = "en-US") => {
  return new Date(date).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Format a date to short form
 * @param {Date|string} date
 * @returns {string} e.g. "15 Jun 2024"
 */
export const formatDateShort = (date) => {
  return new Date(date).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};

/**
 * Format a date to ISO date string (YYYY-MM-DD)
 * @param {Date|string} date
 * @returns {string} e.g. "2024-06-15"
 */
export const formatDateISO = (date) => {
  return new Date(date).toISOString().split("T")[0];
};

/**
 * Get the full month name from a month number
 * @param {number} month - 1-12
 * @returns {string} e.g. "June"
 */
export const getMonthName = (month) => {
  return new Date(2000, month - 1, 1).toLocaleString("default", {
    month: "long",
  });
};

/**
 * Get the short month name from a month number
 * @param {number} month - 1-12
 * @returns {string} e.g. "Jun"
 */
export const getMonthNameShort = (month) => {
  return new Date(2000, month - 1, 1).toLocaleString("default", {
    month: "short",
  });
};

/**
 * Get start and end of a given month
 * @param {number} month - 1-12
 * @param {number} year
 * @returns {{ startDate: Date, endDate: Date }}
 */
export const getMonthRange = (month, year) => {
  return {
    startDate: new Date(year, month - 1, 1),
    endDate: new Date(year, month, 0, 23, 59, 59, 999),
  };
};

/**
 * Get start and end of the current week (Sunday–Saturday)
 * @returns {{ startDate: Date, endDate: Date }}
 */
export const getCurrentWeekRange = () => {
  const now = new Date();
  const day = now.getDay();
  const startDate = new Date(now);
  startDate.setDate(now.getDate() - day);
  startDate.setHours(0, 0, 0, 0);
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);
  endDate.setHours(23, 59, 59, 999);
  return { startDate, endDate };
};

/**
 * Get start and end of the current year
 * @returns {{ startDate: Date, endDate: Date }}
 */
export const getCurrentYearRange = () => {
  const year = new Date().getFullYear();
  return {
    startDate: new Date(year, 0, 1),
    endDate: new Date(year, 11, 31, 23, 59, 59, 999),
  };
};

/**
 * Check if a date falls within a given range
 * @param {Date} date
 * @param {Date} startDate
 * @param {Date} endDate
 * @returns {boolean}
 */
export const isWithinRange = (date, startDate, endDate) => {
  const d = new Date(date);
  return d >= new Date(startDate) && d <= new Date(endDate);
};

/**
 * Get how many days remain until a target date
 * @param {Date|string} targetDate
 * @returns {number} Days remaining (negative if past)
 */
export const daysUntil = (targetDate) => {
  const now  = new Date();
  const target = new Date(targetDate);
  const diffMs = target - now;
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
};
