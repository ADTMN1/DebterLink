// src/controllers/auth/resetPassword.controller.js

import { resetPasswordForRecord } from "../../services/authService/passwordReset.service.js";

export const resetPasswordController = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: "token and newPassword are required" });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }
    const strongRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])/;
    if (!strongRegex.test(newPassword)) {
      return res.status(400).json({
        message: "Password must include uppercase, lowercase, number, and special character",
      });
    }

    const result = await resetPasswordForRecord({
      tokenRaw: token,
      newPassword,
    });

    if (!result.ok) {
      switch (result.reason) {
        case "invalid_token":
          return res.status(400).json({ message: "Invalid password reset token" });
        case "token_expired":
          return res.status(400).json({ message: "Token expired" });
        case "token_already_used":
          return res.status(400).json({ message: "Token already used" });
        default:
          return res.status(400).json({ message: "Unable to reset password" });
      }
    }

    return res.status(200).json({ message: "Password has been reset successfully" });

  } catch (error) {
    console.error("resetPasswordController error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
