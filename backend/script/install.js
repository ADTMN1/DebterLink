import { Client } from 'pg';
import('dotenv/config');

const url = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_P5GZUqecF2lX@ep-silent-hill-ahkoezyl-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
const client = new Client({
  connectionString: url,
  ssl: { rejectUnauthorized: false } // Required for Neon
});

async function setupDB() {
  try {
    await client.connect();
    console.log("Connected to Neon!");

    // Step 0: Create schema
    console.log("Creating schema: school");
    await client.query(`CREATE SCHEMA IF NOT EXISTS school;`);

    // Step 1: Create Role table
    console.log("Creating table: role");
    await client.query(`
      CREATE TABLE IF NOT EXISTS school.role (
        role_id SERIAL PRIMARY KEY,
        role_name VARCHAR(50) NOT NULL
      );
    `);

    // Step 2: Create Exam Type table
    console.log("Creating table: exam_type");
    await client.query(`
      CREATE TABLE IF NOT EXISTS school.exam_type (
        exam_type_id SERIAL PRIMARY KEY,
        name VARCHAR(50)
      );
    `);

    // Step 3: Create School table (director_id can be NULL for now)
    console.log("Creating table: school");
    await client.query(`
      CREATE TABLE IF NOT EXISTS school.school (
        school_id SERIAL PRIMARY KEY,
        school_name VARCHAR(100) NOT NULL,
        address TEXT,
        phone VARCHAR(20),
        email VARCHAR(100),
        website VARCHAR(100),
        director_id INT NULL
      );
    `);

    // Step 4: Create User table
    console.log("Creating table: user");
    await client.query(`
      CREATE TABLE IF NOT EXISTS school."user" (
        user_id SERIAL PRIMARY KEY,
        role_id INT REFERENCES school.role(role_id),
        full_name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        phone_number VARCHAR(20)
      );
    `);

    // Step 5: Create Director table
    console.log("Creating table: director");
    await client.query(`
      CREATE TABLE IF NOT EXISTS school.director (
        director_id SERIAL PRIMARY KEY,
        user_id INT REFERENCES school."user"(user_id),
        managed_school_id INT REFERENCES school.school(school_id),
        office_number VARCHAR(20),
        office_phone_number VARCHAR(20),
        start_date DATE,
        end_date DATE
      );
    `);

    // Step 6: Create Teacher table
    console.log("Creating table: teacher");
    await client.query(`
      CREATE TABLE IF NOT EXISTS school.teacher (
        teacher_id SERIAL PRIMARY KEY,
        user_id INT REFERENCES school."user"(user_id),
        salary NUMERIC(12,2),
        specialization VARCHAR(100),
        advisor_class_id INT NULL
      );
    `);

    // Step 7: Create Class table
    console.log("Creating table: class");
    await client.query(`
      CREATE TABLE IF NOT EXISTS school.class (
        class_id SERIAL PRIMARY KEY,
        school_id INT REFERENCES school.school(school_id),
        class_name VARCHAR(50),
        section VARCHAR(10),
        class_teacher_id INT NULL REFERENCES school.teacher(teacher_id),
        academic_year VARCHAR(20)
      );
    `);

    // Step 8: Create Student table
    console.log("Creating table: student");
    await client.query(`
      CREATE TABLE IF NOT EXISTS school.student (
        student_id SERIAL PRIMARY KEY,
        user_id INT REFERENCES school."user"(user_id),
        class_id INT REFERENCES school.class(class_id),
        enrollment_date DATE,
        overall_result VARCHAR(50),
        teacher_comment TEXT,
        behavioral_comment TEXT,
        status VARCHAR(20) DEFAULT 'active'
      );
    `);

    // Step 9: Create Parent table
    console.log("Creating table: parent");
    await client.query(`
      CREATE TABLE IF NOT EXISTS school.parent (
        parent_id SERIAL PRIMARY KEY,
        user_id INT REFERENCES school."user"(user_id),
        address TEXT,
        child_student_id INT REFERENCES school.student(student_id),
        occupation VARCHAR(100)
      );
    `);

    // Step 10: Create Subject table
    console.log("Creating table: subject");
    await client.query(`
      CREATE TABLE IF NOT EXISTS school.subject (
        subject_id SERIAL PRIMARY KEY,
        subject_name VARCHAR(100),
        subject_code VARCHAR(50),
        teacher_id INT REFERENCES school.teacher(teacher_id)
      );
    `);

    // Step 11: Create Student Attendance table
    console.log("Creating table: student_attendance");
    await client.query(`
      CREATE TABLE IF NOT EXISTS school.student_attendance (
        attendance_id SERIAL PRIMARY KEY,
        student_id INT REFERENCES school.student(student_id),
        class_id INT REFERENCES school.class(class_id),
        date DATE,
        recorded_by INT REFERENCES school."user"(user_id),
        status VARCHAR(20)
      );
    `);

    // Step 12: Create Teacher Attendance table
    console.log("Creating table: teacher_attendance");
    await client.query(`
      CREATE TABLE IF NOT EXISTS school.teacher_attendance (
        attendance_id SERIAL PRIMARY KEY,
        teacher_id INT REFERENCES school.teacher(teacher_id),
        date DATE,
        status VARCHAR(20),
        check_in TIMESTAMP,
        check_out TIMESTAMP
      );
    `);

    // Step 13: Create Exam table
    console.log("Creating table: exam");
    await client.query(`
      CREATE TABLE IF NOT EXISTS school.exam (
        exam_id SERIAL PRIMARY KEY,
        subject_id INT REFERENCES school.subject(subject_id),
        class_id INT REFERENCES school.class(class_id),
        teacher_id INT REFERENCES school.teacher(teacher_id),
        exam_type_id INT REFERENCES school.exam_type(exam_type_id),
        total_marks NUMERIC(5,2),
        exam_date DATE
      );
    `);

    // Step 14: Create Grade table
    console.log("Creating table: grade");
    await client.query(`
      CREATE TABLE IF NOT EXISTS school.grade (
        grade_id SERIAL PRIMARY KEY,
        student_id INT REFERENCES school.student(student_id),
        subject_id INT REFERENCES school.subject(subject_id),
        total_grade NUMERIC(5,2),
        score NUMERIC(5,2),
        exam_date DATE,
        exam_type_id INT REFERENCES school.exam_type(exam_type_id)
      );
    `);

    // Step 15: Create Assignment table
    console.log("Creating table: assignment");
    await client.query(`
      CREATE TABLE IF NOT EXISTS school.assignment (
        assignment_id SERIAL PRIMARY KEY,
        teacher_id INT REFERENCES school.teacher(teacher_id),
        class_id INT REFERENCES school.class(class_id),
        subject_id INT REFERENCES school.subject(subject_id),
        title VARCHAR(200),
        file_url TEXT,
        score NUMERIC(5,2),
        feedback TEXT,
        description TEXT,
        due_date DATE
      );
    `);

    // Step 16: Create Message table
    console.log("Creating table: message");
    await client.query(`
      CREATE TABLE IF NOT EXISTS school.message (
        message_id SERIAL PRIMARY KEY,
        sender_id INT REFERENCES school."user"(user_id),
        receiver_id INT REFERENCES school."user"(user_id),
        content TEXT,
        sent_date TIMESTAMP DEFAULT NOW(),
        attachment_url TEXT,
        seen_status BOOLEAN DEFAULT FALSE
      );
    `);

    // Step 17: Create Appeal table
    console.log("Creating table: appeal");
    await client.query(`
      CREATE TABLE IF NOT EXISTS school.appeal (
        appeal_id SERIAL PRIMARY KEY,
        student_id INT REFERENCES school.student(student_id),
        grade_id INT REFERENCES school.grade(grade_id),
        reason TEXT,
        status VARCHAR(20) DEFAULT 'Pending',
        director_comment TEXT,
        resolved_by INT REFERENCES school.director(director_id)
      );
    `);

    // Step 18: Create Salary table
    console.log("Creating table: salary");
    await client.query(`
      CREATE TABLE IF NOT EXISTS school.salary (
        salary_id SERIAL PRIMARY KEY,
        user_id INT REFERENCES school."user"(user_id),
        net_salary NUMERIC(12,2) NOT NULL
      );
    `);

    console.log("All schemas and tables created successfully!");
  } catch (err) {
    console.error("Error creating schemas/tables:", err);
  } finally {
    await client.end();
  }
}

setupDB();
