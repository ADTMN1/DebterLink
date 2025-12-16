import rateLimit from 'express-rate-limit';

// Login limiter
export const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5, // max 5 attempts per IP
  message: 'Too many login attempts, please try again later.'
});

// Forgot-password limiter
export const forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // max 3 attempts per IP
  message: 'Too many password reset requests, please try again later.'
});
