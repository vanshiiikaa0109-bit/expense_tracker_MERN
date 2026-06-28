// src/middleware/error.middleware.js
// Global error handler and 404 handler for Express

import { STATUS_CODES } from "../constants/statusCodes.js";
import { GENERAL_MESSAGES } from "../constants/messages.js";
import { env } from "../config/env.js";

// 404 handler — catches requests to undefined routes
export const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = STATUS_CODES.NOT_FOUND;
  next(error);
};

// Global error handler — catches all errors passed via next(error)
export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR;
  let message = err.message || GENERAL_MESSAGES.SERVER_ERROR;

  // Mongoose bad ObjectId (CastError)
  if (err.name === "CastError") {
    statusCode = STATUS_CODES.BAD_REQUEST;
    message = `Invalid ID format: ${err.value}`;
  }

  // Mongoose duplicate key error (code 11000)
  if (err.code === 11000) {
    statusCode = STATUS_CODES.CONFLICT;
    const field = Object.keys(err.keyValue || {})[0];
    message = `Duplicate value for field: ${field}`;
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    statusCode = STATUS_CODES.UNPROCESSABLE;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }

  // JWT errors (caught here as a fallback)
  if (err.name === "JsonWebTokenError") {
    statusCode = STATUS_CODES.UNAUTHORIZED;
    message = "Invalid token";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = STATUS_CODES.UNAUTHORIZED;
    message = "Token expired";
  }

  // Build the response
  const response = {
    success: false,
    message,
  };

  // Include stack trace in development only
  if (env.NODE_ENV === "development") {
    response.stack = err.stack;
  }

  return res.status(statusCode).json(response);
};
