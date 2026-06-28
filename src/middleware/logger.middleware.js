// src/middleware/logger.middleware.js
// HTTP request logger using morgan

import morgan from "morgan";
import { env } from "../config/env.js";

// Custom token: log request body (masked for sensitive fields)
morgan.token("body", (req) => {
  const body = { ...req.body };

  // Mask sensitive fields before logging
  if (body.password) body.password = "***";
  if (body.currentPassword) body.currentPassword = "***";
  if (body.newPassword) body.newPassword = "***";

  return JSON.stringify(body);
});

// Custom token: log the authenticated user ID if available
morgan.token("user-id", (req) => {
  return req.user ? req.user._id.toString() : "guest";
});

// Development format — verbose, color-coded
const devFormat =
  ":method :url :status :response-time ms | user: :user-id | body: :body";

// Production format — compact, structured
const prodFormat =
  ':remote-addr - :method :url HTTP/:http-version :status :res[content-length] ":referrer" ":user-agent" - :response-time ms';

const logger = morgan(env.NODE_ENV === "production" ? prodFormat : devFormat, {
  // Skip logging for health-check endpoints
  skip: (req) => req.url === "/health" || req.url === "/api/health",
});

export default logger;
