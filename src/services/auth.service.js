// src/services/auth.service.js
// Business logic for authentication and user profile management

import crypto from "crypto";
import { generateToken } from "../utils/generateToken.js";
import { sendMail } from "../config/mail.js";
import { env } from "../config/env.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../config/cloudinary.js";
import { STATUS_CODES } from "../constants/statusCodes.js";
import { AUTH_MESSAGES, USER_MESSAGES } from "../constants/messages.js";
import {
  createUser,
  findUserByEmail,
  findUserByEmailWithPassword,
  findUserById,
  findUserByIdWithPassword,
  findUserByResetToken,
  updateUserById,
  deleteUserById,
  emailExists,
} from "../repositories/user.repository.js";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

// ─── Auth ────────────────────────────────────────────────────────────────────

export const registerUser = async ({ name, email, password }) => {
  const exists = await emailExists(email);
  if (exists) throw createError(AUTH_MESSAGES.EMAIL_ALREADY_EXISTS, STATUS_CODES.CONFLICT);

  const user = await createUser({ name, email, password });
  const token = generateToken(user._id);

  return { token, user };
};

export const loginUser = async ({ email, password }) => {
  const user = await findUserByEmailWithPassword(email);
  if (!user) throw createError(AUTH_MESSAGES.INVALID_CREDENTIALS, STATUS_CODES.UNAUTHORIZED);

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw createError(AUTH_MESSAGES.INVALID_CREDENTIALS, STATUS_CODES.UNAUTHORIZED);

  const token = generateToken(user._id);

  // Strip password from returned object
  user.password = undefined;

  return { token, user };
};

export const getAuthUser = async (userId) => {
  const user = await findUserById(userId);
  if (!user) throw createError(USER_MESSAGES.USER_NOT_FOUND, STATUS_CODES.NOT_FOUND);
  return user;
};

export const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await findUserByIdWithPassword(userId);
  if (!user) throw createError(USER_MESSAGES.USER_NOT_FOUND, STATUS_CODES.NOT_FOUND);

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) throw createError("Current password is incorrect", STATUS_CODES.BAD_REQUEST);

  user.password = newPassword;
  await user.save();
};

export const forgotPassword = async (email) => {
  const user = await findUserByEmail(email);
  if (!user) throw createError(USER_MESSAGES.USER_NOT_FOUND, STATUS_CODES.NOT_FOUND);

  const resetToken = user.generateResetToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${env.CLIENT_URL}/reset-password/${resetToken}`;

  await sendMail({
    to: user.email,
    subject: "Smart Expense Tracker — Password Reset",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        <h2>Password Reset Request</h2>
        <p>Hi <strong>${user.name}</strong>,</p>
        <p>You requested to reset your password. Click the button below to proceed.</p>
        <p style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}"
            style="background:#4CAF50;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-size:16px;">
            Reset Password
          </a>
        </p>
        <p>This link expires in <strong>15 minutes</strong>. If you did not request this, ignore this email.</p>
        <p style="color:#718096;font-size:12px;">Smart Expense Tracker</p>
      </div>
    `,
  });
};

export const resetPassword = async (token, newPassword) => {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await findUserByResetToken(hashedToken);

  if (!user) throw createError("Reset token is invalid or has expired", STATUS_CODES.BAD_REQUEST);

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
};

// ─── User Profile ─────────────────────────────────────────────────────────────

export const getUserProfile = async (userId) => {
  const user = await findUserById(userId);
  if (!user) throw createError(USER_MESSAGES.USER_NOT_FOUND, STATUS_CODES.NOT_FOUND);
  return user;
};

export const updateUserProfile = async (userId, updateData) => {
  const user = await updateUserById(userId, updateData);
  if (!user) throw createError(USER_MESSAGES.USER_NOT_FOUND, STATUS_CODES.NOT_FOUND);
  return user;
};

export const updateAvatar = async (userId, file) => {
  if (!file) throw createError("No file uploaded", STATUS_CODES.BAD_REQUEST);

  const user = await findUserById(userId);
  if (!user) throw createError(USER_MESSAGES.USER_NOT_FOUND, STATUS_CODES.NOT_FOUND);

  // Delete old avatar from Cloudinary if it exists
  if (user.avatar?.publicId) {
    await deleteFromCloudinary(user.avatar.publicId);
  }

  const result = await uploadToCloudinary(file.buffer, "avatars");

  const updated = await updateUserById(userId, {
    avatar: { url: result.secure_url, publicId: result.public_id },
  });

  return updated;
};

export const deleteUserAccount = async (userId) => {
  const user = await findUserById(userId);
  if (!user) throw createError(USER_MESSAGES.USER_NOT_FOUND, STATUS_CODES.NOT_FOUND);

  // Delete avatar from Cloudinary
  if (user.avatar?.publicId) {
    await deleteFromCloudinary(user.avatar.publicId);
  }

  await deleteUserById(userId);
};

// ─── Goal, Wallet (used by goal/wallet controllers until dedicated services exist) ─

export const createGoal = async (userId, data) => {
  const Goal = (await import("../models/Goal.js")).default;
  return await Goal.create({ ...data, user: userId });
};

export const getAllGoals = async (userId) => {
  const Goal = (await import("../models/Goal.js")).default;
  return await Goal.find({ user: userId }).sort({ createdAt: -1 });
};

export const getGoalById = async (userId, goalId) => {
  const Goal = (await import("../models/Goal.js")).default;
  const goal = await Goal.findOne({ _id: goalId, user: userId });
  if (!goal) throw createError("Goal not found", STATUS_CODES.NOT_FOUND);
  return goal;
};

export const updateGoal = async (userId, goalId, data) => {
  const Goal = (await import("../models/Goal.js")).default;
  const goal = await Goal.findOneAndUpdate(
    { _id: goalId, user: userId },
    { $set: data },
    { new: true, runValidators: true }
  );
  if (!goal) throw createError("Goal not found", STATUS_CODES.NOT_FOUND);
  return goal;
};

export const contributeToGoal = async (userId, goalId, amount) => {
  const Goal = (await import("../models/Goal.js")).default;
  const goal = await Goal.findOne({ _id: goalId, user: userId });
  if (!goal) throw createError("Goal not found", STATUS_CODES.NOT_FOUND);

  goal.savedAmount += Number(amount);
  goal.contributions.push({ amount: Number(amount) });
  await goal.save();
  return goal;
};

export const deleteGoal = async (userId, goalId) => {
  const Goal = (await import("../models/Goal.js")).default;
  const goal = await Goal.findOneAndDelete({ _id: goalId, user: userId });
  if (!goal) throw createError("Goal not found", STATUS_CODES.NOT_FOUND);
};

export const createWallet = async (userId, data) => {
  const Wallet = (await import("../models/Wallet.js")).default;
  return await Wallet.create({ ...data, user: userId });
};

export const getAllWallets = async (userId) => {
  const Wallet = (await import("../models/Wallet.js")).default;
  return await Wallet.find({ user: userId }).sort({ isDefault: -1, createdAt: -1 });
};

export const getWalletById = async (userId, walletId) => {
  const Wallet = (await import("../models/Wallet.js")).default;
  const wallet = await Wallet.findOne({ _id: walletId, user: userId });
  if (!wallet) throw createError("Wallet not found", STATUS_CODES.NOT_FOUND);
  return wallet;
};

export const updateWallet = async (userId, walletId, data) => {
  const Wallet = (await import("../models/Wallet.js")).default;
  const wallet = await Wallet.findOneAndUpdate(
    { _id: walletId, user: userId },
    { $set: data },
    { new: true, runValidators: true }
  );
  if (!wallet) throw createError("Wallet not found", STATUS_CODES.NOT_FOUND);
  return wallet;
};

export const deleteWallet = async (userId, walletId) => {
  const Wallet = (await import("../models/Wallet.js")).default;
  const wallet = await Wallet.findOneAndDelete({ _id: walletId, user: userId });
  if (!wallet) throw createError("Wallet not found", STATUS_CODES.NOT_FOUND);
};

export const transferFunds = async (userId, fromWalletId, toWalletId, amount) => {
  const Wallet = (await import("../models/Wallet.js")).default;

  const fromWallet = await Wallet.findOne({ _id: fromWalletId, user: userId });
  const toWallet   = await Wallet.findOne({ _id: toWalletId,   user: userId });

  if (!fromWallet || !toWallet) throw createError("Wallet not found", STATUS_CODES.NOT_FOUND);
  if (fromWallet.balance < amount) throw createError("Insufficient wallet balance", STATUS_CODES.BAD_REQUEST);

  fromWallet.balance -= Number(amount);
  toWallet.balance   += Number(amount);

  await fromWallet.save();
  await toWallet.save();

  return { fromWallet, toWallet };
};
