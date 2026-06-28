// src/routes/user.routes.js
// User profile management routes

import express from "express";
import {
  getProfile,
  updateProfile,
  updateAvatar,
  deleteAccount,
} from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { uploadAvatar, handleUploadError } from "../middleware/upload.middleware.js";
import { validate } from "../middleware/validation.middleware.js";

const router = express.Router();

// All user routes are private
router.use(protect);

// @route   GET /api/users/profile
// @access  Private
router.get("/profile", getProfile);

// @route   PUT /api/users/profile
// @access  Private
router.put("/profile", updateProfile);

// @route   PUT /api/users/avatar
// @access  Private
router.put("/avatar", uploadAvatar, handleUploadError, updateAvatar);

// @route   DELETE /api/users/account
// @access  Private
router.delete("/account", deleteAccount);

export default router;
