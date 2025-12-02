-- ============================================
--  School Management System – Full SQL Schema
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
    email VARCHAR(120),
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
    phone_number VARCHAR(20)
);

-- =====================
-- 4. Director
-- =====================
CREATE TABLE director (
    director_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id),
    managed_school_id UUID REFERENCES school(school_id),
    office_number VARCHAR(20),
    office_phoneNumber VARCHAR(25),
    start_date DATE,
    end_date DATE
);

-- Update FK for school (director_id)
ALTER TABLE school
ADD CONSTRAINT fk_school_director
FOREIGN KEY (director_id) REFERENCES director(director_id);

-- =====================
-- 5. Class / Section
-- =====================
CREATE TABLE class (
    class_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID REFERENCES school(school_id),
    class_name VARCHAR(50),
    section VARCHAR(10),
    class_teacher_id UUID,
    academic_year VARCHAR(15)
);

-- =====================
-- 6. Student
-- =====================
CREATE TABLE student (
    student_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id),
    class_id UUID REFERENCES class(class_id),
    enrollment_date DATE,
    overall_result VARCHAR(20),
    teacher_comment TEXT,
    behavioral_comment TEXT,
    status VARCHAR(20)
);

-- =====================
-- 7. Teacher
-- =====================
CREATE TABLE teacher (
    teacher_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id),
    salary NUMERIC(10,2),
    specialization VARCHAR(120),
    advisor_class_id UUID REFERENCES class(class_id)
);

-- Update class FK for class_teacher_id
ALTER TABLE class
ADD CONSTRAINT fk_class_teacher FOREIGN KEY (class_teacher_id)
REFERENCES teacher(teacher_id);

-- =====================
-- 8. Parent
-- =====================
CREATE TABLE parent (
    parent_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id),
    address TEXT,
    child_student_id UUID REFERENCES student(student_id),
    occupation VARCHAR(120)
);

-- =====================
-- 9. Super Admin
-- =====================
CREATE TABLE super_admin (
    super_admin_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id)
);

-- =====================
-- 10. Admin
-- =====================
CREATE TABLE admin (
    admin_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id),
    school_id UUID REFERENCES school(school_id)
);

-- =====================
-- 11. Subject
-- =====================
CREATE TABLE subject (
    subject_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_name VARCHAR(100),
    subject_code VARCHAR(30),
    teacher_id UUID REFERENCES teacher(teacher_id)
);

-- =====================
-- 12. Schedules
-- =====================
CREATE TABLE schedules (
    schedule_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID REFERENCES teacher(teacher_id),
    class_id UUID REFERENCES class(class_id),
    subject_id UUID REFERENCES subject(subject_id),
    start_time TIME,
    end_time TIME,
    day_of_week INT
);

-- =====================
-- 13. Salary
-- =====================
CREATE TABLE salary (
    salary_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id),
    net_salary NUMERIC(10,2)
);

-- =====================
-- 14. Student Attendance
-- =====================
CREATE TABLE student_attendance (
    attendance_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES student(student_id),
    class_id UUID REFERENCES class(class_id),
    date DATE,
    record_by UUID REFERENCES teacher(teacher_id),
    shift VARCHAR(20),
    status VARCHAR(10)
);

-- =====================
-- 15. Teacher Attendance
-- =====================
CREATE TABLE teacher_attendance (
    attendance_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID REFERENCES teacher(teacher_id),
    date DATE,
    status VARCHAR(20),
    check_in TIMESTAMP,
    check_out TIMESTAMP
);

-- =====================
-- 16. Exam Types
-- =====================
CREATE TABLE exam_types (
    exam_type_id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    semester VARCHAR(20)
);

-- =====================
-- 17. Exam
-- =====================
CREATE TABLE exam (
    exam_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id UUID REFERENCES subject(subject_id),
    class_id UUID REFERENCES class(class_id),
    teacher_id UUID REFERENCES teacher(teacher_id),
    exam_type_id INT REFERENCES exam_types(exam_type_id),
    total_marks INT,
    exam_date DATE
);

-- =====================
-- 18. Grade
-- =====================
CREATE TABLE grade (
    grade_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES student(student_id),
    subject_id UUID REFERENCES subject(subject_id),
    total_grade INT,
    score INT,
    exam_date DATE
);

-- =====================
-- 19. Assignment
-- =====================
CREATE TABLE assignment (
    assignment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID REFERENCES teacher(teacher_id),
    class_id UUID REFERENCES class(class_id),
    subject_id UUID REFERENCES subject(subject_id),
    title VARCHAR(150),
    file_url TEXT,
    score INT,
    feedback TEXT,
    description TEXT,
    due_date DATE,
    late_submission_penalty VARCHAR(50)
);

-- =====================
-- 20. Messages
-- =====================
CREATE TABLE messages (
    message_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID REFERENCES users(user_id),
    receiver_id UUID REFERENCES users(user_id),
    content TEXT,
    sent_date TIMESTAMP,
    attachment_url TEXT,
    seen_status BOOLEAN DEFAULT FALSE
);

-- =====================
-- 21. Appeal
-- =====================
CREATE TABLE appeal (
    appeal_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES student(student_id),
    grade_id UUID REFERENCES grade(grade_id),
    reason TEXT,
    status VARCHAR(20),
    director_comment TEXT,
    stakeholder VARCHAR(100)
);

-- =====================
-- 22. Timetable
-- =====================
CREATE TABLE timetable (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID REFERENCES class(class_id),
    subject_id UUID REFERENCES subject(subject_id),
    teacher_id UUID REFERENCES teacher(teacher_id),
    day_of_week INT,
    period_number INT
);

-- =====================
-- 23. Activity Logs
-- =====================
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id),
    school_id UUID REFERENCES school(school_id),
    action VARCHAR(100),
    entity_type VARCHAR(50),
    entity_id UUID,
    metadata JSONB
);

-- =====================
-- 24. Password Reset Tokens
-- =====================
CREATE TABLE password_reset_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id),
    token TEXT,
    token_hash TEXT,
    email VARCHAR(255),
    is_used BOOLEAN DEFAULT FALSE,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
