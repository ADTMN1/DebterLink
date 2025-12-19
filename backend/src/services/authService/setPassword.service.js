// src/services/authService/setPassword.service.js
import { hashPassword } from "../../Utils/hash.js";

export const setUserPassword = async ({ userId, password, adminId }) => {
  // Validate inputs
  if (!userId || !password) {
    return { ok: false, reason: "missing_fields" };
  }

  if (password.length < 6) {
    return { ok: false, reason: "password_too_short" };
  }

  try {
    const db = (await import("../../../config/db.config.js")).default;
    
    // Check if user exists
    const userCheck = await db.query("SELECT user_id, full_name FROM users WHERE user_id = $1", [userId]);
    if (userCheck.rows.length === 0) {
      return { ok: false, reason: "user_not_found" };
    }

    // Hash the new password
    const hashedPassword = await hashPassword(password);

    // Update user password and set status to permanent
    await db.query(
      "UPDATE users SET password = $1, password_status = 'permanent' WHERE user_id = $2",
      [hashedPassword, userId]
    );

    return { 
      ok: true, 
      user_id: userId,
      user_name: userCheck.rows[0].full_name
    };

  } catch (error) {
    console.error("setUserPassword service error:", error);
    return { ok: false, reason: "database_error" };
  }
};
