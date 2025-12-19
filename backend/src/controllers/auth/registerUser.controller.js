// src/controllers/auth/registerUser.controller.js
import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import db from "../../../config/db.config.js";
import { ROLES } from "../../../constants/roles.js";
import { sendWelcomeEmail } from "../../Utils/helper.js";
import crypto from "crypto";

export const registerUserController = async (req, res) => {
  const client = await db.connect();
  
  try {
    // Input validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: "Validation failed", 
        details: errors.array() 
      });
    }

    const { fullName, full_name, email, phone, phone_number, role } = req.body;
    const adminId = req.user.user_id;

    // Handle both camelCase and snake_case field names
    const userName = fullName || full_name;
    const userPhone = phone || phone_number;

    // Verify the requester is an admin
    if (!req.user || req.user.role_id !== ROLES.ADMIN) {
      return res.status(403).json({
        error: "Forbidden",
        message: "Only school admins can register users"
      });
    }

    // Get admin's assigned school
    const adminSchoolQuery = await client.query(
      `SELECT s.school_id, s.school_name 
       FROM admin a 
       JOIN school s ON a.school_id = s.school_id 
       WHERE a.user_id = $1`,
      [adminId]
    );

    if (adminSchoolQuery.rows.length === 0) {
      return res.status(403).json({
        error: "Forbidden",
        message: "Admin is not assigned to any school"
      });
    }

    const school = adminSchoolQuery.rows[0];

    // Start transaction
    await client.query("BEGIN");

    // Check if user already exists
    const userExists = await client.query(
      "SELECT user_id FROM users WHERE email = $1",
      [email]
    );

    if (userExists.rows.length > 0) {
      await client.query("ROLLBACK");
      return res.status(409).json({ 
        error: "Conflict", 
        message: "Email already registered" 
      });
    }

    // Validate user input
    if (!userName || !email) {
      await client.query("ROLLBACK");
      return res.status(400).json({
        error: "Validation failed",
        message: "Name and email are required"
      });
    }

    // Validate role - accept both string names and numeric IDs
    const validRoleNames = ['teacher', 'student', 'parent'];
    const validRoleIds = [ROLES.TEACHER, ROLES.STUDENT, ROLES.PARENT];
    
    let roleId;
    if (typeof role === 'string') {
      // Convert role name to ID
      const roleMap = {
        'teacher': ROLES.TEACHER,
        'student': ROLES.STUDENT,
        'parent': ROLES.PARENT
      };
      roleId = roleMap[role.toLowerCase()];
      
      if (!roleId) {
        await client.query("ROLLBACK");
        return res.status(400).json({
          error: "Invalid role",
          message: "Role must be teacher, student, or parent"
        });
      }
    } else if (typeof role === 'number') {
      // Direct numeric role ID
      if (!validRoleIds.includes(role)) {
        await client.query("ROLLBACK");
        return res.status(400).json({
          error: "Invalid role",
          message: "Role must be teacher, student, or parent"
        });
      }
      roleId = role;
    } else {
      await client.query("ROLLBACK");
      return res.status(400).json({
        error: "Invalid role",
        message: "Role must be teacher, student, or parent"
      });
    }

    // Create user with placeholder password (will be updated via token)
    const placeholderPassword = await bcrypt.hash('placeholder-password-to-be-changed', 12);
    const userResult = await client.query(
      `INSERT INTO users (role_id, full_name, email, phone_number, password, password_status)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING user_id, full_name, email`,
      [roleId, userName, email, userPhone || null, placeholderPassword, 'temporary']
    );

    const newUser = userResult.rows[0];

    // Create password reset token (NO temporary password)
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    
    // Hash and store token
    const tokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    
    await client.query(
      `INSERT INTO password_reset_tokens (user_id, token_hash, email, expires_at)
       VALUES ($1, $2, $3, $4)`,
      [newUser.user_id, tokenHash, email, resetTokenExpiry]
    );

    // Create role-specific record based on role
    let roleQuery;
    switch (roleId) {
      case ROLES.TEACHER:
        roleQuery = client.query(
          "INSERT INTO teacher (user_id, school_id) VALUES ($1, $2)",
          [newUser.user_id, school.school_id]
        );
        break;
      case ROLES.STUDENT:
        roleQuery = client.query(
          "INSERT INTO student (user_id, school_id) VALUES ($1, $2)",
          [newUser.user_id, school.school_id]
        );
        break;
      case ROLES.PARENT:
        roleQuery = client.query(
          "INSERT INTO parent (user_id, school_id) VALUES ($1, $2)",
          [newUser.user_id, school.school_id]
        );
        break;
    }

    await roleQuery;

    await client.query("COMMIT");

    // Send welcome email (fire and forget - non-blocking)
    setImmediate(async () => {
      try {
        await sendWelcomeEmail(
          email,
          userName ? userName.split(' ')[0] : 'User',
          resetToken,
          newUser.user_id
        );
      } catch (emailError) {
        console.error('Welcome email failed:', emailError);
      }
    });

    const response = {
      success: true,
      message: "User registration successful",
      data: {
        user: {
          id: newUser.user_id,
          name: newUser.full_name,
          email: newUser.email,
          role: getRoleName(roleId)
        },
        school: {
          id: school.school_id,
          name: school.school_name
        },
        instructions: "Password setup link has been sent to the user's email"
      }
    };

    return res.status(201).json(response);

  } catch (error) {
    await client.query("ROLLBACK");
    console.error("User registration error:", error);
    
    if (error.code === '23505') {
      return res.status(409).json({ 
        error: "Conflict", 
        message: "A record with this information already exists" 
      });
    }
    
    return res.status(500).json({ 
      error: "Internal Server Error", 
      message: "An unexpected error occurred during registration" 
    });
  } finally {
    client.release();
  }
};

function getRoleName(roleId) {
  const roleNames = {
    [ROLES.TEACHER]: 'teacher',
    [ROLES.STUDENT]: 'student', 
    [ROLES.PARENT]: 'parent'
  };
  return roleNames[roleId] || 'unknown';
}
