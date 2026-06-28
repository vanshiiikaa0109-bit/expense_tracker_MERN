// src/routes/auth.routes.js
// Authentication routes — register, login, password management

import express from "express";
import {
  register,
  login,
  getMe,
  changePassword,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validation.middleware.js";
import { authLimiter } from "../middleware/rateLimit.middleware.js";
import {
  registerValidator,
  loginValidator,
  changePasswordValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} from "../validators/auth.validator.js";

const router = express.Router();

// @route   POST /api/auth/register
// @access  Public
router.post("/register", authLimiter, registerValidator, validate, register);

// @route   POST /api/auth/login
// @access  Public
router.post("/login", authLimiter, loginValidator, validate, login);

// @route   GET /api/auth/me
// @access  Private
router.get("/me", protect, getMe);

// @route   PUT /api/auth/change-password
// @access  Private
router.put("/change-password", protect, changePasswordValidator, validate, changePassword);

// @route   POST /api/auth/forgot-password
// @access  Public
router.post("/forgot-password", authLimiter, forgotPasswordValidator, validate, forgotPassword);

// @route   PUT /api/auth/reset-password/:token
// @access  Public
router.put("/reset-password/:token", resetPasswordValidator, validate, resetPassword);

export default router;
