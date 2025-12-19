-- Migration: Add password_status column to users table
-- Run this SQL to add missing password_status column

ALTER TABLE users ADD COLUMN password_status VARCHAR(20) DEFAULT 'temporary';

-- Set existing users to 'permanent' since they likely have set passwords
UPDATE users SET password_status = 'permanent' WHERE password_status IS NULL;

-- Add comment for documentation
COMMENT ON COLUMN users.password_status IS 'Password status: temporary (auto-generated) or permanent (user-set)';
