
import { Resend } from "resend";

import("dotenv/config");

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * sendResetEmail(toEmail, resetUrl, userName)
 * - toEmail: recipient email
 * - resetUrl: complete link user clicks
 * - userName: optional
 */
export const sendResetEmail = async (toEmail, resetUrl, userName = "") => {
  const subject = "DebterLink — Password reset request";
  const html = `
    <p>Hi ${userName || "there"},</p>
    <p>We received a request to reset your password. Click the link below to set a new password. This link will expire in ${
      process.env.RESET_TOKEN_EXPIRY_MINUTES || 15
    } minutes.</p>
    <p><a href="${resetUrl}">Reset your password</a></p>
    <p>If you didn't request this, you can safely ignore this email.</p>
    <p>— DebterLink team</p>
  `;

  return resend.emails.send({
    from: process.env.EMAIL_FROM || "no-reply@debterlink.com",
    to: toEmail,
    subject,
    html,
  });
};
