// src/middleware/rateLimit.middleware.js
// Rate limiting to protect against brute-force and abuse

import rateLimit from "express-rate-limit";
import { STATUS_CODES } from "../constants/statusCodes.js";
import { GENERAL_MESSAGES } from "../constants/messages.js";

// Generic rate limit handler
const rateLimitHandler = (req, res) => {
  return res.status(STATUS_CODES.TOO_MANY_REQUESTS).json({
    success: false,
    message: GENERAL_MESSAGES.TOO_MANY_REQUESTS,
  });
};

// Global limiter — applied to all routes
// 100 requests per 15 minutes per IP
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
});

// Strict limiter for auth routes (login, register, forgot-password)
// 10 requests per 15 minutes per IP
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
  skipSuccessfulRequests: true, // Only count failed requests
});

// Limiter for file upload routes
// 20 uploads per hour per IP
export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
});

// Limiter for report export routes
// 10 exports per hour per IP
export const exportLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
});
