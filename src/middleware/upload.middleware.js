// src/middleware/upload.middleware.js
// Multer configuration for handling file uploads (receipts and avatars)

import multer from "multer";
import { STATUS_CODES } from "../constants/statusCodes.js";
import { GENERAL_MESSAGES } from "../constants/messages.js";

// Use memory storage so the buffer can be streamed directly to Cloudinary
const storage = multer.memoryStorage();

// Allowed MIME types
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "application/pdf",
];

const FILE_SIZE_LIMIT = 5 * 1024 * 1024; // 5 MB

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      Object.assign(new Error(GENERAL_MESSAGES.INVALID_FILE_TYPE), {
        statusCode: STATUS_CODES.BAD_REQUEST,
      }),
      false
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: FILE_SIZE_LIMIT },
});

// Middleware for single receipt upload — field name: "receipt"
export const uploadReceipt = upload.single("receipt");

// Middleware for single avatar upload — field name: "avatar"
export const uploadAvatar = upload.single("avatar");

// Global multer error handler — attach after route to catch multer-specific errors
export const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: GENERAL_MESSAGES.FILE_TOO_LARGE,
      });
    }
    return res.status(STATUS_CODES.BAD_REQUEST).json({
      success: false,
      message: err.message,
    });
  }

  if (err) {
    return res.status(err.statusCode || STATUS_CODES.BAD_REQUEST).json({
      success: false,
      message: err.message,
    });
  }

  next();
};
