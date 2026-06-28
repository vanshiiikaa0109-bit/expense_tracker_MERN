// src/repositories/user.repository.js
// All database queries related to the User model

import User from "../models/User.js";

// Find a user by ID (excludes password by default)
export const findUserById = async (id) => {
  return await User.findById(id).select("-password");
};

// Find a user by ID including password (for auth comparison)
export const findUserByIdWithPassword = async (id) => {
  return await User.findById(id).select("+password");
};

// Find a user by email (excludes password)
export const findUserByEmail = async (email) => {
  return await User.findOne({ email: email.toLowerCase() });
};

// Find a user by email including password (for login)
export const findUserByEmailWithPassword = async (email) => {
  return await User.findOne({ email: email.toLowerCase() }).select("+password");
};

// Find a user by hashed reset token that has not expired
export const findUserByResetToken = async (hashedToken) => {
  return await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  }).select("+password +resetPasswordToken +resetPasswordExpire");
};

// Create a new user
export const createUser = async (userData) => {
  return await User.create(userData);
};

// Update a user by ID and return the updated document
export const updateUserById = async (id, updateData) => {
  return await User.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true }
  ).select("-password");
};

// Soft-delete a user account by marking isActive false
export const deactivateUserById = async (id) => {
  return await User.findByIdAndUpdate(
    id,
    { $set: { isActive: false } },
    { new: true }
  );
};

// Hard-delete a user account permanently
export const deleteUserById = async (id) => {
  return await User.findByIdAndDelete(id);
};

// Check if an email is already taken (for registration validation)
export const emailExists = async (email) => {
  const user = await User.findOne({ email: email.toLowerCase() }).select("_id");
  return !!user;
};
