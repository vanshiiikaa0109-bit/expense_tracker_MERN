// src/middleware/auth.middleware.js
// Verifies JWT token and attaches user to request

import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { env } from "../config/env.js";
import { STATUS_CODES } from "../constants/statusCodes.js";
import { AUTH_MESSAGES } from "../constants/messages.js";

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(STATUS_CODES.UNAUTHORIZED).json({
        success: false,
        message: AUTH_MESSAGES.UNAUTHORIZED,
      });
    }

    const token = authHeader.split(" ")[1];

    let decoded;
    try {
      decoded = jwt.verify(token, env.JWT_SECRET);
    } catch (err) {
      const message =
        err.name === "TokenExpiredError"
          ? AUTH_MESSAGES.TOKEN_EXPIRED
          : AUTH_MESSAGES.TOKEN_INVALID;

      return res.status(STATUS_CODES.UNAUTHORIZED).json({
        success: false,
        message,
      });
    }

    // Attach the user (without password) to req.user
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(STATUS_CODES.UNAUTHORIZED).json({
        success: false,
        message: AUTH_MESSAGES.UNAUTHORIZED,
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};
