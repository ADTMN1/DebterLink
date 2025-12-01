// src/controllers/auth/forgotPassword.controller.js
import("dotenv/config");
import { findUserByEmail } from "../../services/Query/Authquery/passwordReset.queries.js";
import { createPasswordResetForUser } from "../../services/Email/passwordReset.service.js";

export const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    // Find user — do not reveal whether user exists in response
    const user = await findUserByEmail(email);

    if (user) {
      // gather ip and user-agent for token record
      const ip = req.ip || req.headers["x-forwarded-for"] || null;
      const userAgent = req.get("User-Agent") || null;

      try {
        await createPasswordResetForUser({ user, ip, userAgent });
      } catch (err) {
        // log but don't leak
        console.error("Error creating/sending reset token:", err);
      }
    }

    //  return success to avoid exposing whether email is registered
    return res.status(200).json({
      message:
        "If an account with that email exists, a password reset link has been sent.",
    });
  } catch (error) {
    console.error("forgotPasswordController error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
