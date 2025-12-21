import { StatusCodes } from "http-status-codes";
import StudentService from "../../services/studentService/studentService.js";

// -------------------- Basic CRUD Operations --------------------
const createStudent = async (req, res) => {
  try {
    console.log('User context:', req.user);
    const { user_id, class_id, enrollment_date, status, full_name, email, password } = req.body;
    
    // Get school_id from user context if not provided in body
    const school_id = req.user?.school_id;
    console.log('School ID from context:', school_id);
    
    // Allow creating student without existing user_id (admin creates new student)
    if (!enrollment_date) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: false,
        msg: "Missing required field: enrollment_date"
      });
    }

    const student = await StudentService.createStudent({
      user_id,
      class_id,
      enrollment_date,
      status: status || 'active',
      full_name,
      email,
      password,
      school_id
    });
    
    if (!student) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
        status: false,
        msg: "Failed to create student" 
      });
    }
    
    return res.status(StatusCodes.CREATED).json({
       status: true, 
       msg: "Student created successfully",
       data: student
    });
  } catch (err) {
    console.error(err);
    
    // Handle specific errors
    if (err.message === 'Email already exists') {
      return res.status(StatusCodes.CONFLICT).json({
        status: false,
        msg: "Email already exists. Please use a different email."
      });
    }
    
    if (err.message === 'Duplicate entry detected') {
      return res.status(StatusCodes.CONFLICT).json({
        status: false,
        msg: "Duplicate entry detected. Please check your data."
      });
    }
    
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      status: false,
       msg: "Internal Server Error" 
    });
  }
};

const updateStudent = async (req, res) => {
  try {
    const { student_id } = req.params;
    const { class_id, overall_result, teacher_comment, behavioral_comment, status } = req.body;
    
    if (!student_id) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: false,
        msg: "Student ID is required"
      });
    }

    const student = await StudentService.updateStudent(student_id, {
      class_id,
      overall_result,
      teacher_comment,
      behavioral_comment,
      status
    });
    
    if (!student) {
      return res.status(StatusCodes.NOT_FOUND).json({ 
        status: false,
        msg: "Student not found" 
      });
    }
    
    return res.status(StatusCodes.OK).json({
       status: true, 
       msg: "Student updated successfully",
       data: student
    });
  } catch (err) {
    console.error(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      status: false,
       msg: "Internal Server Error" 
    });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const { student_id } = req.params;
    
    if (!student_id) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: false,
        msg: "Student ID is required"
      });
    }

    const student = await StudentService.deleteStudent(student_id);
    
    if (!student) {
      return res.status(StatusCodes.NOT_FOUND).json({ 
        status: false,
        msg: "Student not found" 
      });
    }
    
    return res.status(StatusCodes.OK).json({
       status: true, 
       msg: "Student deleted successfully",
       data: student
    });
  } catch (err) {
    console.error(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      status: false,
       msg: "Internal Server Error" 
    });
  }
};

const getStudent = async (req, res) => {
  try {
    const { student_id } = req.params;
    
    if (!student_id) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: false,
        msg: "Student ID is required"
      });
    }

    const student = await StudentService.getStudentById(student_id);
    
    if (!student) {
      return res.status(StatusCodes.NOT_FOUND).json({ 
        status: false,
        msg: "Student not found" 
      });
    }
    
    return res.status(StatusCodes.OK).json({
       status: true, 
       msg: "Student retrieved successfully",
       data: student
    });
  } catch (err) {
    console.error(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      status: false,
       msg: "Internal Server Error" 
    });
  }
};

const getAllStudents = async (req, res) => {
  try {
    const students = await StudentService.getAllStudents();
    
    return res.status(StatusCodes.OK).json({
       status: true, 
       msg: "Students retrieved successfully",
       data: students
    });
  } catch (err) {
    console.error(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      status: false,
       msg: "Internal Server Error" 
    });
  }
};

// -------------------- Filters --------------------
const getStudentsBySchool = async (req, res) => {
  try {
    const { school_id } = req.params;
    
    if (!school_id) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: false,
        msg: "School ID is required"
      });
    }

    const students = await StudentService.getStudentsBySchool(school_id);
    
    return res.status(StatusCodes.OK).json({
       status: true, 
       msg: "Students retrieved successfully",
       data: students
    });
  } catch (err) {
    console.error(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      status: false,
       msg: "Internal Server Error" 
    });
  }
};

const getStudentsByClass = async (req, res) => {
  try {
    const { class_id } = req.params;
    
    if (!class_id) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: false,
        msg: "Class ID is required"
      });
    }

    const students = await StudentService.getStudentsByClass(class_id);
    
    return res.status(StatusCodes.OK).json({
       status: true, 
       msg: "Students retrieved successfully",
       data: students
    });
  } catch (err) {
    console.error(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      status: false,
       msg: "Internal Server Error" 
    });
  }
};

const getStudentsByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    
    if (!status) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: false,
        msg: "Status is required"
      });
    }

    const students = await StudentService.getStudentsByStatus(status);
    
    return res.status(StatusCodes.OK).json({
       status: true, 
       msg: "Students retrieved successfully",
       data: students
    });
  } catch (err) {
    console.error(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      status: false,
       msg: "Internal Server Error" 
    });
  }
};

// -------------------- Advanced Operations --------------------
const bulkCreateStudents = async (req, res) => {
  const requestId = `bulk-create-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  console.log(`[${requestId}] Bulk student creation started by user:`, req.user.user_id);
  
  try {
    // Security: Validate user context
    if (!req.user || !req.user.user_id) {
      console.log(`[${requestId}] Authentication failed: No user context`);
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: false,
        msg: "Authentication required",
        error_code: "AUTH_REQUIRED"
      });
    }
    
    // Security: Validate school assignment for School Admins
    if (req.user.role_id === 2 && !req.user.school_id) {
      console.log(`[${requestId}] Access denied: School Admin not assigned to school`);
      return res.status(StatusCodes.FORBIDDEN).json({
        status: false,
        msg: "School Admin must be assigned to a school",
        error_code: "SCHOOL_ASSIGNMENT_REQUIRED"
      });
    }
    
    // Input validation
    const { students } = req.body;
    const school_id = req.user?.school_id;
    
    console.log(`[${requestId}] Request validation:`, {
      studentsCount: students?.length || 0,
      school_id,
      user_role: req.user.role_id
    });
    
    if (!students || !Array.isArray(students)) {
      console.log(`[${requestId}] Invalid input: Students array required`);
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: false,
        msg: "Students array is required",
        error_code: "INVALID_INPUT",
        details: "Request must contain a 'students' array"
      });
    }
    
    if (students.length === 0) {
      console.log(`[${requestId}] Empty array provided`);
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: false,
        msg: "Students array cannot be empty",
        error_code: "EMPTY_ARRAY"
      });
    }
    
    if (students.length > 50) { // Reduced from 100 for security
      console.log(`[${requestId}] Batch size exceeded: ${students.length} > 50`);
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: false,
        msg: "Cannot create more than 50 students at once",
        error_code: "BATCH_SIZE_EXCEEDED"
        // Removed details to prevent information leakage
      });
    }
    
    // Security: Rate limiting check with Redis-like implementation
    const rateLimitKey = `bulk_create_${req.user.user_id}`;
    const userRequests = global.bulkCreateRequests || new Map();
    global.bulkCreateRequests = userRequests;
    
    const userRequestCount = userRequests.get(rateLimitKey) || 0;
    if (userRequestCount >= 3) { // Reduced to 3 requests per hour for security
      console.log(`[${requestId}] Rate limit exceeded for user: ${req.user.user_id}`);
      return res.status(StatusCodes.TOO_MANY_REQUESTS).json({
        status: false,
        msg: "Too many bulk creation requests. Please try again later.",
        error_code: "RATE_LIMIT_EXCEEDED"
      });
    }
    
    userRequests.set(rateLimitKey, userRequestCount + 1);
    setTimeout(() => {
      const currentCount = userRequests.get(rateLimitKey) || 0;
      userRequests.set(rateLimitKey, Math.max(0, currentCount - 1));
    }, 3600000); // Reset after 1 hour
    
    // Security: Input sanitization and validation
    const sanitizedStudents = students.map((student, index) => {
      if (!student || typeof student !== 'object') {
        throw new Error(`Student ${index + 1}: Invalid student data format`);
      }
      
      // Sanitize and validate required fields
      const sanitized = {
        full_name: student.full_name ? String(student.full_name).trim().substring(0, 100) : null,
        email: student.email ? String(student.email).toLowerCase().trim().substring(0, 255) : null,
        password: student.password ? String(student.password).substring(0, 128) : null,
        class_id: student.class_id ? String(student.class_id).trim() : null,
        enrollment_date: student.enrollment_date ? String(student.enrollment_date).trim() : null,
        status: student.status ? String(student.status).trim().toLowerCase() : 'active'
      };
      
      // Validate required fields for user creation
      if (!sanitized.full_name || !sanitized.email || !sanitized.password) {
        throw new Error(`Student ${index + 1}: full_name, email, and password are required`);
      }
      
      return sanitized;
    });
    
    console.log(`[${requestId}] Processing ${sanitizedStudents.length} sanitized students...`);
    const startTime = Date.now();
    
    // Security: Add random delay to prevent timing attacks
    const randomDelay = Math.random() * 100; // 0-100ms random delay
    await new Promise(resolve => setTimeout(resolve, randomDelay));
    
    const results = await StudentService.bulkCreateStudents(sanitizedStudents);
    const processingTime = Date.now() - startTime;
    
    console.log(`[${requestId}] Success: Created ${results.length} students in ${processingTime}ms`);
    
    // Security: Sanitize response data
    const sanitizedResults = results.map(student => ({
      student_id: student.student_id,
      user_id: student.user_id,
      class_id: student.class_id,
      enrollment_date: student.enrollment_date,
      status: student.status
      // Remove sensitive fields like parent_id, comments, etc.
    }));
    
    return res.status(StatusCodes.CREATED).json({
      status: true,
      msg: `${results.length} students created successfully`,
      data: sanitizedResults,
      meta: {
        request_id: requestId,
        processing_time_ms: processingTime,
        created_count: results.length,
        requested_count: sanitizedStudents.length
      }
    });
    
  } catch (err) {
    console.error(`[${requestId}] Bulk create failed:`, {
      error: err.message,
      stack: err.stack,
      user_id: req.user?.user_id
    });
    
    // Handle specific service errors
    if (err.message === 'Students array is required and cannot be empty') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: false,
        msg: "Students array is required and cannot be empty",
        error_code: "INVALID_INPUT",
        request_id: requestId
      });
    }
    
    if (err.message.includes('Email already exists')) {
      return res.status(StatusCodes.CONFLICT).json({
        status: false,
        msg: "One or more emails already exist",
        error_code: "EMAIL_EXISTS",
        request_id: requestId
      });
    }
    
    if (err.message.includes('Invalid email format')) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: false,
        msg: "Invalid email format detected",
        error_code: "INVALID_EMAIL_FORMAT",
        request_id: requestId
      });
    }
    
    if (err.message.includes('Password must be at least 6 characters')) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: false,
        msg: "Password must be at least 6 characters",
        error_code: "WEAK_PASSWORD",
        request_id: requestId
      });
    }
    
    if (err.message.includes('Invalid class_id')) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: false,
        msg: "Invalid class_id provided",
        error_code: "INVALID_CLASS_ID",
        request_id: requestId
      });
    }
    
    if (err.message.includes('Duplicate entry detected')) {
      return res.status(StatusCodes.CONFLICT).json({
        status: false,
        msg: "Duplicate entry detected",
        error_code: "DUPLICATE_ENTRY",
        request_id: requestId
      });
    }
    
    // Database connection errors
    if (err.code === 'ECONNRESET' || err.code === 'ETIMEDOUT') {
      return res.status(StatusCodes.SERVICE_UNAVAILABLE).json({
        status: false,
        msg: "Database connection error. Please try again.",
        error_code: "DATABASE_ERROR",
        request_id: requestId
      });
    }
    
    // Generic error with security considerations
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
      msg: "Internal server error. Please contact support if the problem persists.",
      error_code: "INTERNAL_ERROR",
      request_id: requestId
      // Note: Don't include error details in production for security
    });
  }
};

const bulkUpdateStudents = async (req, res) => {
  try {
    const { students } = req.body;
    
    if (!students || !Array.isArray(students)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: false,
        msg: "Students array is required"
      });
    }
    
    const results = await StudentService.bulkUpdateStudents(students);
    return res.status(StatusCodes.OK).json({
      status: true,
      msg: `${results.length} students updated successfully`,
      data: results
    });
  } catch (err) {
    console.error(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
      msg: "Internal Server Error"
    });
  }
};

const bulkDeleteStudents = async (req, res) => {
  try {
    const { student_ids } = req.body;
    
    if (!student_ids || !Array.isArray(student_ids)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: false,
        msg: "Student IDs array is required"
      });
    }
    
    const results = await StudentService.bulkDeleteStudents(student_ids);
    return res.status(StatusCodes.OK).json({
      status: true,
      msg: `${results.length} students deleted successfully`,
      data: results
    });
  } catch (err) {
    console.error(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
      msg: "Internal Server Error"
    });
  }
};

// -------------------- Statistics --------------------
const getStudentStatistics = async (req, res) => {
  try {
    const { school_id } = req.params;
    
    if (!school_id) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: false,
        msg: "School ID is required"
      });
    }

    const stats = await StudentService.getStudentStatistics(school_id);
    return res.status(StatusCodes.OK).json({
      status: true,
      msg: "Student statistics fetched successfully",
      data: stats
    });
  } catch (err) {
    console.error(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
      msg: "Internal Server Error"
    });
  }
};

// -------------------- Role-specific Methods --------------------
const getTeacherStudents = async (req, res) => {
  try {
    const teacher_id = await StudentService.getStudentIdByUserId(req.user.user_id);
    if (!teacher_id) {
      return res.status(404).json({
        status: false,
        msg: "Teacher not found"
      });
    }
    
    const students = await StudentService.getTeacherStudents(teacher_id);
    return res.status(StatusCodes.OK).json({
      status: true,
      msg: "Teacher students fetched successfully",
      data: students
    });
  } catch (err) {
    console.error(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
      msg: "Internal Server Error"
    });
  }
};

const getParentStudents = async (req, res) => {
  try {
    const parent_id = await StudentService.getStudentIdByUserId(req.user.user_id);
    if (!parent_id) {
      return res.status(404).json({
        status: false,
        msg: "Parent not found"
      });
    }
    
    const students = await StudentService.getParentStudents(parent_id);
    return res.status(StatusCodes.OK).json({
      status: true,
      msg: "Parent students fetched successfully",
      data: students
    });
  } catch (err) {
    console.error(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
      msg: "Internal Server Error"
    });
  }
};

export default {
  createStudent,
  updateStudent,
  deleteStudent,
  getStudent,
  getAllStudents,
  getStudentsBySchool,
  getStudentsByClass,
  getStudentsByStatus,
  bulkCreateStudents,
  bulkUpdateStudents,
  bulkDeleteStudents,
  getStudentStatistics,
  getTeacherStudents,
  getParentStudents
};
