import pool from "../../../config/db.config.js";

// -------------------- Basic CRUD Operations --------------------
const createStudent = async (data) => {
  try {
    const { user_id, class_id, enrollment_date, status = 'active', full_name, email, password, school_id } = data;
    
    let finalUserId = user_id;
    
    // If no user_id provided, create a new user first
    if (!user_id && full_name && email && password) {
      // Check if email already exists
      const emailCheck = await pool.query('SELECT user_id FROM users WHERE email = $1', [email]);
      if (emailCheck.rows.length > 0) {
        throw new Error('Email already exists');
      }
      
      const userQuery = `
        INSERT INTO users (full_name, email, password, role_id)
        VALUES ($1, $2, $3, 5)
        RETURNING user_id;
      `;
      const userResult = await pool.query(userQuery, [full_name, email, password]);
      finalUserId = userResult.rows[0].user_id;
    }
    
    if (!finalUserId) {
      throw new Error('User ID is required or provide full_name, email, and password to create new user');
    }
    
    const query = `
      INSERT INTO student (user_id, class_id, enrollment_date, status)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const result = await pool.query(query, [finalUserId, class_id, enrollment_date, status]);
    return result.rows[0];
  } catch (error) {
    console.log(error);
    
    // Handle specific database errors
    if (error.code === '23505') {
      if (error.detail?.includes('email')) {
        throw new Error('Email already exists');
      }
      throw new Error('Duplicate entry detected');
    }
    
    throw error;
  }
};

const updateStudent = async (student_id, data) => {
  try {
    const { class_id, overall_result, teacher_comment, behavioral_comment, status } = data;
    const query = `
      UPDATE student 
      SET class_id = COALESCE($1, class_id),
          overall_result = COALESCE($2, overall_result),
          teacher_comment = COALESCE($3, teacher_comment),
          behavioral_comment = COALESCE($4, behavioral_comment),
          status = COALESCE($5, status)
      WHERE student_id = $6
      RETURNING *;
    `;
    const values = [class_id, overall_result, teacher_comment, behavioral_comment, status, student_id];
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const deleteStudent = async (student_id) => {
  try {
    const query = `DELETE FROM student WHERE student_id = $1 RETURNING *;`;
    const result = await pool.query(query, [student_id]);
    return result.rows[0];
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getStudentById = async (student_id) => {
  try {
    const query = `
      SELECT s.*, u.full_name, u.email, c.class_name, c.section, c.grade, sch.school_name
      FROM student s
      JOIN users u ON s.user_id = u.user_id
      LEFT JOIN class c ON s.class_id = c.class_id
      LEFT JOIN school sch ON c.school_id = sch.school_id
      WHERE s.student_id = $1;
    `;
    const result = await pool.query(query, [student_id]);
    return result.rows[0];
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getAllStudents = async () => {
  try {
    const query = `
      SELECT s.*, u.full_name, u.email, c.class_name, c.section, c.grade, sch.school_name
      FROM student s
      JOIN users u ON s.user_id = u.user_id
      LEFT JOIN class c ON s.class_id = c.class_id
      LEFT JOIN school sch ON c.school_id = sch.school_id
      ORDER BY u.full_name;
    `;
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// -------------------- Filters --------------------
const getStudentsBySchool = async (school_id) => {
  try {
    const query = `
      SELECT s.*, u.full_name, u.email, c.class_name, c.section, c.grade
      FROM student s
      JOIN users u ON s.user_id = u.user_id
      LEFT JOIN class c ON s.class_id = c.class_id
      WHERE c.school_id = $1
      ORDER BY c.grade, c.class_name, u.full_name;
    `;
    const result = await pool.query(query, [school_id]);
    return result.rows;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getStudentsByClass = async (class_id) => {
  try {
    const query = `
      SELECT s.*, u.full_name, u.email, c.class_name, c.section, c.grade
      FROM student s
      JOIN users u ON s.user_id = u.user_id
      LEFT JOIN class c ON s.class_id = c.class_id
      WHERE s.class_id = $1
      ORDER BY u.full_name;
    `;
    const result = await pool.query(query, [class_id]);
    return result.rows;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getStudentsByStatus = async (status) => {
  try {
    const query = `
      SELECT s.*, u.full_name, u.email, c.class_name, c.section, c.grade, sch.school_name
      FROM student s
      JOIN users u ON s.user_id = u.user_id
      LEFT JOIN class c ON s.class_id = c.class_id
      LEFT JOIN school sch ON c.school_id = sch.school_id
      WHERE s.status = $1
      ORDER BY u.full_name;
    `;
    const result = await pool.query(query, [status]);
    return result.rows;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// -------------------- Advanced Operations --------------------
const bulkCreateStudents = async (students) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Validate input
    if (!Array.isArray(students) || students.length === 0) {
      throw new Error('Students array is required and cannot be empty');
    }
    
    if (students.length > 100) {
      throw new Error('Cannot create more than 100 students at once');
    }
    
    const results = [];
    const createdEmails = new Set();
    
    for (let i = 0; i < students.length; i++) {
      const studentData = students[i];
      const { user_id, class_id, enrollment_date, status, full_name, email, password } = studentData;
      
      // Validate required fields
      if (!class_id || !enrollment_date) {
        throw new Error(`Student ${i + 1}: class_id and enrollment_date are required`);
      }
      
      let finalUserId = user_id;
      
      // If no user_id provided, create a new user first
      if (!user_id && full_name && email && password) {
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          throw new Error(`Student ${i + 1}: Invalid email format`);
        }
        
        // Check for duplicate emails in this batch
        if (createdEmails.has(email)) {
          throw new Error(`Student ${i + 1}: Duplicate email in this batch: ${email}`);
        }
        createdEmails.add(email);
        
        // Check if email already exists in database
        const emailCheck = await client.query('SELECT user_id FROM users WHERE email = $1', [email]);
        if (emailCheck.rows.length > 0) {
          throw new Error(`Student ${i + 1}: Email already exists: ${email}`);
        }
        
        // Validate password strength
        if (password.length < 6) {
          throw new Error(`Student ${i + 1}: Password must be at least 6 characters`);
        }
        
        // Create user account
        const userQuery = `
          INSERT INTO users (full_name, email, password, role_id)
          VALUES ($1, $2, $3, 5)
          RETURNING user_id;
        `;
        const userResult = await client.query(userQuery, [full_name.trim(), email.toLowerCase().trim(), password]);
        finalUserId = userResult.rows[0].user_id;
      }
      
      // Validate enrollment date
      const enrollmentDate = new Date(enrollment_date);
      if (isNaN(enrollmentDate.getTime())) {
        throw new Error(`Student ${i + 1}: Invalid enrollment date format`);
      }
      
      // Validate status
      const validStatuses = ['active', 'inactive', 'suspended'];
      if (status && !validStatuses.includes(status)) {
        throw new Error(`Student ${i + 1}: Invalid status. Must be: ${validStatuses.join(', ')}`);
      }
      
      // Create student record
      const studentQuery = `
        INSERT INTO student (user_id, class_id, enrollment_date, status)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
      `;
      const result = await client.query(studentQuery, [finalUserId, class_id, enrollment_date, status || 'active']);
      results.push(result.rows[0]);
    }
    
    await client.query('COMMIT');
    return results;
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Bulk create students error:', error);
    
    // Handle specific database errors
    if (error.code === '23505') {
      if (error.detail?.includes('email')) {
        throw new Error('Email already exists');
      }
      if (error.detail?.includes('student')) {
        throw new Error('Duplicate student record detected');
      }
      throw new Error('Duplicate entry detected');
    }
    
    if (error.code === '23503') {
      throw new Error('Invalid class_id or user_id - reference not found');
    }
    
    if (error.code === '23502') {
      throw new Error('Missing required field');
    }
    
    throw error;
    
  } finally {
    client.release();
  }
};

const bulkUpdateStudents = async (students) => {
  try {
    const results = [];
    for (const studentData of students) {
      const { student_id, class_id, overall_result, teacher_comment, behavioral_comment, status } = studentData;
      const query = `
        UPDATE student 
        SET class_id = COALESCE($1, class_id),
            overall_result = COALESCE($2, overall_result),
            teacher_comment = COALESCE($3, teacher_comment),
            behavioral_comment = COALESCE($4, behavioral_comment),
            status = COALESCE($5, status)
        WHERE student_id = $6
        RETURNING *;
      `;
      const result = await pool.query(query, [class_id, overall_result, teacher_comment, behavioral_comment, status, student_id]);
      results.push(result.rows[0]);
    }
    return results;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const bulkDeleteStudents = async (student_ids) => {
  try {
    const results = [];
    for (const student_id of student_ids) {
      const query = `DELETE FROM student WHERE student_id = $1 RETURNING *;`;
      const result = await pool.query(query, [student_id]);
      if (result.rows[0]) results.push(result.rows[0]);
    }
    return results;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// -------------------- Statistics --------------------
const getStudentStatistics = async (school_id) => {
  try {
    const query = `
      SELECT 
        COUNT(*) as total_students,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_students,
        COUNT(CASE WHEN status = 'inactive' THEN 1 END) as inactive_students,
        COUNT(CASE WHEN status = 'suspended' THEN 1 END) as suspended_students,
        COUNT(DISTINCT class_id) as classes_with_students,
        COUNT(CASE WHEN class_id IS NOT NULL THEN 1 END) as assigned_students
      FROM student s
      LEFT JOIN class c ON s.class_id = c.class_id
      WHERE c.school_id = $1 OR s.class_id IS NULL;
    `;
    const result = await pool.query(query, [school_id]);
    return result.rows[0];
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// -------------------- Role-specific Methods --------------------
const getStudentIdByUserId = async (user_id) => {
  try {
    const query = `SELECT student_id FROM student WHERE user_id = $1;`;
    const result = await pool.query(query, [user_id]);
    return result.rows[0]?.student_id || null;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getTeacherStudents = async (teacher_id) => {
  try {
    const query = `
      SELECT s.*, u.full_name, u.email, c.class_name, c.section, c.grade
      FROM student s
      JOIN users u ON s.user_id = u.user_id
      JOIN class c ON s.class_id = c.class_id
      WHERE c.class_teacher_id = $1
      ORDER BY c.class_name, c.section, u.full_name;
    `;
    const result = await pool.query(query, [teacher_id]);
    return result.rows;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getParentStudents = async (parent_id) => {
  try {
    const query = `
      SELECT s.*, u.full_name, u.email, c.class_name, c.section, c.grade, sch.school_name
      FROM student s
      JOIN users u ON s.user_id = u.user_id
      LEFT JOIN class c ON s.class_id = c.class_id
      LEFT JOIN school sch ON c.school_id = sch.school_id
      JOIN parent p ON p.student_id = s.student_id
      WHERE p.parent_id = $1
      ORDER BY c.grade, c.class_name, u.full_name;
    `;
    const result = await pool.query(query, [parent_id]);
    return result.rows;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default {
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentById,
  getAllStudents,
  getStudentsBySchool,
  getStudentsByClass,
  getStudentsByStatus,
  bulkCreateStudents,
  bulkUpdateStudents,
  bulkDeleteStudents,
  getStudentStatistics,
  getStudentIdByUserId,
  getTeacherStudents,
  getParentStudents
};
