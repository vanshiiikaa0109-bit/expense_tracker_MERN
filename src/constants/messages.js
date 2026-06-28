// src/constants/messages.js
// Centralized API response messages used across controllers and services

export const AUTH_MESSAGES = {
  REGISTER_SUCCESS: "Account created successfully",
  LOGIN_SUCCESS: "Login successful",
  LOGOUT_SUCCESS: "Logged out successfully",
  INVALID_CREDENTIALS: "Invalid email or password",
  EMAIL_ALREADY_EXISTS: "An account with this email already exists",
  UNAUTHORIZED: "Unauthorized. Please login to continue",
  TOKEN_EXPIRED: "Session expired. Please login again",
  TOKEN_INVALID: "Invalid token. Please login again",
  PASSWORD_CHANGED: "Password changed successfully",
  RESET_EMAIL_SENT: "Password reset email sent successfully",
  RESET_SUCCESS: "Password has been reset successfully",
};

export const USER_MESSAGES = {
  PROFILE_FETCHED: "Profile fetched successfully",
  PROFILE_UPDATED: "Profile updated successfully",
  AVATAR_UPDATED: "Profile picture updated successfully",
  USER_NOT_FOUND: "User not found",
  ACCOUNT_DELETED: "Account deleted successfully",
};

export const EXPENSE_MESSAGES = {
  CREATED: "Expense created successfully",
  UPDATED: "Expense updated successfully",
  DELETED: "Expense deleted successfully",
  FETCHED: "Expense fetched successfully",
  ALL_FETCHED: "Expenses fetched successfully",
  NOT_FOUND: "Expense not found",
  UNAUTHORIZED: "You are not authorized to modify this expense",
};

export const BUDGET_MESSAGES = {
  CREATED: "Budget created successfully",
  UPDATED: "Budget updated successfully",
  DELETED: "Budget deleted successfully",
  FETCHED: "Budget fetched successfully",
  ALL_FETCHED: "Budgets fetched successfully",
  NOT_FOUND: "Budget not found",
  EXCEEDED: "Budget limit exceeded for this category",
  ALERT: "You have used 80% of your budget",
};

export const GOAL_MESSAGES = {
  CREATED: "Goal created successfully",
  UPDATED: "Goal updated successfully",
  DELETED: "Goal deleted successfully",
  FETCHED: "Goal fetched successfully",
  ALL_FETCHED: "Goals fetched successfully",
  NOT_FOUND: "Goal not found",
  COMPLETED: "Congratulations! Goal achieved",
  CONTRIBUTION_ADDED: "Contribution added to goal",
};

export const WALLET_MESSAGES = {
  CREATED: "Wallet created successfully",
  UPDATED: "Wallet updated successfully",
  DELETED: "Wallet deleted successfully",
  FETCHED: "Wallet fetched successfully",
  ALL_FETCHED: "Wallets fetched successfully",
  NOT_FOUND: "Wallet not found",
  INSUFFICIENT_BALANCE: "Insufficient wallet balance",
};

export const RECEIPT_MESSAGES = {
  UPLOADED: "Receipt uploaded successfully",
  DELETED: "Receipt deleted successfully",
  FETCHED: "Receipt fetched successfully",
  ALL_FETCHED: "Receipts fetched successfully",
  NOT_FOUND: "Receipt not found",
  UPLOAD_FAILED: "Receipt upload failed",
};

export const REPORT_MESSAGES = {
  GENERATED: "Report generated successfully",
  FETCHED: "Report fetched successfully",
  ALL_FETCHED: "Reports fetched successfully",
  NOT_FOUND: "Report not found",
  EXPORT_SUCCESS: "Report exported successfully",
};

export const ANALYTICS_MESSAGES = {
  FETCHED: "Analytics data fetched successfully",
  SUMMARY_FETCHED: "Expense summary fetched successfully",
  INSIGHTS_FETCHED: "Spending insights fetched successfully",
};

export const NOTIFICATION_MESSAGES = {
  FETCHED: "Notifications fetched successfully",
  MARKED_READ: "Notification marked as read",
  ALL_MARKED_READ: "All notifications marked as read",
  DELETED: "Notification deleted successfully",
  NOT_FOUND: "Notification not found",
};

export const GENERAL_MESSAGES = {
  SERVER_ERROR: "Internal server error. Please try again later",
  VALIDATION_ERROR: "Validation failed. Please check your inputs",
  NOT_FOUND: "Resource not found",
  BAD_REQUEST: "Bad request",
  FORBIDDEN: "Access denied",
  TOO_MANY_REQUESTS: "Too many requests. Please slow down",
  FILE_TOO_LARGE: "File size exceeds the allowed limit",
  INVALID_FILE_TYPE: "Invalid file type. Only images and PDFs are allowed",
};
