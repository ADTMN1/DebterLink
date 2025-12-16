// In src/utils/helpers.js
import crypto from 'crypto';
import nodemailer from 'nodemailer';

// Generate a secure random password
export const generateTemporaryPassword = () => {
  const length = 16;
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  const randomValues = crypto.randomBytes(length);
  let password = "";
  
  for (let i = 0; i < length; i++) {
    password += charset[randomValues[i] % charset.length];
  }
  
  return password;
};

// Send welcome email with password reset link
export const sendWelcomeEmail = async (email, name, token, userId) => {
  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}&user=${userId}`;
  
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT, 10),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM || 'noreply@yourschoolsystem.com',
    to: email,
    subject: 'Welcome to Our School Management System',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Welcome, ${name}!</h2>
        <p>Your school account has been successfully created.</p>
        <p>Please click the button below to set your password and log in:</p>
        <p>
          <a href="${resetLink}" 
             style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">
            Set Password
          </a>
        </p>
        <p>This link will expire in 24 hours.</p>
        <p>If you didn't request this, please contact support immediately.</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending welcome email:', error);
    // Don't fail the request if email sending fails
  }
};