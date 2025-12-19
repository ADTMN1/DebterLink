// In register.controller.js
import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import registerQuery from "../../services/authService/register.query.js";
import db from "../../../config/db.config.js";
import { ROLES } from "../../../constants/roles.js";
import { sendWelcomeEmail } from "../../Utils/helper.js";
import crypto from "crypto";

export const registerController = async (req, res) => {
  // Add request timeout
  const timeout = setTimeout(() => {
    res.status(408).json({ 
      error: "Request Timeout", 
      message: "Registration request timed out" 
    });
  }, 50000); // 50 second timeout

  const client = await db.connect();
  
  try {
    // Input validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      clearTimeout(timeout);
      return res.status(400).json({ 
        error: "Validation failed", 
        details: errors.array() 
      });
    }

    const { school, admin, created_by } = req.body;

    // Verify super admin is creating
    if (!req.user || req.user.role_id !== ROLES.SUPER_ADMIN) {
      clearTimeout(timeout);
      return res.status(403).json({
        error: "Forbidden",
        message: "Only super admin can create schools and admins"
      });
    }
    // Start transaction
    await client.query("BEGIN");

    // Check if user already exists
    const userExists = await registerQuery.checkUserExists(admin.email, client);
    if (userExists) {
      await client.query("ROLLBACK");
    return res.status(409).json({ 
      error: "Conflict", 
      message: "Email already registered" 
    });
  }

  const newSchool = await registerQuery.createSchool({
    school_name: school.name,
    code: school.code,
    email: school.email,
    phone: school.phone,
    address: school.address,
    academic_year: school.academic_year,
    status: school.status || 'active',
    website: school.website
  }, client);

  
  const fullName = `${admin.first_name} ${admin.last_name}`.trim();
  
  // Create admin with placeholder password (will be set via token)
  const placeholderPassword = await bcrypt.hash('placeholder-password-to-be-changed', 12);
  const adminUser = await registerQuery.createUser(
    fullName,
    admin.email,
    placeholderPassword,
    admin.phone,
    ROLES.ADMIN,
    client
  );

  await registerQuery.createAdmin({
    user_id: adminUser.user_id,
    school_id: newSchool.school_id
  }, client);

  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  
  await registerQuery.createPasswordResetToken(
    adminUser.user_id,
    resetToken,
    resetTokenExpiry,
    client
  );

  await client.query("COMMIT");

  // Clear timeout on successful completion
  clearTimeout(timeout);

  await sendWelcomeEmail(
    admin.email,
    admin.first_name,
    resetToken,
    adminUser.user_id
  );

    const response = {
    success: true,
    message: "School and admin registration successful",
    data: {
      school: {
        id: newSchool.school_id,
        name: newSchool.school_name,
        code: newSchool.code ?? school.code,
        email: newSchool.email
      },
      admin: {
        id: adminUser.user_id,
        name: fullName,
        email: adminUser.email,
        role: 'school_admin'
      }
    }
  };

  return res.status(201).json(response);

} catch (error) {
  clearTimeout(timeout);
  await client.query("ROLLBACK");
  console.error("Registration error:", error);
  
  if (error.code === '23505') { // Unique violation
    return res.status(409).json({ 
      error: "Conflict", 
      message: "A record with this information already exists" 
    });
  }
  
  if (error.message.includes('timeout') || error.message.includes('ENOTFOUND')) {
    return res.status(503).json({ 
      error: "Service Unavailable", 
      message: "Database connection timeout. Please try again later." 
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