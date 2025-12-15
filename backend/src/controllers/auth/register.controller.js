import registerQuery from "../../services/authService/register.query.js";
import bcrypt from "bcryptjs";

/**
 * ADMIN-ONLY USER REGISTRATION
 * No tokens are issued here
 */
export const registerController = async (req, res) => {
  try {
    const {
      full_name,
      email,
      password,
      confirmPassword,
      phone_number,
      role_id,
    } = req.body;

    /* ===============================
       1. Required fields
    =============================== */
    if (!full_name || !email || !password || !confirmPassword || !role_id) {
      return res.status(400).json({ error: "Invalid registration data" });
    }

    /* ===============================
       2. Normalize input
    =============================== */
    const normalizedEmail = email.toLowerCase().trim();
    const normalizedName = full_name.trim();

    /* ===============================
       3. Email validation
    =============================== */
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({ error: "Invalid registration data" });
    }

    /* ===============================
       4. Password policy
    =============================== */
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Invalid registration data" });
    }

    const strongRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!strongRegex.test(password)) {
      return res.status(400).json({ error: "Weak password" });
    }

    /* ===============================
       5. Role escalation prevention
    =============================== */
    const ALLOWED_ROLES = [2, 3, 4]; // example: teacher, student, parent
    if (!ALLOWED_ROLES.includes(Number(role_id))) {
      return res.status(403).json({ error: "Unauthorized role assignment" });
    }

    /* ===============================
       6. Check user existence
    =============================== */
    const userExists = await registerQuery.checkUserExists(normalizedEmail);
    if (userExists) {
      // Generic message to prevent email enumeration
      return res.status(400).json({ error: "Invalid registration data" });
    }

    /* ===============================
       7. Secure password hashing
    =============================== */
    const hashedPassword = await bcrypt.hash(password, 12);

    /* ===============================
       8. Create user
    =============================== */
    const user = await registerQuery.createUser(
      normalizedName,
      normalizedEmail,
      hashedPassword,
      phone_number || null,
      role_id
    );

    /* ===============================
       9. Response (NO TOKENS)
    =============================== */
    return res.status(201).json({
      message: "User registered successfully",
      user: {
        user_id: user.user_id,
        full_name: user.full_name,
        email: user.email,
        role_id: user.role_id,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ error: "Registration failed" });
  }
};
