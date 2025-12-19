import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import db from '../../../config/db.config.js';

export const setupPassword = async (req, res) => {
  const client = await db.connect();
  
  try {
    const { token, user_id, password } = req.body;
    
    // Input validation
    if (!token || !user_id || !password) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Token, user ID, and password are required'
      });
    }

    // Password strength validation
    if (password.length < 8) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Password must be at least 8 characters long'
      });
    }

    // Hash the token to compare with stored hash
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    // Start transaction
    await client.query('BEGIN');

    // Find and validate the reset token
    const tokenQuery = await client.query(
      `SELECT id, user_id, email, expires_at, used_at 
       FROM password_reset_tokens 
       WHERE token_hash = $1 AND user_id = $2`,
      [tokenHash, user_id]
    );

    if (tokenQuery.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        error: 'Invalid Token',
        message: 'This setup link is invalid'
      });
    }

    const resetToken = tokenQuery.rows[0];

    // Check if token has expired
    if (new Date() > new Date(resetToken.expires_at)) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        error: 'Token Expired',
        message: 'This setup link has expired'
      });
    }

    // Check if token has already been used
    if (resetToken.used_at) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        error: 'Token Used',
        message: 'This setup link has already been used'
      });
    }

    // Verify user exists
    const userQuery = await client.query(
      'SELECT user_id, email FROM users WHERE user_id = $1',
      [user_id]
    );

    if (userQuery.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        error: 'User Not Found',
        message: 'User account not found'
      });
    }

    const user = userQuery.rows[0];

    // Additional security: verify email matches
    if (user.email !== resetToken.email) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        error: 'Email Mismatch',
        message: 'Security validation failed'
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update user password and status
    await client.query(
      'UPDATE users SET password = $1, password_status = $2 WHERE user_id = $3',
      [hashedPassword, 'permanent', user_id]
    );

    // Mark token as used
    await client.query(
      'UPDATE password_reset_tokens SET used_at = CURRENT_TIMESTAMP WHERE id = $1',
      [resetToken.id]
    );

    // Log the password setup for audit
    await client.query(
      `INSERT INTO password_change_log (user_id, change_type, ip_address, user_agent)
       VALUES ($1, 'initial_setup', $2, $3)`,
      [user_id, req.ip, req.get('User-Agent')]
    );

    await client.query('COMMIT');

    return res.status(200).json({
      success: true,
      message: 'Password set successfully'
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Password setup error:', error);
    
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'An unexpected error occurred'
    });
  } finally {
    client.release();
  }
};

// Token validation endpoint (optional, for frontend pre-validation)
export const validateSetupToken = async (req, res) => {
  const client = await db.connect();
  
  try {
    const { token, user_id } = req.body;
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const tokenQuery = await client.query(
      `SELECT expires_at, used_at 
       FROM password_reset_tokens 
       WHERE token_hash = $1 AND user_id = $2`,
      [tokenHash, user_id]
    );

    if (tokenQuery.rows.length === 0) {
      return res.status(400).json({
        error: 'Invalid Token',
        message: 'This setup link is invalid'
      });
    }

    const resetToken = tokenQuery.rows[0];

    if (new Date() > new Date(resetToken.expires_at)) {
      return res.status(400).json({
        error: 'Token Expired',
        message: 'This setup link has expired'
      });
    }

    if (resetToken.used_at) {
      return res.status(400).json({
        error: 'Token Used',
        message: 'This setup link has already been used'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Token is valid'
    });

  } catch (error) {
    console.error('Token validation error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Token validation failed'
    });
  } finally {
    client.release();
  }
};
