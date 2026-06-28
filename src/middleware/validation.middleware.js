// src/middleware/validation.middleware.js
// Runs express-validator checks and returns a unified error response

import { validationResult } from "express-validator";
import { STATUS_CODES } from "../constants/statusCodes.js";
import { GENERAL_MESSAGES } from "../constants/messages.js";

/**
 * Middleware that reads the result of express-validator checks.
 * Place this AFTER the validator chain in each route definition.
 *
 * Usage:
 *   router.post("/register", authValidators.register, validate, authController.register);
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // Format errors into a clean array: [{ field, message }]
    const formatted = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg,
    }));

    return res.status(STATUS_CODES.UNPROCESSABLE).json({
      success: false,
      message: GENERAL_MESSAGES.VALIDATION_ERROR,
      errors: formatted,
    });
  }

  next();
};
