-- ============================================
--  School Management System – Secure SQL Schema
-- ============================================

-- Enable UUID generator
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================
-- 1. Roles
-- =====================
CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE
);

-- =====================
-- 2. School
-- =====================
CREATE TABLE school (
    school_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_name VARCHAR(120) NOT NULL,
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(120) NOT NULL,
    website VARCHAR(200),
    director_id UUID
);

-- =====================
-- 3. Users
-- =====================
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id INT REFERENCES roles(role_id),
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    phone_number VARCHAR(20),
    password_status VARCHAR(20) DEFAULT 'temporary' -- 'temporary' or 'permanent'
);

-- =====================
-- 4. Director
-- =====================
CREATE TABLE director (
    director_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,
    managed_school_id UUID UNIQUE REFERENCES school(school_id) ON DELETE SET NULL,
    office_number VARCHAR(20),
    office_phoneNumber VARCHAR(25),
    start_date DATE,
    end_date DATE
);

-- Update FK for school (director_id)
ALTER TABLE school
ADD CONSTRAINT fk_school_director
FOREIGN KEY (director_id) REFERENCES director(director_id) ON DELETE SET NULL;

-- =====================
-- 5. Class / Section
-- =====================
CREATE TABLE class (
    class_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID REFERENCES school(school_id) ON DELETE CASCADE,
    class_name VARCHAR(50) NOT NULL,
    section VARCHAR(10),
    class_teacher_id UUID REFERENCES teacher(teacher_id) ON DELETE SET NULL,
    academic_year VARCHAR(15) NOT NULL
);

-- =====================
-- 6. Student
-- =====================
CREATE TABLE student (
    student_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,
    class_id UUID REFERENCES class(class_id) ON DELETE SET NULL,
    enrollment_date DATE NOT NULL,
    overall_result VARCHAR(20),
    teacher_comment TEXT,
    behavioral_comment TEXT,
    status VARCHAR(20) CHECK (status IN ('active','inactive','suspended'))
);

-- =====================
-- 7. Teacher
-- =====================
CREATE TABLE teacher (
    teacher_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,
    school_id UUID REFERENCES school(school_id) ON DELETE CASCADE,
    salary NUMERIC(10,2) CHECK (salary >= 0),
    specialization VARCHAR(120),
    advisor_class_id UUID REFERENCES class(class_id) ON DELETE SET NULL
);

-- =====================
-- 8. Parent
-- =====================
CREATE TABLE parent (
    parent_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,
    address TEXT,
    child_student_id UUID REFERENCES student(student_id) ON DELETE CASCADE,
    occupation VARCHAR(120)
);

-- =====================
-- 9. Super Admin
-- =====================
CREATE TABLE super_admin (
    super_admin_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES users(user_id) ON DELETE CASCADE
);

-- =====================
-- 10. Admin
-- =====================
CREATE TABLE admin (
    admin_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,
    school_id UUID REFERENCES school(school_id) ON DELETE CASCADE
);

-- =====================
-- 11. Subject
-- =====================
CREATE TABLE subject (
    subject_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_name VARCHAR(100) NOT NULL,
    subject_code VARCHAR(30) UNIQUE NOT NULL,
    teacher_id UUID REFERENCES teacher(teacher_id) ON DELETE SET NULL
);

-- =====================
-- 12. Schedules
-- =====================
CREATE TABLE schedules (
    schedule_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID REFERENCES teacher(teacher_id) ON DELETE CASCADE,
    class_id UUID REFERENCES class(class_id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subject(subject_id) ON DELETE CASCADE,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    day_of_week INT CHECK (day_of_week BETWEEN 1 AND 7)
);

-- =====================
-- 13. Salary
-- =====================
CREATE TABLE salary (
    salary_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    net_salary NUMERIC(10,2) CHECK (net_salary >= 0)
);

-- =====================
-- 14. Student Attendance
-- =====================
CREATE TABLE student_attendance (
    attendance_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES student(student_id) ON DELETE CASCADE,
    class_id UUID REFERENCES class(class_id) ON DELETE CASCADE,
    date DATE NOT NULL,
    record_by UUID REFERENCES teacher(teacher_id) ON DELETE SET NULL,
    shift VARCHAR(20),
    status VARCHAR(10) CHECK (status IN ('present','absent','late'))
);

-- =====================
-- 15. Teacher Attendance
-- =====================
CREATE TABLE teacher_attendance (
    attendance_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID REFERENCES teacher(teacher_id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status VARCHAR(20) CHECK (status IN ('present','absent','leave')),
    check_in TIMESTAMP,
    check_out TIMESTAMP
);

-- =====================
-- 16. Exam Types
-- =====================
CREATE TABLE exam_types (
    exam_type_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    semester VARCHAR(20) NOT NULL
);

-- =====================
-- 17. Exam
-- =====================
CREATE TABLE exam (
    exam_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id UUID REFERENCES subject(subject_id) ON DELETE CASCADE,
    class_id UUID REFERENCES class(class_id) ON DELETE CASCADE,
    teacher_id UUID REFERENCES teacher(teacher_id) ON DELETE SET NULL,
    exam_type_id INT REFERENCES exam_types(exam_type_id) ON DELETE SET NULL,
    total_marks INT CHECK (total_marks >= 0),
    exam_date DATE NOT NULL
);

-- =====================
-- 18. Grade
-- =====================
CREATE TABLE grade (
    grade_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES student(student_id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subject(subject_id) ON DELETE CASCADE,
    total_grade INT CHECK (total_grade >= 0),
    score INT CHECK (score >= 0),
    exam_date DATE
);

-- =====================
-- 19. Assignment
-- =====================
CREATE TABLE assignment (
    assignment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID REFERENCES teacher(teacher_id) ON DELETE SET NULL,
    class_id UUID REFERENCES class(class_id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subject(subject_id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    file_url TEXT,
    score INT CHECK (score >= 0),
    feedback TEXT,
    description TEXT,
    due_date DATE,
    late_submission_penalty VARCHAR(50)
);

-- =====================
-- 20. Assignment Submission
-- =====================
CREATE TABLE assignment_submission (
    submission_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID REFERENCES assignment(assignment_id) ON DELETE CASCADE,
    student_id UUID REFERENCES student(student_id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    remarks TEXT,
    submission_date TIMESTAMP DEFAULT NOW(),
    score INT CHECK (score >= 0),
    feedback TEXT,
    status VARCHAR(20) DEFAULT 'submitted' CHECK (status IN ('submitted', 'graded', 'returned'))
);

-- =====================
-- 21. Messages
-- =====================
CREATE TABLE messages (
    message_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    sent_date TIMESTAMP NOT NULL DEFAULT NOW(),
    attachment_url TEXT,
    seen_status BOOLEAN DEFAULT FALSE
);

-- =====================
-- 21. Appeal
-- =====================
CREATE TABLE appeal (
    appeal_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES student(student_id) ON DELETE CASCADE,
    grade_id UUID REFERENCES grade(grade_id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    status VARCHAR(20) CHECK (status IN ('pending','approved','rejected')),
    director_comment TEXT,
    stakeholder VARCHAR(100)
);

-- =====================
-- 22. Timetable
-- =====================
CREATE TABLE timetable (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID REFERENCES class(class_id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subject(subject_id) ON DELETE CASCADE,
    teacher_id UUID REFERENCES teacher(teacher_id) ON DELETE SET NULL,
    day_of_week INT CHECK (day_of_week BETWEEN 1 AND 7),
    period_number INT CHECK (period_number > 0)
);

ALTER TABLE timetable
ADD CONSTRAINT unique_class_period UNIQUE (class_id, day_of_week, period_number);

-- =====================
-- 23. Activity Logs
-- =====================
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE SET NULL,
    school_id UUID REFERENCES school(school_id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id UUID,
    metadata JSONB
);

-- =====================
-- 24. Password Reset Tokens
-- =====================
CREATE TABLE password_reset_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL,
    email VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE NULL,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for password reset tokens
CREATE INDEX idx_password_reset_tokens_hash ON password_reset_tokens(token_hash);
CREATE INDEX idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);
CREATE INDEX idx_password_reset_tokens_expires ON password_reset_tokens(expires_at);

-- =====================
-- 25. Password Change Log (for audit)
-- =====================
CREATE TABLE password_change_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    change_type VARCHAR(20) NOT NULL CHECK (change_type IN ('initial_setup', 'reset', 'change')),
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================
-- 26. Index Recommendations (optional but advised)
-- =====================
CREATE INDEX idx_student_class ON student(class_id);
CREATE INDEX idx_teacher_user ON teacher(user_id);
CREATE INDEX idx_assignment_class ON assignment(class_id);
CREATE INDEX idx_assignment_submission_assignment ON assignment_submission(assignment_id);
CREATE INDEX idx_assignment_submission_student ON assignment_submission(student_id);
CREATE INDEX idx_grade_student ON grade(student_id);
CREATE INDEX idx_messages_receiver ON messages(receiver_id);
