-- Performance optimization indexes
-- Add these indexes to improve query performance

-- Users table indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role_id ON users(role_id);

-- School-related indexes
CREATE INDEX IF NOT EXISTS idx_admin_school_id ON admin(school_id);
CREATE INDEX IF NOT EXISTS idx_teacher_school_id ON teacher(school_id);
CREATE INDEX IF NOT EXISTS idx_student_school_id ON student(school_id) WHERE school_id IS NOT NULL;

-- Authentication and session indexes
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_email ON password_reset_tokens(email);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expires ON password_reset_tokens(expires_at) WHERE is_used = FALSE;

-- Activity logs indexes
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_school_id ON activity_logs(school_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(id) WHERE created_at > NOW() - INTERVAL '30 days';

-- Attendance indexes
CREATE INDEX IF NOT EXISTS idx_student_attendance_date ON student_attendance(date);
CREATE INDEX IF NOT EXISTS idx_student_attendance_student_date ON student_attendance(student_id, date);

-- Message indexes
CREATE INDEX IF NOT EXISTS idx_messages_sender_receiver ON messages(sender_id, receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_sent_date ON messages(sent_date) WHERE sent_date > NOW() - INTERVAL '7 days';
