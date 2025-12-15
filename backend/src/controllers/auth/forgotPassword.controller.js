import("dotenv/config");
import { findUserByEmail } from "../../services/authService/passwordReset.queries.js";
import { createPasswordResetForUser } from "../../services/authService/passwordReset.service.js";

export const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const user = await findUserByEmail(email);
    let token;

    if (user) {
      const ip = req.ip || req.headers["x-forwarded-for"] || null;
      const userAgent = req.get("User-Agent") || null;

      token = await createPasswordResetForUser({ user, ip, userAgent });
    }

    return res.status(200).json({
      message: "If an account with that email exists, a password reset link has been sent.",
      token // only for testing
    });

  } catch (error) {
    console.error(" forgotPasswordController error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
