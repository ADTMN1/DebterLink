// src/controllers/auth/setPassword.controller.js
import { setUserPassword } from "../../services/authService/setPassword.service.js";

export const setPasswordController = async (req, res) => {
  try {
    const { userId, password } = req.body;
    const adminId = req.user?.user_id; // Get admin ID from auth middleware

    // Validate inputs
    if (!userId || !password) {
      return res.status(400).json({ 
        message: "User ID and new password are required" 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        message: "Password must be at least 6 characters long" 
      });
    }

    // Password strength validation (optional but recommended)
    const strongRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])/;
    if (!strongRegex.test(password)) {
      return res.status(400).json({
        message: "Password must include uppercase, lowercase, number, and special character",
      });
    }

    const result = await setUserPassword({ userId, password, adminId });

    if (!result.ok) {
      switch (result.reason) {
        case "user_not_found":
          return res.status(404).json({ message: "User not found" });
        case "password_too_short":
          return res.status(400).json({ message: "Password must be at least 6 characters" });
        case "database_error":
          return res.status(500).json({ message: "Database error occurred" });
        default:
          return res.status(400).json({ message: "Unable to set password" });
      }
    }

    return res.status(200).json({ 
      message: `Password has been set successfully for ${result.user_name}`,
      user_id: result.user_id
    });

  } catch (error) {
    console.error("setPasswordController error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
