// src/utils/generateToken.js
// Generates a signed JWT token for authenticated users

import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

/**
 * Generate a JWT token for a user
 * @param {string} userId - MongoDB user _id
 * @returns {string} Signed JWT token
 */
export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
};

/**
 * Verify and decode a JWT token
 * @param {string} token - JWT token string
 * @returns {object} Decoded payload { id, iat, exp }
 */
export const verifyToken = (token) => {
  return jwt.verify(token, env.JWT_SECRET);
};
