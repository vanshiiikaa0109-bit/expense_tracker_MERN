// src/config/mail.js
// Nodemailer transporter setup and reusable sendMail helper

import nodemailer from "nodemailer";
import { env } from "./env.js";

const transporter = nodemailer.createTransport({
  host: env.MAIL_HOST,
  port: env.MAIL_PORT,
  secure: env.MAIL_PORT === 465, // true for 465 (SSL), false for 587 (TLS)
  auth: {
    user: env.MAIL_USER,
    pass: env.MAIL_PASS,
  },
});

// Verify transporter connection on startup (non-blocking)
transporter.verify((error) => {
  if (error) {
    console.error(`Mail transporter error: ${error.message}`);
  } else {
    console.log("Mail transporter is ready");
  }
});

/**
 * Send an email
 * @param {object} options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML body content
 * @param {string} [options.text] - Plain text fallback
 * @returns {Promise<object>} Nodemailer send result
 */
export const sendMail = async ({ to, subject, html, text }) => {
  const mailOptions = {
    from: env.MAIL_FROM,
    to,
    subject,
    html,
    ...(text && { text }),
  };

  return await transporter.sendMail(mailOptions);
};

export default transporter;
