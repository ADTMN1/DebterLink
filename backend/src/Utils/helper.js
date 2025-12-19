// In src/utils/helpers.js
import crypto from 'crypto';
import { sendWelcomeEmail as sendWelcomeEmailBrevo } from "../services/Email/email.service.js";

// Send welcome email with password setup link
export const sendWelcomeEmail = async (email, name, token, userId) => {
  const resetLink = `${process.env.FRONTEND_URL}/setup-password?token=${token}&user_id=${userId}`;

  try {
    await sendWelcomeEmailBrevo(email, resetLink, name);
  } catch (error) {
    console.error('Error sending welcome email:', error);
    // Don't fail the request if email sending fails
  }
};